# Backend Overview

## Stack
- Runtime: Node.js (TypeScript)
- Framework: Express
- ORM: Prisma (PostgreSQL)
- Validation: Zod (hazır, opsiyonel)
- Env: dotenv

## Run & Scripts
```bash
# Development
npm run dev

# Build & Start
npm run build && npm start

# Prisma
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:reset
npm run db:studio
```

Server default: http://localhost:5001

## Environment (.env)
```env
PORT=5001
DATABASE_URL="postgresql://qeeboard_dev:dev123@localhost:5432/qeeboard_dev"
CORS_ORIGIN="http://localhost:5173"
JWT_SECRET="dev-super-secret-jwt-key-here"
```

## Project Structure
```
src/
  server.ts            # Express app & route mounting
  lib/
    db.ts              # Prisma client singleton
  routes/
    configs.ts         # /api/configs
    users.ts           # /api/users
    tags.ts            # /api/tags
    favorites.ts       # /api/favorites
    comments.ts        # /api/comments
    analytics.ts       # /api/analytics
    listings.ts        # /api/listings
    cart.ts            # /api/cart
    orders.ts          # /api/orders
    addresses.ts       # /api/addresses
prisma/
  schema.prisma        # DB schema
  seed.ts              # Seed script
```

## Database Schema (Prisma)
- User(id, name, email, password, createdAt, relations: configs, favorites, comments, colorUsages, eventLogs)
- KeyboardConfig(id, userId, name, description?, layoutData, previewUrl?, tags, versions, favorites, comments, createdAt, updatedAt)
- ConfigVersion(id, configId, versionName?, layoutData, createdAt)
- Tag(id, name)
- ConfigTag(id, configId, tagId)
- ConfigFavorite(id, userId, configId, createdAt)
- ConfigComment(id, userId, configId, content, rating?, createdAt)
- AnalyticsColorUsage(id, userId?, color, count, updatedAt)
- AnalyticsEventLog(id, userId?, event, metadata?, createdAt)
// Commerce additions
- ConfigListing(id, configId, sellerId, priceCents, currency, stock?, isActive, createdAt, updatedAt)
- Cart(id, userId unique, createdAt, updatedAt)
- CartItem(id, cartId, listingId unique per cart, quantity)
- Order(id, userId, status, totalCents, currency, shippingAddressId?, billingAddressId?, createdAt)
- OrderItem(id, orderId, listingId, quantity, unitPriceCents, subtotalCents)
- Address(id, userId, kind(SHIPPING|BILLING), fullName, line1, line2?, city, state?, postalCode, country, phone?, createdAt, updatedAt)

## Health
- GET `/health`
  - Response: `{ success, message, timestamp }`

## Users API
- GET `/api/users`
- POST `/api/users`
  - body: `{ name, email, password }`
- GET `/api/users/:id`
- PUT `/api/users/:id`
  - body: `{ name, email }`
- DELETE `/api/users/:id`

## Configs API
- GET `/api/configs`
- POST `/api/configs`
  - body: `{ userId, name, description?, layoutData, previewUrl?, tagIds?: number[] }`
- GET `/api/configs/:id`
- PUT `/api/configs/:id`
  - body: `{ name?, description?, layoutData?, previewUrl?, tagIds?: number[] }`
- DELETE `/api/configs/:id`

## Tags API
- GET `/api/tags`
- POST `/api/tags`
  - body: `{ name }`

## Favorites API
- GET `/api/favorites?userId=1`
- POST `/api/favorites`
  - body: `{ userId, configId }`
- DELETE `/api/favorites`
  - body: `{ userId, configId }`

## Comments API
- GET `/api/comments?configId=1`
- POST `/api/comments`
  - body: `{ userId, configId, content, rating? }`
- PUT `/api/comments/:id`
  - body: `{ content?, rating? }`
- DELETE `/api/comments/:id`

## Analytics API
- GET `/api/analytics` (genel istatistikler)
- GET `/api/analytics?type=color-usage`
- GET `/api/analytics?type=event-logs`
- POST `/api/analytics/color`
  - body: `{ userId?, color('#RRGGBB') }`
- POST `/api/analytics/event`
  - body: `{ userId?, event, metadata? }` (event: config_created, ...)

## Listings API
- GET `/api/listings`
- GET `/api/listings/:id`
- POST `/api/listings`
- PUT `/api/listings/:id`
- DELETE `/api/listings/:id`

## Cart API
- GET `/api/cart?userId=1`
- POST `/api/cart/items` (body: `{ userId, listingId, quantity }`)
- PUT `/api/cart/items/:itemId` (body: `{ quantity }`)
- DELETE `/api/cart/items/:itemId`

## Orders API
- GET `/api/orders?userId=1`
- GET `/api/orders/:id`
- POST `/api/orders/checkout` (body: `{ userId, shippingAddressId?, billingAddressId? }`)

## Addresses API
- GET `/api/addresses?userId=1`
- POST `/api/addresses`
- PUT `/api/addresses/:id`
- DELETE `/api/addresses/:id`

## Notes

## Authentication
- POST /api/auth/register { name, email, password } -> { token, user }
- POST /api/auth/login { email, password } -> { token, user }
- Use Authorization: Bearer <token> for protected routes

### Implementation
## Seed
```bash
npm run db:seed
```
Demo verisi: kullanıcı, bir `KeyboardConfig`, iki `Tag`, bir aktif `ConfigListing`, bir `Cart`, iki `Address`.
- bcryptjs for password hashing (12 rounds)
- jsonwebtoken for issuing 7d JWTs (JWT_SECRET required)
- Middleware: authGuard attaches req.userId
