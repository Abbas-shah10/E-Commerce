import EditUserForm from "@/components/layout/EditUserForm";
import User from "@/models/User";
import { notFound } from "next/navigation";
import React from "react";

const UserDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const user = await User.findById({ _id: id }).lean();

  if (!user) notFound();

  const serializedUser = await JSON.parse(JSON.stringify(user));

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg bg-white">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
      <EditUserForm user={serializedUser} />
    </div>
  );
};

export default UserDetails;
