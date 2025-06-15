'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";

import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

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
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { user } = useUser();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  })

  const handleLogin = async (value: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.post('/api/auth/login', value)
      const user = res.data.user;

      if (res.status === 200) {
        toast.success("Login Berhasil")
      }

      // ✅ Redirect sesuai role
      if (user.role === 'admin') {
        router.push(`/dashboard/${user?.id}`)
      } else {
        router.push('/')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed')
    }
  }

  const toggleVisible = () => setIsVisible((prevState) => !prevState)
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="flex justify-center items-center p-5">
          <Image className="w-32" src="/img/Frame.svg" alt="logo company" width={200} height={200} loading="lazy" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
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
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>




            </form>
          </Form>

        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
