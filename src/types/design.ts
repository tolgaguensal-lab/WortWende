/**
 * Design System Types — mirrors tokens defined in globals.css and design-tokens.ts.
 * Used for strict typing of component props and interaction contracts.
 */

import type { colors, radii, fonts } from "@/lib/design-tokens";

// ── Token Types ──

export type ColorToken = keyof typeof colors;
export type RadiusToken = keyof typeof radii;
export type SpacingToken = string;
export type AnimationToken = string;
export type BreakpointToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type FontToken = keyof typeof fonts;

// ── Button Types ──

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "gold";

export type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

export type ButtonState =
  | "default"
  | "hover"
  | "active"
  | "focus"
  | "loading"
  | "disabled"
  | "success";

// ── Card Types ──

export type CardType = "default" | "elevated" | "outline" | "paper" | "dark" | "glass";

// ── Feedback Types ──

export type FeedbackType = "success" | "error" | "info" | "warning";

// ── Skill Icon Types ──

export type SkillIcon = "BookOpen" | "Headphones" | "MessageSquare" | "PenLine" | "Sigma" | "BookA" | "RefreshCw" | "ScrollText";

// ── Animation Presets ──

export type AnimationPreset = "fadeIn" | "fadeUp" | "scaleIn" | "slideRight" | "stagger";

// ── Interaction Contract ──

export interface InteractionContract {
  /** Unique ID: IC-{PAGE}-{ELEMENT}-{NR} */
  id: string;
  /** Element type */
  type: "button" | "link" | "input" | "toggle" | "card";
  /** Visible text of the element */
  text: string;
  /** Page or section where the element lives */
  page: string;
  /** Target route (if it's a link) */
  route?: string;
  /** All possible states */
  states: string[];
  /** What happens on click/submit */
  trigger: string;
  /** What indicates success */
  success: string;
  /** What indicates an error and which errors can occur */
  error: string;
  /** When and how loading is shown */
  loading: string;
  /** Path to the E2E test file */
  test: string;
  /** Accessibility: aria-label, role, keyboard behavior */
  a11y: string;
}

// ── Component Size Props ──

export interface WithSize<T extends string = ButtonSize> {
  size?: T;
}

export interface WithVariant<T extends string = ButtonVariant> {
  variant?: T;
}

export interface WithLoading {
  loading?: boolean;
}

export interface WithDisabled {
  disabled?: boolean;
}

// ── Layout Constants ──

export const NAV_HEIGHT = 64;
export const SIDEBAR_WIDTH = 260;
export const BOTTOM_NAV_HEIGHT = 56;

export const LAYOUT_MAX_WIDTHS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
} as const;

// ── Touch Target ──

export const MIN_TOUCH_TARGET = 44;
