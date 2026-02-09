/**
 * @file documentPolicy.ts
 * @module sttf/documentPolicy
 *
 * @remarks
 * Helpers to parse/merge/serialize the `Document-Policy` header value.
 */

import type { HeaderValue } from "./types";

/**
 * Normalizes a possibly-multi-value header into a single comma-separated string.
 *
 * @param value Raw header value.
 * @returns A string (empty if not present).
 */
export function normalizeHeaderValue(value: HeaderValue): string {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(String).join(", ");
  return String(value);
}

/**
 * Parses a `Document-Policy` header value into comma-separated tokens.
 *
 * @param value Header value.
 * @returns Tokens, trimmed, excluding empty items.
 */
export function parseDocumentPolicy(value: string): string[] {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Serializes `Document-Policy` tokens into a comma-separated header string.
 *
 * @param tokens Policy tokens.
 * @returns Header value.
 */
export function serializeDocumentPolicy(tokens: readonly string[]): string {
  return tokens.join(", ");
}

/**
 * Ensures a token exists in a token list (case-insensitive match).
 *
 * @param tokens Existing tokens.
 * @param token Token to ensure.
 * @returns New tokens with `token` present.
 */
export function ensurePolicyToken(tokens: readonly string[], token: string): string[] {
  const needle = token.toLowerCase();
  const has = tokens.some((t) => t.toLowerCase() === needle);
  return has ? [...tokens] : [...tokens, token];
}

/**
 * Builds a `Document-Policy` header value that includes `force-load-at-top`.
 *
 * @param existing Existing `Document-Policy` value (already normalized).
 * @param options Controls merge/overwrite behavior.
 * @returns New header value (may equal `existing`).
 */
export function buildForceLoadAtTopDocumentPolicy(
  existing: string,
  options: { merge?: boolean; overwrite?: boolean } = {},
): string {
  const merge = options.merge ?? true;
  const overwrite = options.overwrite ?? false;

  if (overwrite) return "force-load-at-top";

  const tokens = parseDocumentPolicy(existing);

  if (!merge) {
    return tokens.length === 0 ? "force-load-at-top" : existing;
  }

  return serializeDocumentPolicy(ensurePolicyToken(tokens, "force-load-at-top"));
}
