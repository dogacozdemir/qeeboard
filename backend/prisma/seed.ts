import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create or find demo user (with hashed password)
  const demoPasswordHash = await bcrypt.hash('demo-password', 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@qeeboard.local' },
    update: { password: demoPasswordHash },
    create: {
      name: 'Demo User',
      email: 'demo@qeeboard.local',
      password: demoPasswordHash,
    }
  })

  // Create or find test user (requested)
  const testPasswordHash = await bcrypt.hash('test1234', 12)
  await prisma.user.upsert({
    where: { email: 'test1@test.com' },
    update: { password: testPasswordHash, name: 'Test One' },
    create: { name: 'Test One', email: 'test1@test.com', password: testPasswordHash }
  })

  // Create tags
  const tagDesign = await prisma.tag.upsert({
    where: { id: 1 },
    update: { name: 'Design' },
    create: { name: 'Design' }
  })
  const tagGaming = await prisma.tag.upsert({
    where: { id: 2 },
    update: { name: 'Gaming' },
    create: { name: 'Gaming' }
  })

  // Create a keyboard config with relations
  const config = await prisma.keyboardConfig.create({
    data: {
      userId: user.id,
      name: 'Starter Config',
      description: 'A demo keyboard layout',
      layoutData: { rows: 5, cols: 14 },
      previewUrl: 'https://example.com/preview.png',
      versions: { create: [{ versionName: 'v1', layoutData: { rows: 5, cols: 14 } }] },
      tags: {
        create: [
          { tagId: tagDesign.id },
          { tagId: tagGaming.id }
        ]
      }
    }
  })

  // Create a listing for the config
  const listing = await prisma.configListing.create({
    data: {
      configId: config.id,
      sellerId: user.id,
      priceCents: 2999,
      currency: 'USD',
      stock: 10,
      isActive: true
    }
  })

  // Ensure a cart exists
  await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id }
  })

  // Create addresses
  await prisma.address.createMany({
    data: [
      {
        userId: user.id,
        kind: 'SHIPPING',
        fullName: 'Demo User',
        line1: '123 Demo St',
        city: 'Demo City',
        postalCode: '12345',
        country: 'US'
      },
      {
        userId: user.id,
        kind: 'BILLING',
        fullName: 'Demo User',
        line1: '123 Demo St',
        city: 'Demo City',
        postalCode: '12345',
        country: 'US'
      }
    ]
  })

  console.log('Seed complete:', { userId: user.id, configId: config.id, listingId: listing.id })

  // ===== Test user data: addresses and a rich sample order =====
  const testUser = await prisma.user.findUnique({ where: { email: 'test1@test.com' } })
  if (testUser) {
    // Addresses for test user
    const [shipAddr, billAddr] = await Promise.all([
      prisma.address.upsert({
        where: { id: -1 }, // force create via composite not available; fallback create/find
        update: {},
        create: {
          userId: testUser.id,
          kind: 'SHIPPING',
          fullName: 'Test One',
          line1: '456 Test Avenue',
          city: 'Istanbul',
          postalCode: '34000',
          country: 'TR'
        }
      }),
      prisma.address.upsert({
        where: { id: -2 },
        update: {},
        create: {
          userId: testUser.id,
          kind: 'BILLING',
          fullName: 'Test One',
          line1: '456 Test Avenue',
          city: 'Istanbul',
          postalCode: '34000',
          country: 'TR'
        }
      })
    ]).catch(async () => {
      // Upsert by fake id will fail once; fallback to find existing or create
      const existing = await prisma.address.findMany({ where: { userId: testUser.id } })
      const ship = existing.find(a => a.kind === 'SHIPPING') ?? await prisma.address.create({ data: { userId: testUser.id, kind: 'SHIPPING', fullName: 'Test One', line1: '456 Test Avenue', city: 'Istanbul', postalCode: '34000', country: 'TR' } })
      const bill = existing.find(a => a.kind === 'BILLING') ?? await prisma.address.create({ data: { userId: testUser.id, kind: 'BILLING', fullName: 'Test One', line1: '456 Test Avenue', city: 'Istanbul', postalCode: '34000', country: 'TR' } })
      return [ship, bill]
    }) as any

    // Create an example order with 2 quantities
    const quantity = 2
    const unitPrice = listing.priceCents
    const total = unitPrice * quantity
    const orderDate = new Date()
    const deliveredDate = new Date(orderDate)
    deliveredDate.setDate(deliveredDate.getDate() + 1)

    await prisma.order.create({
      data: {
        userId: testUser.id,
        status: 'FULFILLED',
        totalCents: total,
        currency: listing.currency,
        shippingAddressId: shipAddr.id,
        billingAddressId: billAddr.id,
        deliveredAt: deliveredDate,
        items: {
          create: [
            {
              listingId: listing.id,
              quantity,
              unitPriceCents: unitPrice,
              subtotalCents: total
            }
          ]
        }
      }
    })

    console.log('Added seeded order for test1@test.com')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



