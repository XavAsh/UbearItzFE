import { describe, expect, it } from "vitest";
import { ApiError } from "@/services/http";
import { formatLoginRateLimitMessage, getLoginErrorMessage } from "@/lib/authErrors";

describe("formatLoginRateLimitMessage", () => {
  it("formats seconds in English", () => {
    expect(formatLoginRateLimitMessage("en", 45)).toContain("45");
    expect(formatLoginRateLimitMessage("en", 45)).toContain("seconds");
  });

  it("formats minutes in French", () => {
    expect(formatLoginRateLimitMessage("fr", 120)).toContain("2");
    expect(formatLoginRateLimitMessage("fr", 120)).toContain("minutes");
  });

  it("formats hours in English", () => {
    expect(formatLoginRateLimitMessage("en", 3600)).toContain("hour");
  });
});

describe("getLoginErrorMessage", () => {
  it("maps 429 responses using Retry-After", () => {
    const message = getLoginErrorMessage(new ApiError("blocked", 429, undefined, 120), "en");
    expect(message).toContain("2");
    expect(message).toContain("minute");
  });

  it("falls back to the original error message", () => {
    expect(getLoginErrorMessage(new Error("Invalid credentials."), "en")).toBe("Invalid credentials.");
  });
});
