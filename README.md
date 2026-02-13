# 🌲 Timber Marketplace

A premium marketplace connecting private landowners with hunters seeking quality hunting lease opportunities.

**[View Product Requirements Document](PRD.md)** for detailed feature specifications and roadmap.

---

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling

### Backend
- **Supabase** - PostgreSQL database, authentication, and real-time subscriptions
- **Supabase Auth** - User authentication with OAuth support

### Deployment
- **Vercel** - Frontend hosting and deployment

---

## Running Locally

### Prerequisites
- Node.js 18+ and npm (or yarn/pnpm)
- Supabase account (optional - simulation mode available)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd timber-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. (Optional) Add Supabase credentials to `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note**: If you skip step 4, the app will run in **simulation mode** using local storage and mock data.

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Development Features

#### Simulation Mode
The app includes a sophisticated simulation mode that works without a backend:
- Mock user authentication
- Local storage persistence for listings and user data
- Toggle simulation mode via the badge in the bottom-left corner
- Perfect for development, testing, and demos

#### Build for Production
```bash
npm run build
npm run preview
```

---

## Supabase Backend Setup

This guide ensures your marketplace connects to a **real backend** using Supabase and Vercel.

---

### 1. 🗄️ Supabase Backend Setup

#### A. Create Project
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Go to **Project Settings > API**.
3. Copy the **Project URL** and the **anon public** key.

#### B. Initialize Database (CRITICAL)
Go to the **SQL Editor** in your Supabase dashboard and run the initial migration:

1. Open the file [supabase/migrations/001_initial_schema.sql](supabase/migrations/001_initial_schema.sql)
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Execute the migration

This will create:
- `listings` table with all required fields (including `sporting_arms` and `accommodations`)
- Row Level Security (RLS) policies
- Performance indexes
- Automatic `updated_at` timestamp trigger

**Note**: All database migrations are version controlled in the `supabase/migrations/` directory. See [supabase/migrations/README.md](supabase/migrations/README.md) for migration management details.

---

### 2. 🚀 Vercel Production Configuration

To stop the app from defaulting to "Simulation Mode", you must provide the keys in Vercel's dashboard.

1.  Open your project in the **Vercel Dashboard**.
2.  Go to **Settings > Environment Variables**.
3.  Add the following two keys:
    *   `VITE_SUPABASE_URL`: (Paste your Supabase Project URL)
    *   `VITE_SUPABASE_ANON_KEY`: (Paste your Supabase Anon Key)
4.  **Redeploy**: Go to the "Deployments" tab and select "Redeploy" on your latest build for the changes to take effect.

---

### 🏁 Testing the Live Connection
Once deployed with keys:
- Sign up with a real email.
- Check the **Supabase Auth** dashboard; you should see your new user.
- Create a listing and check the **listings** table in Supabase; your data should appear there instantly.

---

## Project Structure

```
timber-marketplace/
├── components/           # React components
│   ├── Header.tsx       # Main navigation header
│   ├── Hero.tsx         # Homepage hero section
│   ├── FilterBar.tsx    # Search filters
│   ├── ListingCard.tsx  # Property card component
│   ├── ListingModal.tsx # Property detail modal
│   ├── MapView.tsx      # Interactive map view
│   ├── AuthModal.tsx    # Authentication modal
│   ├── AddLandModal.tsx # Create listing modal
│   ├── LandownerDashboard.tsx
│   ├── HunterDashboard.tsx
│   ├── MessagingCenter.tsx
│   ├── PaymentModal.tsx
│   ├── OnboardingScreen.tsx
│   └── Footer.tsx
├── services/            # Backend integration
│   └── supabase.ts     # Supabase client & API methods
├── supabase/            # Database migrations
│   └── migrations/     # Versioned SQL migration files
│       ├── 001_initial_schema.sql
│       └── README.md
├── App.tsx             # Main application component
├── types.ts            # TypeScript type definitions
├── constants.ts        # Mock data and constants
├── index.tsx           # Application entry point
├── index.css           # Global styles
├── PRD.md              # Product Requirements Document
└── README.md           # This file
```

---

## Key Features

- **Two-Sided Marketplace**: Separate experiences for landowners and hunters
- **Advanced Search**: Filter by location, game type, price, acreage, and amenities
- **Interactive Map**: Visualize properties geographically
- **Role-Based Dashboards**: Tailored interfaces for each user type
- **Messaging System**: Direct communication between hunters and landowners
- **Verification System**: Trust badges for verified properties
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Simulation Mode**: Full offline development capabilities

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (optional - simulation mode works without these)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

---

## Contributing

This is currently an MVP prototype. For feature requests and architectural decisions, please refer to the [PRD.md](PRD.md) document.

### Development Guidelines
1. Follow existing TypeScript patterns
2. Use Tailwind CSS for styling (no custom CSS unless necessary)
3. Maintain component modularity
4. Test in both simulation and live Supabase modes
5. Ensure responsive design across breakpoints

---

## License

Private - All rights reserved

---

## Support

For questions or issues, please contact the development team.
