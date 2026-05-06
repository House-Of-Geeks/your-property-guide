// Targeted blog-only re-seed. Upserts every entry from src/lib/data/blogs.ts
// without touching agencies, properties, suburbs, etc. Safe to run any time.
//
// Usage: npx tsx scripts/seed/seed-blogs.ts

import "dotenv/config";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { blogPosts } from "../../src/lib/data/blogs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`🌱 Seeding ${blogPosts.length} blog posts...`);

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        authorName: post.author.name,
        authorImage: post.author.image,
        category: post.category,
        tags: post.tags,
        publishedAt: new Date(post.publishedAt),
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
        readingTime: post.readingTime,
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        authorName: post.author.name,
        authorImage: post.author.image,
        category: post.category,
        tags: post.tags,
        publishedAt: new Date(post.publishedAt),
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
        readingTime: post.readingTime,
      },
    });
  }

  console.log(`✅ ${blogPosts.length} blog posts seeded.\n`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
