"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";

type Mode = "options" | "magic" | "password" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("options");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const callbackUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("callbackUrl") || "/dashboard"
      : "/dashboard";

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("nodemailer", { email, redirect: false, callbackUrl });
    setLoading(false);
    if (res?.error) {
      setError("Could not send link. Please try again.");
    } else {
      setMagicSent(true);
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email, password, mode: "login", redirect: false,
    });
    setLoading(false);
    if (res?.error || !res?.ok) {
      setError("Incorrect email or password.");
    } else {
      router.push(callbackUrl);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email, password, name, mode: "register", redirect: false,
    });
    setLoading(false);
    if (res?.error || !res?.ok) {
      setError("An account with this email already exists.");
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ─────────────────────────────────────── */}
      <div className="w-full lg:w-[440px] flex flex-col justify-center px-10 py-12 bg-white shrink-0">
        <Link href="/" className="mb-10 inline-block">
          <Image src="/images/YPG Logo.png" alt="Your Property Guide" width={200} height={70} className="h-16 w-auto" />
        </Link>

        {/* ── Options screen ─── */}
        {mode === "options" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Log in to Your Property Guide</h1>
            <p className="text-sm text-gray-500 mb-6">
              By logging in, I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">Terms of use</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy policy</Link>
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setMode("magic")}
                className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-500" />
                Continue with email link
              </button>
              <button
                onClick={() => setMode("password")}
                className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Lock className="w-5 h-5 text-gray-500" />
                Continue with password
              </button>
            </div>

            <p className="text-sm text-center mt-6 text-gray-600">
              Don&apos;t have an account?{" "}
              <button onClick={() => setMode("register")} className="text-primary font-semibold hover:underline">
                Sign up
              </button>
            </p>
          </div>
        )}

        {/* ── Magic link screen ─── */}
        {mode === "magic" && (
          <div>
            <button onClick={() => { setMode("options"); setError(""); setMagicSent(false); }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Continue with email link</h1>
            <p className="text-sm text-gray-500 mb-6">We&apos;ll send a magic sign-in link to your inbox.</p>

            {magicSent ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <p className="font-semibold text-gray-900">Check your inbox</p>
                <p className="text-sm text-gray-500 mt-1">Link sent to <strong>{email}</strong></p>
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Email address" autoComplete="email"
                    className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {loading ? "Sending…" : "Send magic link"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── Password screen ─── */}
        {mode === "password" && (
          <div>
            <button onClick={() => { setMode("options"); setError(""); }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in with password</h1>
            <p className="text-sm text-gray-500 mb-6">Enter your email and password to continue.</p>

            <form onSubmit={handlePassword} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email address" autoComplete="email"
                  className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Password" autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="text-sm text-center mt-4 text-gray-600">
              Don&apos;t have an account?{" "}
              <button onClick={() => { setMode("register"); setError(""); }} className="text-primary font-semibold hover:underline">
                Sign up
              </button>
            </p>
          </div>
        )}

        {/* ── Register screen ─── */}
        {mode === "register" && (
          <div>
            <button onClick={() => { setMode("options"); setError(""); }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create an account</h1>
            <p className="text-sm text-gray-500 mb-6">Save properties and track your search.</p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Full name (optional)"
                  className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email address" autoComplete="email"
                  className="w-full pl-9 pr-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Create a password" autoComplete="new-password" minLength={8}
                  className="w-full pl-9 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="text-sm text-center mt-4 text-gray-600">
              Already have an account?{" "}
              <button onClick={() => { setMode("password"); setError(""); }} className="text-primary font-semibold hover:underline">
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>

      {/* ── Right panel — lifestyle photo ──────────────────── */}
      <div className="hidden lg:block flex-1 relative">
        <Image
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80"
          alt="Modern Australian home"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <p className="text-white text-lg font-semibold drop-shadow">Find your next home</p>
          <p className="text-white/80 text-sm">Australia&apos;s local property guide</p>
        </div>
      </div>
    </div>
  );
}
