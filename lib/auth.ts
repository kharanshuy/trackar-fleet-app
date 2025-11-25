import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcrypt"

export const authOptions: NextAuthOptions = {
    debug: process.env.NODE_ENV === 'development', // Only debug in dev
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
        signIn: "/login",
    },
    cookies: {
        sessionToken: {
            name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log('🔐 [AUTH] Authorize called with:', { email: credentials?.email })

                if (!credentials?.email || !credentials?.password) {
                    console.log('❌ [AUTH] Missing credentials')
                    return null
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    })

                    if (!user) {
                        console.log('❌ [AUTH] User not found:', credentials.email)
                        return null
                    }

                    console.log('✓ [AUTH] User found:', user.email, 'Role:', user.role)

                    const isPasswordValid = await compare(credentials.password, user.password)

                    if (!isPasswordValid) {
                        console.log('❌ [AUTH] Invalid password for:', user.email)
                        return null
                    }

                    console.log('✓ [AUTH] Password valid, returning user data')
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    }
                } catch (error) {
                    console.error('❌ [AUTH] Error in authorize:', error)
                    return null
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            console.log('📝 [AUTH] Session callback - Token:', { id: token.id, role: token.role })
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role,
                }
            }
        },
        async jwt({ token, user }) {
            if (user) {
                console.log('🎫 [AUTH] JWT callback - Creating token for user:', user.id)
                return {
                    ...token,
                    id: user.id,
                    role: (user as any).role,
                }
            }
            return token
        }
    }
}
