import { useTranslation } from 'react-i18next'
import { Box, Typography, useTheme } from '@mui/material'
import { rgbaColorToTheme } from '../../utils/themeUtils'
import { COLOR_SCHEME_LEGEND } from '../../config'

/**
 * Widget to display the color scheme legend
 */
export default function ColorSchemeLegendWidget() {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        border: 1,
        borderRadius: 1,
        borderColor: theme.palette.divider,
        p: 2,
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {t('sidebar.colorScheme.title', 'Color Scheme')}
      </Typography>

      {COLOR_SCHEME_LEGEND.map((scheme, index) => (
        <Box key={index} display="flex" alignItems="center" gap={1}>
          <Box
            width="16px"
            height="16px"
            sx={{
              borderRadius: '50%',
              backgroundColor: rgbaColorToTheme(scheme.color),
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {t(`sidebar.colorScheme.${scheme.labelKey}`, scheme.defaultLabel)}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}