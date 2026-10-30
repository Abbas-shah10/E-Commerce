"use server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { signUpSchema } from "@/validations/User";

export async function signUp(_prev: unknown, formData: FormData) {
  const parsed = signUpSchema.safeParse(formData);

  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  const { username, email, password, role } = parsed.data;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return { success: true, message: "User signup successfully", user };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}
