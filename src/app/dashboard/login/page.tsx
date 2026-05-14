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

  // Shared input class so all four screens stay consistent.
  const inputClass =
    "w-full pl-9 pr-3 py-3 border border-line-strong bg-surface-raised rounded-lg text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors";

  return (
    <div className="min-h-screen flex bg-surface">
      {/* ── Left panel ─────────────────────────────────────── */}
      <div className="w-full lg:w-[440px] flex flex-col justify-center px-10 py-12 bg-surface-raised shrink-0">
        <Link href="/" className="mb-10 inline-flex items-center gap-3">
          <span className="inline-flex w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
          <span className="font-display text-ink text-2xl tracking-tight leading-none">Your Property Guide</span>
        </Link>

        {/* ── Options screen ─── */}
        {mode === "options" && (
          <div>
            <p className="font-display italic text-primary text-sm mb-2 leading-none">
              Partners only
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-ink leading-[1.02] tracking-tight mb-3 font-medium">
              Agent &amp; partner{" "}
              <span className="italic font-light text-primary">login</span>.
            </h1>
            <p className="text-sm text-ink-muted mb-6 leading-relaxed">
              By logging in, you agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">Terms of use</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy policy</Link>.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setMode("magic")}
                className="w-full flex items-center gap-3 px-4 py-3 border border-line-strong rounded-lg text-sm font-medium text-ink hover:border-ink hover:bg-surface-warm transition-colors"
              >
                <Mail className="w-5 h-5 text-ink-muted" />
                Continue with email link
              </button>
              <button
                onClick={() => setMode("password")}
                className="w-full flex items-center gap-3 px-4 py-3 border border-line-strong rounded-lg text-sm font-medium text-ink hover:border-ink hover:bg-surface-warm transition-colors"
              >
                <Lock className="w-5 h-5 text-ink-muted" />
                Continue with password
              </button>
            </div>

            <p className="text-sm text-center mt-6 text-ink-muted">
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
            <button onClick={() => { setMode("options"); setError(""); setMagicSent(false); }} className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="font-display text-3xl text-ink leading-tight tracking-tight mb-2">Continue with email link</h1>
            <p className="text-sm text-ink-muted mb-6 leading-relaxed">We&apos;ll send a magic sign-in link to your inbox.</p>

            {magicSent ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-cta text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7" />
                </div>
                <p className="font-display text-xl text-ink">Check your inbox</p>
                <p className="text-sm text-ink-muted mt-2">Link sent to <strong className="text-ink">{email}</strong></p>
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Email address" autoComplete="email"
                    className={inputClass}
                  />
                </div>
                {error && <p className="text-sm text-danger">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-cta text-white text-sm font-semibold rounded-lg hover:bg-cta-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? "Sending…" : "Send magic link"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── Password screen ─── */}
        {mode === "password" && (
          <div>
            <button onClick={() => { setMode("options"); setError(""); }} className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="font-display text-3xl text-ink leading-tight tracking-tight mb-2">Sign in with password</h1>
            <p className="text-sm text-ink-muted mb-6 leading-relaxed">Enter your email and password to continue.</p>

            <form onSubmit={handlePassword} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email address" autoComplete="email"
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                <input
                  type={showPass ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Password" autoComplete="current-password"
                  className={`${inputClass} pr-10`}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-cta text-white text-sm font-semibold rounded-lg hover:bg-cta-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="text-sm text-center mt-4 text-ink-muted">
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
            <button onClick={() => { setMode("options"); setError(""); }} className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="font-display text-3xl text-ink leading-tight tracking-tight mb-2">Create an account</h1>
            <p className="text-sm text-ink-muted mb-6 leading-relaxed">Save properties and track your search.</p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Full name (optional)"
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email address" autoComplete="email"
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                <input
                  type={showPass ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Create a password" autoComplete="new-password" minLength={8}
                  className={`${inputClass} pr-10`}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-cta text-white text-sm font-semibold rounded-lg hover:bg-cta-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="text-sm text-center mt-4 text-ink-muted">
              Already have an account?{" "}
              <button onClick={() => { setMode("password"); setError(""); }} className="text-primary font-semibold hover:underline">
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>

      {/* ── Right panel, lifestyle photo ──────────────────── */}
      <div className="hidden lg:block flex-1 relative">
        <Image
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80"
          alt="Modern Australian home"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <p className="font-display text-white text-2xl tracking-tight drop-shadow">Find your next home</p>
          <p className="text-white/80 text-sm mt-1">Australia&rsquo;s plain-English property guide</p>
        </div>
      </div>
    </div>
  );
}
