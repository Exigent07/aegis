/**
 * @file config.ts
 * @module config
 *
 * @remarks
 * Aegis config is designed to be:
 * - Serializable (works with generated config files from a CLI).
 * - Composable (adapters can merge global defaults with per-call overrides).
 * - Framework-agnostic at the core layer (framework packages interpret their own fields).
 */

import type { STTFHeaderOptions } from "./sttf/types";

/**
 * STTF configuration for Aegis.
 *
 * @remarks
 * `@aegis/core` defines the shared header-level knobs; adapters may extend this shape
 * with framework-specific routing matchers.
 */
export interface AegisSTTFConfig extends STTFHeaderOptions {}

/**
 * Root configuration object for Aegis.
 *
 * @remarks
 * The CLI (`create-aegis-app`) should generate a file exporting this object.
 */
export interface AegisConfig {
  /**
   * Scroll-To-Text-Fragment (STTF) mitigation configuration.
   */
  sttf?: AegisSTTFConfig;
}

/**
 * Defines an Aegis config object with strong typing and preserved literal types.
 *
 * @typeParam T The concrete config type.
 * @param config The config object.
 * @returns The same config object (identity function).
 *
 * @example
 * // aegis.config.ts
 * import { defineAegisConfig } from "@aegis/core";
 *
 * export default defineAegisConfig({
 *   sttf: { enabled: true, merge: true }
 * });
 */
export function defineAegisConfig<T extends AegisConfig>(config: T): T {
  return config;
}
