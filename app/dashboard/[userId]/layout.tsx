'use client'
import { AppSidebar } from "@/components/dashboard-components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";
import NavbarDashboard from "./_components/main-navbar";


export default function Layoutdashboard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const isPreviewPage = pathname.includes('/preview')

    if (isPreviewPage) {
        return <>{children}</>
    }

    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex shadow h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                        </div>
                        <NavbarDashboard pagename="Article" />
                    </header>
                    {children}
                </SidebarInset>
            </SidebarProvider>

        </>
    )
}