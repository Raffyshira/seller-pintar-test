'use client'

import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/use-user"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

interface PreviewButtonProps {
    title: string
    content: string
    thumbnail: string
    className?: string
}

export default function PreviewButton({ title, content, thumbnail, className }: PreviewButtonProps) {
    const router = useRouter();
    const { user } = useUser();
    return (
        <Button variant="link" className={cn("text-blue-600 hover:text-blue-800 p-0 h-auto font-normal", className)}
            onClick={() => {
                localStorage.setItem('preview-data', JSON.stringify({ title, content, thumbnail }))
                router.push(`/dashboard/${user?.id}/preview`)
            }}
        >
            Preview
        </Button>

    )
}
