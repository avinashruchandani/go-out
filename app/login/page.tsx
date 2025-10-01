import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default async function LoginPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/profile')
  }

  const signInWithGoogle = async () => {
    'use server'

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account', // Forces account selection every time
        },
      },
    })

    if (data.url) {
      redirect(data.url)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back! Please sign in to continue
          </p>
        </div>
        <form action={signInWithGoogle} className="mt-6 sm:mt-8">
          <Button type="submit" className="w-full" size="lg">
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  )
}
