// app/Providers.tsx
'use client'

import MainNavbar from '@/components/main-navbar';
import { usePathname } from 'next/navigation';

export default function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const noNavbarRoutes = ['/login', '/register']

    // Cek apakah path termasuk dalam noNavbarRoutes
    const isExactMatch = noNavbarRoutes.includes(pathname)

    const isPreviewPage = pathname.includes('/preview')

    // Cek apakah path mengandung prefix tertentu (dynamic route)
    const isDashboard = pathname.startsWith('/dashboard/') && !isPreviewPage

    const showNavbar = !(isExactMatch || isDashboard)

    return (
        <>
            {showNavbar && <MainNavbar />}
            {children}
        </>
    )
}
