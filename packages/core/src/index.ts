/**
 * @packageDocumentation
 * `@aegis/core` — shared, framework-agnostic primitives for Aegis.
 *
 * @remarks
 * This package provides:
 * - A typed configuration helper (`defineAegisConfig`) for CLIs/templates and user configs.
 * - STTF mitigation primitives built around `Document-Policy: force-load-at-top`. [page:7]
 */

export * from "./config";
export * from "./sttf";
