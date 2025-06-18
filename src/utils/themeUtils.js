import { useTheme, useMediaQuery } from '@mui/material'

/**
 * Adjusts an RGBA color based on the theme mode.
 * If the theme is in dark mode, the color is darkened by a specified factor.
 * If the theme is in light mode, the original color is returned unchanged.
 *
 * @param {string} lightColor - The original RGBA color string (e.g., "rgba(255, 255, 255, 0.8)").
 * @param {number} [darkenFactor=0.5] - The factor by which to darken the color in dark mode (default: 0.5).
 * @returns {string} - The adjusted RGBA color string.
 */
export function rgbaColorToTheme(lightColor, darkenFactor = 0.5) {
  const theme = useTheme()

  // If the theme is not in dark mode, return the original color
  if (theme.palette.mode !== 'dark') return lightColor

  // Match the RGBA color components using a regular expression
  const match = lightColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (!match) return lightColor // Return the original color if it doesn't match the RGBA format

  // Extract the RGB components and darken them by the specified factor
  const [r, g, b] = match.slice(1, 4).map((val) => Math.max(0, parseInt(val, 10) * (1 - darkenFactor)))

  // Extract the alpha component (opacity), defaulting to 1 if not provided
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1

  // Return the adjusted RGBA color string
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`
}

/**
 * Custom hook to check if the application is running on a mobile device.
 * Uses the theme's breakpoints to determine if the screen width is below 'md'.
 * Automatically updates when the screen size changes.
 *
 * @returns {boolean} - True if the application is running on a mobile device, false otherwise.
 */
export function useCheckMobile() {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.down('md'))
}