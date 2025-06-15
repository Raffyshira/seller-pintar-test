"use client"

import {
  LogOut,
  Newspaper,
  Tag
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/dashboard-components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar";

import { useUser } from "@/hooks/use-user";
import Image from "next/image";
import Link from "next/link";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userId = useUser();
  const data = {
    navMain: [
      {
        title: "Article",
        url: `/dashboard/${userId.user?.id}`,
        icon: Newspaper,
      },
      {
        title: "Category",
        url: `/dashboard/${userId.user?.id}/category`,
        icon: Tag,
      },
      {
        title: "Logout",
        url: "#",
        icon: LogOut,
      },
    ],
  }

  return (
    <Sidebar className="bg-blue-600 text-white [&_[data-sidebar=sidebar]]:bg-blue-600 [&_[data-sidebar=menu-button]]:hover:bg-blue-700 [&_[data-sidebar=menu-button]]:hover:text-white [&_[data-sidebar=menu-button]]:data-[active=true]:bg-blue-700 [&_[data-sidebar=menu-button]]:data-[active=true]:text-white [&_[data-sidebar=group-label]]:text-blue-100" collapsible="icon" {...props}>
      <SidebarHeader className="pl-5 pr-5 pt-5 group-data-[collapsible=icon]:hidden bg-blue-600 ">
        <Link href="/">
          <Image className='w-32 ' src="/Logo.svg" alt='Logo' width={200} height={200} loading='lazy' />
        </Link>
      </SidebarHeader>
      <SidebarContent className="text-white bg-blue-600 shadow-none border-none">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar >
  )
}
