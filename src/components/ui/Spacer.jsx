import { Box } from '@mui/material'

/**
 * Spacer component that fills available flex space.
 *
 * @param {number} grow - The flexGrow value (default: 1)
 * @returns {JSX.Element} A flexible spacer box
 */
export default function Spacer({ grow = 1 }) {
  return <Box sx={{ flexGrow: grow }} />
}