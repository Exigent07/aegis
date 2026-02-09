/**
 * @packageDocumentation
 * Types used by STTF mitigation utilities.
 *
 * @remarks
 * The mitigation surface is a response header: `Document-Policy: force-load-at-top`. [page:7]
 */

/**
 * A header value as typically exposed by Node.js and popular frameworks.
 */
export type HeaderValue = string | number | string[] | undefined | null;

/**
 * A minimal response-like shape that supports reading and writing headers.
 *
 * @remarks
 * - Node: `getHeader`/`setHeader`
 * - Express: `get`/`set`
 *
 * Core does not depend on any particular framework types.
 */
export type HeaderReadableWritable =
  | { getHeader(name: string): HeaderValue; setHeader(name: string, value: string): unknown }
  | { get(name: string): HeaderValue; set(name: string, value: string): unknown };

/**
 * Options that affect how the STTF protection header is computed.
 *
 * @remarks
 * This intentionally does not include request/response callbacks to avoid generic variance issues.
 */
export interface STTFHeaderOptions {
  /**
   * Enables/disables STTF protection.
   *
   * @remarks
   * Enabled by default; only explicit `false` disables behavior.
   *
   * @defaultValue true
   */
  enabled?: boolean;

  /**
   * Header name to use for Document Policy.
   *
   * @defaultValue "Document-Policy"
   */
  headerName?: string;

  /**
   * When true, merges `force-load-at-top` into an existing Document-Policy value.
   *
   * @defaultValue true
   */
  merge?: boolean;

  /**
   * When true, overwrites any existing Document-Policy header value.
   *
   * @defaultValue false
   */
  overwrite?: boolean;
}

/**
 * Options controlling how the STTF protection header is computed and applied.
 *
 * @template Req Request type (framework-specific).
 * @template Res Response type (framework-specific).
 *
 * @remarks
 * This extends {@link STTFHeaderOptions} and adds a route-scoping callback.
 */
export interface STTFGuardOptions<Req = unknown, Res = unknown> extends STTFHeaderOptions {
  /**
   * Route-scoping hook; return true to apply, false to skip.
   *
   * @remarks
   * Adapters should expose this to allow easy per-route configuration in Express/Next/etc.
   */
  shouldApply?: (req: Req, res: Res) => boolean;
}
