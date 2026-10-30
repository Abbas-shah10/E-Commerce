"use client";
import React, { useState } from "react";
import Link from "next/link";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10">
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Enter your details to get started
          </p>
        </div>

        <form className="space-y-5">
          <label className="block space-y-2 text-sm font-medium text-zinc-800">
            <span>Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Username"
              className="w-full rounded-lg border border-zinc-300 px-3.5 py-3 text-sm font-normal text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-zinc-800">
            <span>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-300 px-3.5 py-3 text-sm font-normal text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-zinc-800">
            <span>Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-300 px-3.5 py-3 text-sm font-normal text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-zinc-900 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default SignUp;
