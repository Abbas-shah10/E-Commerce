"use client";

import React, { FormEvent, useState } from "react";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Product designer focused on creating simple, useful experiences.",
    location: "San Francisco, CA",
  });
  const [saved, setSaved] = useState(false);

  const updateField = (field: keyof typeof profile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
          <h1 className="text-xl font-semibold text-slate-900">Edit profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Update your personal information.
          </p>
        </div>

        <div className="space-y-6 px-6 py-6 sm:px-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              First name
              <input
                value={profile.firstName}
                onChange={(event) =>
                  updateField("firstName", event.target.value)
                }
                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Last name
              <input
                value={profile.lastName}
                onChange={(event) =>
                  updateField("lastName", event.target.value)
                }
                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Email address
            <input
              type="email"
              value={profile.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Phone
              <input
                type="tel"
                value={profile.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Location
              <input
                value={profile.location}
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Bio
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(event) => updateField("bio", event.target.value)}
              className="block w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          {saved && (
            <p
              role="status"
              className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700"
            >
              Profile changes saved.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => setSaved(false)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save changes
          </button>
        </div>
      </form>
    </main>
  );
};

export default ProfilePage;
