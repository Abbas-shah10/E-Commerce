"use server";

import User from "@/models/User";
import { connectDB } from "@/lib/db";

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
  await connectDB();

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
