# PyarKaSafar

A modern South Asian dating app built with React, Vite, and Supabase.

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS + Shadcn/UI
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **State Management:** React Query (@tanstack/react-query)
- **Routing:** React Router DOM v7

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/pyar-ka-safar.git
   cd pyar-ka-safar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
   ```

4. Set up Supabase database:
   - Run the migration in `supabase/migrations/20241225000000_initial_schema.sql`
   - See [supabase/README.md](supabase/README.md) for detailed instructions

5. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── api/
│   └── supabaseClient.js    # Supabase client configuration
├── components/
│   ├── auth/                # Auth components (ProtectedRoute, PublicOnlyRoute)
│   ├── onboarding/          # Onboarding step components
│   └── ui/                  # Shadcn/UI components
├── contexts/
│   └── AuthContext.jsx      # Authentication state management
├── pages/
│   ├── Home.jsx             # Landing page
│   ├── Login.jsx            # Login page
│   ├── Onboarding.jsx       # User onboarding flow
│   ├── Dashboard.jsx        # Main dashboard
│   ├── Profile.jsx          # User profile view
│   ├── EditProfile.jsx      # Profile editing
│   ├── Browse.jsx           # Browse profiles (Coming Soon)
│   ├── Matches.jsx          # View matches (Coming Soon)
│   └── Messages.jsx         # Chat with matches (Coming Soon)
└── App.jsx                  # App entry point
```

## Features

### Implemented (Milestone 1)
- Email/password authentication
- User registration with 8-step onboarding
- Profile creation and editing
- Photo upload to Supabase Storage
- Geolocation capture
- Protected routes

### Coming Soon (Milestone 2)
- Browse and discover profiles
- Like/Pass matching system
- Real-time messaging
- Distance-based matching

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
3. Deploy

## Documentation

- [Milestone 1 Documentation](docs/MILESTONE_1_COMPLETED.md) - Detailed migration notes
- [Supabase Setup](supabase/README.md) - Database configuration

## License

MIT
