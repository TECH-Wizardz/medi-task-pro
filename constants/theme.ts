/**
 * Design token palette for MediTaskPro.
 * Structure:
 *   palette   – raw hex values, never used directly in components
 *   Colors    – semantic tokens split into `light` and `dark` schemes
 *   Fonts     – platform-aware font stacks
 */

import { Platform } from 'react-native';

// ─────────────────────────────────────────────
// Raw palette (single source of truth)
// ─────────────────────────────────────────────
const palette = {
  // Neutrals
  white:        '#FFFFFF',
  black:        '#000000',

  gray50:       '#F9FAFB',
  gray100:      '#F3F4F6',
  gray200:      '#E5E7EB',
  gray300:      '#D1D5DB',
  gray400:      '#9CA3AF',
  gray500:      '#6B7280',
  gray700:      '#374151',
  gray900:      '#111827',

  slate100:     '#F1F5F9',
  offWhite:     '#FAFAFA',

  // Dark-mode surface scale
  dark50:       '#1E2433',   // card / input bg
  dark100:      '#252B3B',   // separator / border
  dark200:      '#2E3548',   // divider
  dark300:      '#3B4259',   // checkbox border
  dark400:      '#4B5268',   // placeholder / subtext
  dark500:      '#6B7280',   // icon / inactive text
  dark700:      '#9CA3AF',   // labels / cancel text
  dark900:      '#E5E7EB',   // primary text

  // Base surfaces
  surface:      '#111420',   // app background (dark)
  surfaceCard:  '#1A1F2E',   // card bg (dark)

  // Blue primary
  blue400:      '#60A5FA',
  blue500:      '#3B82F6',
  blue600:      '#2563EB',
  blue50:       '#EFF6FF',
  blue900:      '#1E3A5F',   // primaryBg dark

  // Semantic – green
  green500:     '#22C55E',
  green50:      '#DCFCE7',
  green900:     '#14532D',   // successBg dark

  // Semantic – amber
  amber500:     '#F59E0B',
  amber50:      '#FEF3C7',
  amber900:     '#78350F',   // warningBg dark

  // Semantic – red
  red500:       '#EF4444',
  red50:        '#FEE2E2',
  red900:       '#7F1D1D',   // errorBg dark

  // Accent – purple
  purple500:    '#8B5CF6',
  purple50:     '#F5F3FF',
  purple900:    '#3B0764',   // purpleBg dark

  // Accent – orange
  orange500:    '#F97316',
  orange50:     '#FFF7ED',
  orange900:    '#431407',   // orangeBg dark

  // Overlays & shadows
  overlayLight: 'rgba(0,0,0,0.4)',
  overlayDark:  'rgba(0,0,0,0.6)',
  shadowColor:  '#000000',
} as const;

// ─────────────────────────────────────────────
// Semantic color tokens
// ─────────────────────────────────────────────
export const Colors = {
  light: {
    // Neutrals
    white:        palette.white,
    black:        palette.black,
    gray900:      palette.gray900,    // dark text / titles
    gray700:      palette.gray700,    // labels, cancel text
    gray500:      palette.gray500,    // icon, inactive text
    gray400:      palette.gray400,    // placeholder, subtext, light icons
    gray300:      palette.gray300,    // checkbox border
    gray200:      palette.gray200,    // borders, dividers, progress track
    gray100:      palette.gray100,    // inactive tag / cancel button bg
    gray50:       palette.gray50,     // unselected chip bg
    slate100:     palette.slate100,   // card border, separator lines
    offWhite:     palette.offWhite,   // input / date picker bg

    // Primary (blue)
    primary:      palette.blue500,    // brand blue, FAB, active tag, gradient start
    primaryDark:  palette.blue600,    // submit button, date confirm text
    primaryLight: palette.blue400,    // gradient end
    primaryBg:    palette.blue50,     // Patients category badge bg

    // Semantic
    success:      palette.green500,   // low priority, synced icon, checkbox checked
    successBg:    palette.green50,    // low priority badge bg
    warning:      palette.amber500,   // medium priority, sync pending icon
    warningBg:    palette.amber50,    // medium priority badge bg
    error:        palette.red500,     // high priority, delete, error states
    errorBg:      palette.red50,      // high priority badge bg

    // Category / accent
    purple:       palette.purple500,  // Personal category text
    purpleBg:     palette.purple50,   // Personal category badge bg
    orange:       palette.orange500,  // Work category text
    orangeBg:     palette.orange50,   // Work category badge bg

    // UI chrome
    background:   palette.white,
    cardBg:       palette.white,
    overlay:      palette.overlayLight,
    shadow:       palette.shadowColor,

    // Navigation (Expo Router defaults)
    text:         palette.gray900,
    tint:         palette.blue500,
    icon:         palette.gray500,
    tabIconDefault:  palette.gray500,
    tabIconSelected: palette.blue500,
  },

  dark: {
    // Neutrals (inverted scale)
    white:        palette.white,
    black:        palette.black,
    gray900:      palette.dark900,    // primary text
    gray700:      palette.dark700,    // labels, cancel text
    gray500:      palette.dark500,    // icon, inactive text
    gray400:      palette.dark400,    // placeholder, subtext, light icons
    gray300:      palette.dark300,    // checkbox border
    gray200:      palette.dark200,    // borders, dividers, progress track
    gray100:      palette.dark100,    // inactive tag / cancel button bg
    gray50:       palette.dark50,     // unselected chip bg
    slate100:     palette.dark100,    // card border, separator lines
    offWhite:     palette.dark50,     // input / date picker bg

    // Primary (blue – same hue, lighter for dark bg readability)
    primary:      palette.blue400,    // brand blue, FAB, active tag, gradient start
    primaryDark:  palette.blue500,    // submit button, date confirm text
    primaryLight: palette.blue400,    // gradient end
    primaryBg:    palette.blue900,    // Patients category badge bg

    // Semantic
    success:      palette.green500,   // low priority, synced icon, checkbox checked
    successBg:    palette.green900,   // low priority badge bg
    warning:      palette.amber500,   // medium priority, sync pending icon
    warningBg:    palette.amber900,   // medium priority badge bg
    error:        palette.red500,     // high priority, delete, error states
    errorBg:      palette.red900,     // high priority badge bg

    // Category / accent
    purple:       palette.purple500,  // Personal category text
    purpleBg:     palette.purple900,  // Personal category badge bg
    orange:       palette.orange500,  // Work category text
    orangeBg:     palette.orange900,  // Work category badge bg

    // UI chrome
    background:   palette.surface,
    cardBg:       palette.surfaceCard,
    overlay:      palette.overlayDark,
    shadow:       palette.shadowColor,

    // Navigation (Expo Router defaults)
    text:         palette.dark900,
    tint:         palette.blue400,
    icon:         palette.dark500,
    tabIconDefault:  palette.dark500,
    tabIconSelected: palette.blue400,
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = typeof Colors.light;

/** Flat alias for light-scheme tokens — used by components that don't need dynamic theming. */
export const AppColors = Colors.light;

// ─────────────────────────────────────────────
// Font stacks
// ─────────────────────────────────────────────
export const Fonts = Platform.select({
  ios: {
    sans:    'system-ui',
    serif:   'ui-serif',
    rounded: 'ui-rounded',
    mono:    'ui-monospace',
  },
  default: {
    sans:    'normal',
    serif:   'serif',
    rounded: 'normal',
    mono:    'monospace',
  },
  web: {
    sans:    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif:   "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono:    "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
