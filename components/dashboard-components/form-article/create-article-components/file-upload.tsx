"use client"

import { useFileUpload } from "@/hooks/use-file-upload"
import { useUser } from "@/hooks/use-user"
import { supabase } from "@/lib/supabaseClient"
import { AlertCircleIcon, ImageUpIcon } from "lucide-react"
import { useState } from "react"

type Props = {
    onChange: (url: string) => void
    error?: string
    value?: string
}

export default function UploadThumnails({ onChange, error, value }: Props) {
    const maxSizeMB = 5
    const maxSize = maxSizeMB * 1024 * 1024 // 5MB
    const [uploading, setUploading] = useState(false)
    const { user } = useUser()

    const [
        { files, isDragging, errors },
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            getInputProps,
        },
    ] = useFileUpload({
        accept: "image/*",
        maxSize,
    })

    const previewUrl = files[0]?.preview || value || null

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user?.id) return

        setUploading(true)
        const fileExt = file.name.split(".").pop()
        const filePath = `${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from("thumbnails")
            .upload(filePath, file)

        if (uploadError) {
            alert("Upload gagal: " + uploadError.message)
            setUploading(false)
            return
        }

        const { data } = supabase.storage.from("thumbnails").getPublicUrl(filePath)
        onChange(data.publicUrl)
        setUploading(false)
    }

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="relative">
                {/* Drop Area */}
                <div
                    role="button"
                    onClick={openFileDialog}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
                >
                    <input
                        {...getInputProps()}
                        className="sr-only"
                        aria-label="Upload file"
                        type="file"
                        onChange={handleUpload}
                    />
                    {previewUrl ? (
                        <div className="absolute inset-0 bg-accent">
                            <img
                                src={previewUrl}
                                alt="Uploaded thumbnail"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                            <div
                                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                                aria-hidden="true"
                            >
                                <ImageUpIcon className="size-4 opacity-60" />
                            </div>
                            <p className="mb-1.5 text-sm font-medium">
                                Drop your image here or click to browse
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Max size: {maxSizeMB}MB
                            </p>
                        </div>
                    )}
                </div>

                {/* Change & Delete buttons */}
                {previewUrl && (
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                        <button
                            type="button"
                            onClick={openFileDialog}
                            className="bg-white/80 text-xs px-2 py-1 rounded hover:bg-white shadow"
                        >
                            Change
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (files.length > 0) {
                                    removeFile(files[0].id)
                                }
                                onChange("")
                            }}
                            className="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700 shadow"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div
                    className="text-destructive flex items-center gap-1 text-xs"
                    role="alert"
                >
                    <AlertCircleIcon className="size-3 shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}
