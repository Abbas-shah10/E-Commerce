"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signInSchema } from "@/validations/User";
import type { z } from "zod";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignIn = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null | boolean>(
    null,
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<
    z.input<typeof signInSchema>,
    unknown,
    z.output<typeof signInSchema>
  >({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: z.output<typeof signInSchema>) => {
    setServerError(null);
    setServerSuccess(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!result?.ok) {
      setServerError(result?.error || "Error SignIn failed");
    } else {
      const session = await getSession();
      const destination = session?.user?.role === "admin" ? "/admin" : "/dashboard";

      reset();
      setServerSuccess("Sign-In Successfully");
      router.replace(destination);
      router.refresh();
    }
  };
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-lg shadow-indigo-200">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 3 4.5 7v10L12 21l7.5-4V7L12 3Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="m8.2 9.2 3.8 2.1 3.8-2.1M12 11.3V16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue to your account
          </p>
        </div>
        {serverError && (
          <p style={{ color: "red", fontWeight: "bold" }}>{serverError}</p>
        )}
        {serverSuccess && (
          <p style={{ color: "green", fontWeight: "bold" }}>{serverSuccess}</p>
        )}

        <form
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <input
                {...register("email")}
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-indigo-100"
              />
              {errors.email && (
                <p style={{ color: "red" }}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-sm font-medium text-black hover:text-gray-700 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                {...register("password")}
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-indigo-100"
              />
              {errors.password && (
                <p style={{ color: "red" }}>{errors.password.message}</p>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Remember me
            </label>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
            >
              {isSubmitting ? "Signing In..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-zinc-900 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignIn;
