import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = { title: "Check your email" };

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <Mail className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Check your email</h1>
        <p className="text-sm text-gray-500 mt-2">
          We've sent a magic sign-in link to your email address. Click the link in the email to access your dashboard.
        </p>
        <p className="text-xs text-gray-400 mt-4">
          The link expires in 24 hours. If you don't see it, check your spam folder.
        </p>
      </div>
    </div>
  );
}
