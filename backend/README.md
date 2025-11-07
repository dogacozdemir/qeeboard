# QeeBoard - Keyboard Configurator & Marketplace

A modern web application for creating, sharing, and selling custom keyboard configurations.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Deployment**: Vercel + Neon.tech

## 📋 Features

- **Keyboard Configurator**: Create custom keyboard layouts
- **Community**: Share, discover, and favorite configurations
- **Marketplace**: Buy and sell preset keyboard configurations
- **Analytics**: Track color usage and user behavior
- **Comments & Ratings**: Community feedback system

## 🗄️ Database Models

- **User**: User accounts and profiles
- **KeyboardConfig**: Keyboard configurations
- **ConfigVersion**: Version history for configurations
- **Tag**: Categorization system
- **ConfigTag**: Many-to-many relationship between configs and tags
- **ConfigFavorite**: User favorites
- **ConfigComment**: Comments and ratings
- **AnalyticsColorUsage**: Color usage statistics
- **AnalyticsEventLog**: User behavior tracking

## 🛠️ Setup Instructions

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/qeeboard_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

### 2. Database Setup

For local development, you can use:
- **Local PostgreSQL**: Install PostgreSQL locally
- **Docker**: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`
- **Neon.tech**: Free PostgreSQL hosting (recommended for production)

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

## 📡 API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Keyboard Configs
- `GET /api/keyboard-configs` - Get configs (with filters)
- `POST /api/keyboard-configs` - Create config
- `GET /api/keyboard-configs/[id]` - Get config by ID
- `PUT /api/keyboard-configs/[id]` - Update config
- `DELETE /api/keyboard-configs/[id]` - Delete config

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create tag

### Favorites
- `GET /api/favorites?userId=xxx` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/[id]` - Remove from favorites

### Comments
- `GET /api/comments?configId=xxx` - Get config comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/[id]` - Update comment
- `DELETE /api/comments/[id]` - Delete comment

### Analytics
- `GET /api/analytics` - Get general stats
- `GET /api/analytics?type=color-usage` - Get color usage stats
- `GET /api/analytics?type=event-logs` - Get event logs
- `POST /api/analytics` - Log analytics event

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database (Neon.tech)

1. Create a new project on Neon.tech
2. Copy the connection string to `DATABASE_URL`
3. Run migrations: `npx prisma migrate deploy`

## 🔧 Development Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Database
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Create and apply migration
npx prisma migrate reset   # Reset database
npx prisma generate        # Generate Prisma client
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── users/
│   │   ├── keyboard-configs/
│   │   ├── tags/
│   │   ├── favorites/
│   │   ├── comments/
│   │   └── analytics/
│   └── (pages)/            # Next.js pages
├── lib/
│   └── db.ts              # Database connection
├── types/
│   └── api.ts             # TypeScript types
└── components/            # React components (to be added)

prisma/
└── schema.prisma          # Database schema
```

## 🎯 Next Steps

1. **Authentication**: Implement user authentication (NextAuth.js)
2. **Frontend**: Create React components for the UI
3. **Configurator**: Build the keyboard configurator interface
4. **Marketplace**: Implement payment processing
5. **Testing**: Add unit and integration tests

## 📝 Notes

- All API responses follow the format: `{ success: boolean, message?: string, data?: any }`
- Database relationships are properly configured with cascade deletes
- Analytics tracking is built-in for user behavior analysis
- The schema is designed to be extensible for future e-commerce features