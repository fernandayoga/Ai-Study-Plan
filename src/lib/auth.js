import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "./mongodb";
import User from "@/models/User";
import { authConfig } from "./auth.config";

class CustomAuthError extends CredentialsSignin {
  constructor(message) {
    super();
    this.code = message; // Auth.js menggunakan properti code untuk passing error message
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        try {
          await connectDB();

          // Cari user berdasarkan email
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          });

          if (!user) {
            throw new CustomAuthError("Email tidak terdaftar, silakan daftar terlebih dahulu.");
          }

          // Cek password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new CustomAuthError("Email atau Password salah!");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };

        } catch (error) {
          if (error instanceof CustomAuthError) {
            throw error;
          }
          throw new CustomAuthError("Terjadi kesalahan sistem.");
        }
      },
    }),
  ],



  session: {
    strategy: "jwt",
  },
});