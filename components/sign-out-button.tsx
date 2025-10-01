'use client';

import { useTransition } from 'react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { signOut } from '@/app/actions/auth';

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <DropdownMenuItem
      onClick={handleSignOut}
      disabled={isPending}
      className="cursor-pointer"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>{isPending ? 'Signing out...' : 'Sign out'}</span>
    </DropdownMenuItem>
  );
}
