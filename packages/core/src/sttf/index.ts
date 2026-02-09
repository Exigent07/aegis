/**
 * @packageDocumentation
 * STTF mitigation primitives.
 *
 * @remarks
 * This module provides utilities to emit `Document-Policy: force-load-at-top` to mitigate
 * Scroll-To-Text Fragment (STTF) XS-Leaks by preventing scroll-on-load behaviors.
 *
 * @see https://wicg.github.io/scroll-to-text-fragment/
 */
export * from "./types";
export * from "./documentPolicy";
export * from "./guard";
