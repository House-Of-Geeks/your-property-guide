import type { Metadata } from "next";
import { signIn } from "@/auth";
import { Mail } from "lucide-react";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;
  const isAgentLogin = !callbackUrl || callbackUrl.startsWith("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Your Property Guide</p>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAgentLogin ? "Agent Dashboard" : "Save & track properties"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Enter your email to receive a magic sign-in link</p>
        </div>

        <form
          action={async (formData: FormData) => {
            "use server";
            await signIn("resend", {
              email: formData.get("email") as string,
              redirectTo: (formData.get("callbackUrl") as string) || "/dashboard/profile",
            });
          }}
          className="space-y-4"
        >
          <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">Sign-in failed. Make sure you use your registered agent email.</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Send magic link
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          {isAgentLogin
            ? "Agents: use your registered agency email to access the dashboard."
            : "A link will be sent to your inbox — no password needed."}
        </p>
      </div>
    </div>
  );
}
