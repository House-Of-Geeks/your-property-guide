import { describe, it, expect } from "vitest";
import { normalizePhone, isValidPhone } from "@/lib/utils/phone";

describe("normalizePhone", () => {
  it("normalises AU mobiles in common formats", () => {
    expect(normalizePhone("0412 345 678")).toBe("0412345678");
    expect(normalizePhone("0412-345-678")).toBe("0412345678");
    expect(normalizePhone("(0412) 345 678")).toBe("0412345678");
    expect(normalizePhone("0412345678")).toBe("0412345678");
  });

  it("converts international AU formats to local", () => {
    expect(normalizePhone("+61 412 345 678")).toBe("0412345678");
    expect(normalizePhone("+61412345678")).toBe("0412345678");
    expect(normalizePhone("61412345678")).toBe("0412345678");
    expect(normalizePhone("0011 61 412 345 678")).toBe("0412345678");
    // Contact-card convention keeping the trunk zero.
    expect(normalizePhone("+61 (0) 412 345 678")).toBe("0412345678");
    expect(normalizePhone("+61 (0)2 9555 1234")).toBe("0295551234");
  });

  it("accepts AU landlines", () => {
    expect(normalizePhone("(02) 9555 1234")).toBe("0295551234");
    expect(normalizePhone("03 9555 1234")).toBe("0395551234");
    expect(normalizePhone("07 3555 1234")).toBe("0735551234");
    expect(normalizePhone("08 8555 1234")).toBe("0885551234");
  });

  it("accepts 13/1300/1800 business numbers", () => {
    expect(normalizePhone("13 11 14")).toBe("131114");
    expect(normalizePhone("1300 123 456")).toBe("1300123456");
    expect(normalizePhone("1800 123 456")).toBe("1800123456");
  });

  it("keeps plausible overseas numbers in international format", () => {
    expect(normalizePhone("+44 20 7946 0958")).toBe("+442079460958");
    expect(normalizePhone("+1 (415) 555-2671")).toBe("+14155552671");
    expect(normalizePhone("+64 21 123 456")).toBe("+6421123456");
  });

  it("rejects junk", () => {
    expect(normalizePhone("")).toBeNull();
    expect(normalizePhone("   ")).toBeNull();
    expect(normalizePhone("asdf")).toBeNull();
    expect(normalizePhone("123")).toBeNull();
    expect(normalizePhone("0000000000")).toBeNull();
    expect(normalizePhone("0512345678")).toBeNull(); // 05 isn't an AU range
    expect(normalizePhone("04123")).toBeNull(); // too short
    expect(normalizePhone("041234567890")).toBeNull(); // too long
    expect(normalizePhone("no thanks")).toBeNull();
  });
});

describe("isValidPhone", () => {
  it("mirrors normalizePhone", () => {
    expect(isValidPhone("0412 345 678")).toBe(true);
    expect(isValidPhone("+61 412 345 678")).toBe(true);
    expect(isValidPhone("garbage")).toBe(false);
  });
});
