// components/EditUserForm.tsx
"use client";

import { updateUserAction } from "@/app/actions/admin/users-actions";
import { useRouter } from "next/navigation";

export default function EditUserForm({ user }: { user: any }) {
  const router = useRouter();
  console.log(user);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      userId: user._id,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      role: user.role, // keeping old role or handling separately
    };

    const result = await updateUserAction(payload);

    if (result?.error) {
      alert(result.error);
    } else {
      alert("User updated successfully!");
      router.push(`/users/${user._id}`); // Redirect back to profile view
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          type="text"
          defaultValue={user.username}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          defaultValue={user.email}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </form>
  );
}
