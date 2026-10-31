"use server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { signUpSchema } from "@/validations/User";
import { signOut } from "next-auth/react";

export async function signUp(_prev: unknown, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());

  const parsed = signUpSchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { username, email, password, role } = parsed.data;

  try {
    await connectDB();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return { success: true, message: "User signup successfully" };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/sign-in" });
}
