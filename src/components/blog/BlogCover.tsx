import Image from "next/image";
import { resolveBlogCoverPath } from "@/lib/utils/blog-cover";
import { BlogCoverFallback } from "@/components/blog/BlogCoverFallback";

interface Props {
  slug: string;
  title: string;
  category: string;
  coverImage?: string | null;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

// Server-side cover renderer. Resolves the post's coverImage against the
// list of files actually present in /public/images/blog and falls back to
// a branded generated cover if missing. Server-only — for client
// components (BlogGrid), let the parent pre-resolve and use
// BlogCoverFallback directly.
export function BlogCover({ slug, title, category, coverImage, sizes, priority, className }: Props) {
  const realPath = resolveBlogCoverPath(coverImage);
  if (realPath) {
    return (
      <Image
        src={realPath}
        alt={title}
        fill
        className={`object-cover ${className ?? ""}`}
        sizes={sizes}
        priority={priority}
      />
    );
  }
  return <BlogCoverFallback slug={slug} title={title} category={category} className={className} />;
}
