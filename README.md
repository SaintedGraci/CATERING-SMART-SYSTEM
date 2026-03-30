# CaterSmart - Catering Management System

A modern, full-stack catering management system built with Next.js 14+, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 📦 Browse and customize catering packages
- 🍽️ Comprehensive menu management
- 🛒 Shopping cart with real-time pricing
- 💳 Secure checkout process
- 👤 User authentication and account management
- 📱 Mobile-first responsive design
- 🔍 Advanced filtering and search
- ⭐ Reviews and ratings system
- 📊 Admin dashboard for management

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** NextAuth.js
- **Payment:** Stripe
- **Email:** Nodemailer
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/catering-smart-system.git
cd catering-smart-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration values.

4. Run database migrations:
```bash
npm run db:migrate
```

5. Seed the database (optional):
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── layout/      # Layout components
│   ├── home/        # Home page components
│   ├── ui/          # Reusable UI components
│   └── shared/      # Shared components
├── lib/             # Utility functions
├── hooks/           # Custom React hooks
├── types/           # TypeScript types
├── services/        # Business logic
└── context/         # React Context providers
```

See [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) for detailed documentation.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Documentation

- [Sitemap](./SITEMAP.md) - Website structure
- [User Flow](./USER-FLOW.md) - User journey documentation
- [Database Schema](./DATABASE-SCHEMA.md) - Database structure
- [API Documentation](./API-DOCUMENTATION.md) - API endpoints
- [Project Structure](./PROJECT-STRUCTURE.md) - Folder organization

## Features Roadmap

- [x] Landing page
- [x] Package browsing
- [ ] Package customization
- [ ] Shopping cart
- [ ] Checkout process
- [ ] User authentication
- [ ] Order management
- [ ] Admin dashboard
- [ ] Payment integration
- [ ] Email notifications
- [ ] Reviews system

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, contact us at hello@catersmart.com
