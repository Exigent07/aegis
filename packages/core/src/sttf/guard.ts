/**
 * @file guard.ts
 * @module sttf/guard
 *
 * @remarks
 * This file separates:
 * - header computation ({@link STTFHeaderOptions})
 * - application logic ({@link STTFGuardOptions})
 *
 * Keeping the pure computation helper callback-free avoids TS assignability issues when
 * adapters provide strongly typed `(req, res)` predicates.
 */

import type { HeaderReadableWritable, STTFGuardOptions, STTFHeaderOptions } from "./types";
import { buildForceLoadAtTopDocumentPolicy, normalizeHeaderValue } from "./documentPolicy";

/**
 * A computed header ready to be applied to a response.
 */
export interface ComputedHeader {
  /**
   * Header name (typically `"Document-Policy"`).
   */
  name: string;

  /**
   * Header value (contains `"force-load-at-top"`).
   */
  value: string;
}

/**
 * Computes the STTF mitigation header from an existing `Document-Policy` header state.
 *
 * @param existingDocumentPolicy Existing header value (raw).
 * @param options Header computation options.
 * @returns A header to set, or `null` if disabled or a no-op.
 */
export function getSTTFProtectionHeader(
  existingDocumentPolicy: unknown,
  options: STTFHeaderOptions = {},
): ComputedHeader | null {
  if (options.enabled === false) return null;

  const headerName = options.headerName ?? "Document-Policy";
  const existing = normalizeHeaderValue(existingDocumentPolicy as any);

  const nextValue = buildForceLoadAtTopDocumentPolicy(existing, {
    merge: options.merge,
    overwrite: options.overwrite,
  });

  if (existing && nextValue === existing) return null;

  return { name: headerName, value: nextValue };
}

/**
 * Applies STTF protection to a response-like object by setting the computed header.
 *
 * @template Req
 * @template Res
 * @param req Request object (used only by `shouldApply`).
 * @param res Response object supporting Node (`getHeader`/`setHeader`) or Express (`get`/`set`).
 * @param options Guard options, including optional `shouldApply`.
 * @returns True if a header was set; false otherwise.
 * @throws {TypeError} If the response does not expose compatible header methods.
 */
export function applySTTFProtection<Req = unknown, Res extends HeaderReadableWritable = any>(
  req: Req,
  res: Res,
  options: STTFGuardOptions<Req, Res> = {},
): boolean {
  if (typeof options.shouldApply === "function" && !options.shouldApply(req, res)) return false;

  const headerName = options.headerName ?? "Document-Policy";

  const hasNodeStyle =
    typeof (res as any).getHeader === "function" && typeof (res as any).setHeader === "function";

  const hasExpressStyle =
    typeof (res as any).get === "function" && typeof (res as any).set === "function";

  if (!hasNodeStyle && !hasExpressStyle) {
    throw new TypeError("Response must support getHeader/setHeader (Node) or get/set (Express).");
  }

  const existing = hasNodeStyle ? (res as any).getHeader(headerName) : (res as any).get(headerName);
  const header = getSTTFProtectionHeader(existing, options);
  if (!header) return false;

  if (hasNodeStyle) (res as any).setHeader(header.name, header.value);
  else (res as any).set(header.name, header.value);

  return true;
}
