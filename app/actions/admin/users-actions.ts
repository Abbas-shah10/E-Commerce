"use server";

import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

interface FetchUsersParams {
  search?: string;
  page?: number;
  limit?: number;
}

export async function getUsers({
  search = "",
  page = 1,
  limit = 10,
}: FetchUsersParams) {
  const session = await auth();
  await connectDB();

  if (!session || !session?.user) {
    throw new Error("Unauthorized: You must be logged in.");
  }

  const isAdmin = session?.user.role === "admin";

  if (!isAdmin) {
    throw new Error(
      "Forbidden: You do not have permission to get all Users Details",
    );
  }

  const skip = (page - 1) * limit;

  const query = search ? { name: { $regex: search, $options: "i" } } : {};

  const [users, totalUsers] = await Promise.all([
    User.find(query).skip(skip).limit(limit).lean(),
    User.countDocuments(query),
  ]);

  return {
    users: JSON.parse(JSON.stringify(users)),
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: page,
  };
}

const EditUserSchema = z.object({
  userId: z.string().min(1),
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  role: z.enum(["user", "admin"]), // Prevents privilege escalation
});

export async function updateUserAction(formData: {
  userId: string;
  username: string;
  email: string;
  role: string;
}) {
  const session = await auth();

  if (!session || !session?.user) {
    throw new Error("Unauthorized: You must be logged in.");
  }

  const isSelf = session?.user.id === formData.userId;
  const isAdmin = session?.user.role === "admin";

  if (!isAdmin && !isSelf) {
    throw new Error(
      "Forbidden: You do not have permission to modify this user.",
    );
  }

  const validateFields = EditUserSchema.parse(formData);

  const { username, email, role, userId } = validateFields;

  try {
    await connectDB();

    const finalRole = isAdmin ? role : session?.user.role;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username,
          email,
          role: finalRole,
        },
      },
      { new: true, runValidators: true }, // Mongoose built-in schema checks
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    revalidatePath("/users");
    revalidatePath(`/users/${userId}`);

    return { success: true };
  } catch (error) {
    console.error("Database Update Error:", error);
    return { error: "Internal server error. Failed to update user." };
  }
}

export async function deleteUserAction(userId: string) {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Unauthorized: You must be logged in.");
  }

  const isAdmin = session?.user.role === "admin";

  if (!isAdmin) {
    throw new Error("Forbidden. Only Admin can perform this operation");
  }

  try {
    await connectDB();

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return { success: false, error: "User not found in our records." };
    }
    revalidatePath("/admin/users");

    return { success: true, message: "User deleted Successfully" };
  } catch (error) {
    console.error("Database Delete Error:", error);
    return { error: "Internal server error. Failed to delete user." };
  }
}
