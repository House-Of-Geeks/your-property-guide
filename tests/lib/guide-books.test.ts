import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { GUIDE_BOOKS } from "@/lib/guide-books";

// The two guides as books (homepage shelf, hero books, landing pages). One
// source for the contents, so the 3D book's page and the landing page's
// list can't drift apart.
describe("guide books", () => {
  for (const book of Object.values(GUIDE_BOOKS)) {
    it(`${book.id}: ten chapters, a real cover and its own page`, () => {
      expect(book.chapters).toHaveLength(10);
      for (const c of book.chapters) {
        expect(c.title.length).toBeGreaterThan(5);
        expect(c.sub.length).toBeGreaterThan(5);
      }
      expect(existsSync(path.join(process.cwd(), "public", book.cover))).toBe(true);
      expect(book.href).toBe(`/${book.id}-guide`);
      expect(existsSync(path.join(process.cwd(), "src/app/(marketing)", book.href, "page.tsx"))).toBe(true);
    });
  }
});
