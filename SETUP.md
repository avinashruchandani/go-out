# Setup Instructions

## Prerequisites

- Node.js 18.17 or later
- A Supabase account ([sign up here](https://supabase.com))
- A Google Cloud project with OAuth credentials

## Step 1: Install Dependencies

The dependencies have already been installed. If you need to reinstall them:

```bash
npm install --legacy-peer-deps --cache /tmp/npm-cache-go-out
```

## Step 2: Set Up Supabase

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in your project details

2. **Get Your API Credentials:**
   - Go to your project settings
   - Navigate to Settings > API
   - Copy your project URL and anon public key

3. **Configure Google OAuth:**
   - Go to Authentication > Providers in your Supabase dashboard
   - Find Google and click to enable it
   - You'll need to provide:
     - **Google Client ID**
     - **Google Client Secret**

## Step 3: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application"
6. Add authorized redirect URIs:
   - For development: `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
   - Replace `YOUR_SUPABASE_PROJECT_REF` with your actual project reference
7. Copy the Client ID and Client Secret

## Step 4: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**For production**, set `NEXT_PUBLIC_SITE_URL` to your actual domain.

## Step 5: Update Supabase with Google Credentials

1. Go back to your Supabase project
2. Navigate to Authentication > Providers > Google
3. Paste your Google Client ID and Client Secret
4. Save the changes

## Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing the Authentication Flow

1. Click "Login" in the navbar
2. Click "Sign in with Google"
3. Authorize the application
4. You'll be redirected back to the app and logged in
5. The navbar should now show your profile avatar
6. Click the avatar to access the profile page or sign out

## Project Structure

```
go-out/
├── app/
│   ├── auth/callback/     # OAuth callback handler
│   ├── login/             # Login page
│   ├── profile/           # User profile page
│   ├── layout.tsx         # Root layout with navbar
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   └── navbar.tsx         # Navigation bar
├── lib/
│   ├── supabase/          # Supabase client utilities
│   └── utils.ts           # Utility functions
└── middleware.ts          # Auth middleware
```

## Common Issues

### "Invalid credentials" error
- Make sure your `.env.local` file has the correct values
- Verify that your Supabase URL ends with `.supabase.co`
- Check that you're using the anon (public) key, not the service role key

### Google OAuth not working
- Verify the redirect URI in Google Cloud Console matches your Supabase callback URL
- Make sure Google OAuth is enabled in Supabase
- Check that your Google Client ID and Secret are correctly entered in Supabase

### Development server won't start
- Clear the `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install --legacy-peer-deps --cache /tmp/npm-cache-go-out`

## Next Steps

- Customize the UI to match your brand
- Add protected routes by checking user authentication
- Add more OAuth providers (GitHub, Discord, etc.)
- Set up a database schema in Supabase
- Deploy to Vercel or your preferred hosting platform

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
