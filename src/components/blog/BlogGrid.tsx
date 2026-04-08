"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui";
import type { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils/format";

interface Props {
  posts: BlogPost[];
  categories: string[];
}

export function BlogGrid({ posts, categories }: Props) {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? posts : posts.filter((p) => p.category === active);
  const [featured, ...rest] = filtered;

  return (
    <>
      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              active === cat
                ? "bg-black text-white"
                : "bg-white text-gray-600 border border-[#e8e6e2] hover:border-gray-400 hover:text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {!featured && (
        <p className="text-gray-500 text-sm">No posts in this category yet.</p>
      )}

      {/* Featured post */}
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="group block mb-10">
          <div className="rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow bg-white grid grid-cols-1 lg:grid-cols-2">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[280px]">
              <Image
                src={featured.coverImage}
                alt={featured.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute top-3 left-3">
                <Badge variant="primary">{featured.category}</Badge>
              </div>
            </div>
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug">
                {featured.title}
              </h2>
              <p className="text-gray-500 mt-3 line-clamp-3">{featured.excerpt}</p>
              <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full overflow-hidden relative flex-shrink-0">
                    <Image src={featured.author.image} alt={featured.author.name} fill className="object-cover" sizes="24px" />
                  </div>
                  <span className="font-medium text-gray-600">{featured.author.name}</span>
                </div>
                <span>{formatDate(featured.publishedAt)}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readingTime} min read</span>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:underline">
                Read article <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Post grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className="rounded-xl bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="primary">{post.category}</Badge>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-1">{post.excerpt}</p>
                  <div className="border-t border-gray-100 mt-4 pt-3 flex items-center gap-3 text-xs text-gray-400">
                    <span className="font-medium text-gray-600">{post.author.name}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readingTime} min</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
