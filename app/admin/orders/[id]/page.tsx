import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  await connectDB();
  const order = await Order.findById(id).lean();
  if (!order) return notFound();

  return <div></div>;
};

export default page;
