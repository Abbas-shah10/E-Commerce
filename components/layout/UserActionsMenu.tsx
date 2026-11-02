"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteUserAction } from "@/app/actions/admin/users-actions";

export default function UserActionsMenu({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close the menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUserAction(userId);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Your original button with an added onClick toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md px-2 py-1 text-lg font-bold text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
      >
        •••
      </button>

      {/* Options Card Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            <button
              onClick={() => {
                router.push(`/admin/users/${userId}/edit`);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit User
            </button>
            <button
              onClick={handleDelete}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Delete User
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
