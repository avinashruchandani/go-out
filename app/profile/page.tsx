import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const signOut = async () => {
    'use server'

    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name || 'User'} />
            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            {user.user_metadata.full_name || 'User Profile'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">Account Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Email:</span>{' '}
                <span className="font-medium">{user.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Name:</span>{' '}
                <span className="font-medium">{user.user_metadata.full_name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">User ID:</span>{' '}
                <span className="font-mono text-xs">{user.id}</span>
              </div>
            </div>
          </div>
          <form action={signOut}>
            <Button variant="destructive" type="submit" className="w-full">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
