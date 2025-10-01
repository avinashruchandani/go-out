import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signOut } from '@/app/actions/auth'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
            <AvatarImage 
              src={user.user_metadata.avatar_url} 
              alt={user.user_metadata.full_name || 'User'} 
              referrerPolicy="no-referrer"
            />
            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">
            {user.user_metadata.full_name || 'User Profile'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground break-words max-w-full px-2">
            {user.email}
          </p>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border p-4 sm:p-6">
            <h3 className="font-semibold mb-3 text-base sm:text-lg">Account Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <span className="text-muted-foreground font-medium">Email:</span>
                <span className="font-medium break-words">{user.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <span className="text-muted-foreground font-medium">Name:</span>
                <span className="font-medium">{user.user_metadata.full_name || 'N/A'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <span className="text-muted-foreground font-medium">User ID:</span>
                <span className="font-mono text-xs break-all">{user.id}</span>
              </div>
            </div>
          </div>
          <form action={signOut}>
            <Button variant="destructive" type="submit" className="w-full" size="lg">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
