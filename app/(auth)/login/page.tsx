"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('🔵 [CLIENT] Login attempt starting...', values.email)
        setLoading(true)
        setError(null)

        try {
            console.log('🔵 [CLIENT] Calling signIn...')
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            })

            console.log('🔵 [CLIENT] signIn result:', result)

            if (result?.error) {
                console.log('❌ [CLIENT] Login error:', result.error)
                setError("Invalid email or password")
                setLoading(false)
                return
            }

            if (result?.ok) {
                console.log('✅ [CLIENT] Login successful, redirecting...')
                router.push("/dashboard")
                router.refresh()
            } else {
                console.log('⚠️ [CLIENT] Unexpected result:', result)
                setError("Login failed unexpectedly")
                setLoading(false)
            }
        } catch (error) {
            console.error('❌ [CLIENT] Exception during login:', error)
            setError("Something went wrong")
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Trackar Login</CardTitle>
                <CardDescription className="text-center">
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="admin@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
