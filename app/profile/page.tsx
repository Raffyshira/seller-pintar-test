'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";

export default function ProfilePage() {
    const { user } = useUser();
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">User Profile</h1>
                </div>

                {/* Avatar */}
                <div className="flex justify-center">
                    <Avatar className="w-20 h-20 bg-blue-200">
                        <AvatarFallback className="text-2xl font-medium text-blue-800 bg-blue-200">{user?.username[0]}</AvatarFallback>
                    </Avatar>
                </div>

                {/* Profile Information */}
                <div className="space-y-1">
                    <div className="flex items-center bg-gray-100 px-4 py-3 rounded-sm">
                        <span className="text-gray-700 font-medium w-24">Username</span>
                        <span className="text-gray-700 mx-3">:</span>
                        <span className="text-gray-900">{user?.username}</span>
                    </div>

                    <div className="flex items-center bg-gray-100 px-4 py-3 rounded-sm">
                        <span className="text-gray-700 font-medium w-24">Password</span>
                        <span className="text-gray-700 mx-3">:</span>
                        <span className="text-gray-900">Admin123</span>
                    </div>

                    <div className="flex items-center bg-gray-100 px-4 py-3 rounded-sm">
                        <span className="text-gray-700 font-medium w-24">Role</span>
                        <span className="text-gray-700 mx-3">:</span>
                        <span className="text-gray-900">{user?.role}</span>
                    </div>
                </div>

                {/* Back Button */}
                <div className="pt-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md" asChild>
                        <Link href='/'>
                            Back to home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
