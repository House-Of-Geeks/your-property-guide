import Link from "next/link";
import { Button } from "@/components/ui";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl gradient-brand text-white flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or no longer exists.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Link href="/">
            <Button variant="gradient">
              <Home className="w-4 h-4" /> Go Home
            </Button>
          </Link>
          <Link href="/buy">
            <Button variant="outline">
              <Search className="w-4 h-4" /> Search Properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
