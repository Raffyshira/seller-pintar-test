'use client'


import {
  Layers2Icon,
  LayoutDashboard,
  LogOut
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/hooks/use-user';
import Link from 'next/link';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UserMenu({ isVisible }: { isVisible: boolean }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  function handleLogout() {
    axios.post('/api/auth/logout')
      .then(() => {
        setShowDeleteDialog(false);
        router.push("/login")
      })
      .catch((err) => {
        console.error('Logout gagal:', err);
      });
  }

  const { user } = useUser();
  return (
    <>
      {user ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto fle items-center p-5 hover:bg-transparent">
                <Avatar className="w-7 h-7">
                  <AvatarImage src="./avatar.jpg" alt="Profile image" />
                  <AvatarFallback className='bg-blue-200 uppercase'>{user?.username[0]}</AvatarFallback>
                </Avatar>
                <span className={isVisible ? "text-black" : "text-white"}>{user?.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-64" align="end">
              <DropdownMenuLabel className="flex min-w-0 flex-col">
                <span className="text-foreground truncate text-sm font-medium">
                  My Account
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href='/profile' className='flex items-center'>
                    <Layers2Icon size={16} className="opacity-60 mr-2" aria-hidden="true" />
                    <span>Profile</span>
                  </Link>

                </DropdownMenuItem>
                {user?.role === "admin" ? (
                  <>
                    <DropdownMenuItem>
                      <Link className='flex items-center' href={`/dashboard/${user?.id}`}>
                        <LayoutDashboard size={16} className="opacity-60 mr-2" aria-hidden="true" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                ) : (
                  null
                )}
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault()
                    setShowDeleteDialog(true)
                  }}
                >
                  <LogOut className='opacity-60 text-red-600' size={16} />
                  <span className='text-red-600'>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>


            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent className='w-96'>
              <AlertDialogHeader>
                <AlertDialogTitle>Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure want to logout?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-blue-600 hover:bg-blue-800">
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <a href='/login'>Login</a>
      )}
    </>
  )
}
