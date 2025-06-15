'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardHeader
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../ui/select";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username is required."
    }).max(15, {
        message: "Username must have than 15 characters."
    }),
    password: z
        .string()
        .min(1, "Password is required!")
        .min(8, "Password must have than 8 characters!"),
    role: z.string()
})

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            role: "user"
        }
    })

    const handleRegister = async (value: z.infer<typeof formSchema>) => {
        try {
            const res = await axios.post('/api/auth/register', value);
            console.log("Register Response", res);
            if (res.status === 201) {
                toast.success("Registrasi Berhasil");
                router.push('/login');
            }
        } catch (err: any) {
            toast.error('Register gagal: ' + err.response?.data?.error || 'Unknown error');
        }
    };

    const toggleVisible = () => setIsVisible(prev => !prev);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="flex items-center justify-center p-5">
                    <Image className="w-32" src="/img/Frame.svg" alt="logo company" width={200} height={200} loading="lazy" />
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleRegister)}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <FormField control={form.control} name="username" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="username"
                                                    type="text"
                                                    placeholder="Input Username"
                                                    required
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="grid gap-2">
                                    <FormField control={form.control} name="password" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={isVisible ? "text" : "password"}
                                                        placeholder="Input Password"
                                                        required
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center"
                                                        onClick={toggleVisible}
                                                    >
                                                        {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="grid gap-2">
                                    <FormField control={form.control} name="role" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger id="role" className="bg-white w-full">
                                                        <SelectValue placeholder="Pilih Role" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    <SelectItem value="user">User</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                </div>

                                <Button type="submit" className="w-full">Register</Button>

                                <div className="text-center text-sm">
                                    Already have an account?
                                    <Link href="/login" className="underline ml-1 underline-offset-4">
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </form>

                    </Form>

                </CardContent>
            </Card>

            <div className="text-muted-foreground text-center text-xs">
                By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
            </div>
        </div>
    );
}
