# Go Out

A Next.js 15 application with TypeScript, Supabase, TailwindCSS, and shadcn/ui.

## Features

- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **Supabase** for authentication and database
- **Google OAuth** authentication
- **TailwindCSS** for styling
- **shadcn/ui** for beautiful UI components

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- A Supabase account and project

### Installation

1. Clone the repository and install dependencies:

```bash
npm install --legacy-peer-deps
```

2. Set up your environment variables:

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to find your project URL and anon key
3. Go to Authentication > Providers and enable Google OAuth:
   - Add your Google OAuth client ID and secret
   - Configure the redirect URL: `https://your-project.supabase.co/auth/v1/callback`
4. Add your environment variables to `.env.local`

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication Flow

- Users can sign in with Google OAuth
- The navbar displays "Login" when logged out and "Profile" when logged in
- Authentication state is managed with Supabase Auth

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)