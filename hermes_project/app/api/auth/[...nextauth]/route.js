import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { query } from "@/utils/database";




const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ profile }) {
            try {
                const existingUser = await query(
                    "SELECT * FROM users WHERE google_id = ?",
                    [profile.sub]
                );

                if (existingUser.length === 0) {
                    // If user does not exist, insert into MySQL
                    await query(
                        "INSERT INTO users (google_id, email, created_at) VALUES (?, ?, NOW())",
                        [profile.sub, profile.email]
                    );
                }
                return true;
            } catch (error) {
                console.error("Error signing in:", error);
                return false;
            }
        },
        async session({ session }) {
            const dbUser = await query("SELECT * FROM users WHERE email = ?", [session.user.email]);
            if (dbUser.length > 0) {
                session.user.id = dbUser[0].id;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };