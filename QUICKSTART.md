# Quick Start Guide

## ✅ What's Been Created

Your Next.js 15 project is set up with:

- ✅ **Next.js 15** with App Router and Turbopack
- ✅ **TypeScript** configuration
- ✅ **TailwindCSS** with custom theme
- ✅ **shadcn/ui** components (Button, Dropdown Menu, Avatar)
- ✅ **Supabase** client utilities (browser, server, middleware)
- ✅ **Google OAuth** authentication flow
- ✅ **Navbar** that shows "Login" when logged out, profile avatar when logged in
- ✅ **Pages**: Home, Login, Profile
- ✅ **Auth callback** route for OAuth

## 🚀 To Get Started (3 Simple Steps)

### 1. Create Your Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Settings > API**
3. Copy your **Project URL** and **anon public** key

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Replace** `your-project-ref` and `your-anon-key-here` with your actual values from step 1.

### 3. Enable Google OAuth in Supabase

1. Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com):
   - Create a new project or select existing
   - Go to **APIs & Services > Credentials**
   - Create **OAuth client ID** (Web application)
   - Add redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret**

2. In Supabase Dashboard:
   - Go to **Authentication > Providers**
   - Find **Google** and enable it
   - Paste your Google **Client ID** and **Client Secret**
   - Save

## ▶️ Run the App

The dev server is already running! Just:

1. Make sure you've created `.env.local` with your Supabase credentials
2. Restart the dev server if needed:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## 🎯 Test the Authentication

1. Click **"Login"** in the navbar
2. Click **"Sign in with Google"**
3. Authorize the app with your Google account
4. You'll be redirected back and logged in
5. Your profile avatar appears in the navbar
6. Click it to see your **Profile** or **Sign out**

## 📁 Project Structure

```
go-out/
├── app/
│   ├── auth/callback/route.ts    # OAuth callback handler
│   ├── login/page.tsx             # Login page
│   ├── profile/page.tsx           # Profile page (protected)
│   ├── layout.tsx                 # Root layout with navbar
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles + CSS variables
├── components/
│   ├── navbar.tsx                 # Navbar with auth state
│   └── ui/                        # shadcn/ui components
│       ├── button.tsx
│       ├── dropdown-menu.tsx
│       └── avatar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client
│   │   ├── server.ts              # Server Supabase client
│   │   └── middleware.ts          # Auth middleware utilities
│   └── utils.ts                   # Utility functions (cn)
├── middleware.ts                  # Global middleware (auth)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## 🎨 Customization Ideas

- Update the home page content in `app/page.tsx`
- Modify the navbar in `components/navbar.tsx`
- Add more shadcn/ui components as needed
- Create protected routes by checking auth in page components
- Add more OAuth providers (GitHub, Discord, etc.)

## ❓ Troubleshooting

**"Your project's URL and Key are required"**
- You need to create `.env.local` with your Supabase credentials

**Google OAuth not working**
- Check that redirect URI in Google Cloud matches Supabase callback URL
- Verify Google OAuth is enabled in Supabase dashboard
- Make sure Client ID and Secret are correct

**Server won't start**
- Run: `rm -rf .next && npm run dev`
- Reinstall dependencies: `npm install --legacy-peer-deps --cache /tmp/npm-cache-go-out`

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [shadcn/ui Docs](https://ui.shadcn.com)

---

For detailed setup instructions, see [SETUP.md](./SETUP.md)
