import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Box,
  LinearProgress,
  IconButton,
  Avatar,
} from '@mui/joy'
import {
  Home as HomeIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material'

interface PropertyCardProps {
  property: {
    id: string
    name: string
    type: 'residential' | 'commercial' | 'industrial'
    address: string
    units: number
    occupancy: number
    maintenanceScore: number
    activeIssues: number
    lastInspection: string
    status: 'good' | 'warning' | 'critical'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'good': return 'success'
    case 'warning': return 'warning'
    case 'critical': return 'danger'
    default: return 'neutral'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'good': return <CheckCircleIcon />
    case 'warning': return <WarningIcon />
    case 'critical': return <WarningIcon />
    default: return <HomeIcon />
  }
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const occupancyPercentage = (property.occupancy / property.units) * 100

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <HomeIcon />
              </Avatar>
              <Box>
                <Typography level="title-md" fontWeight="bold">
                  {property.name}
                </Typography>
                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                  {property.address}
                </Typography>
              </Box>
            </Stack>
            <IconButton size="sm" variant="plain">
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Property Details */}
          <Stack direction="row" spacing={1}>
            <Chip size="sm" variant="soft" color="primary">
              {property.type}
            </Chip>
            <Chip size="sm" variant="soft" color="neutral">
              {property.units} units
            </Chip>
          </Stack>

          {/* Occupancy */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography level="body-sm" fontWeight="medium">
                Occupancy
              </Typography>
              <Typography level="body-sm">
                {property.occupancy}/{property.units} ({occupancyPercentage.toFixed(0)}%)
              </Typography>
            </Box>
            <LinearProgress
              determinate
              value={occupancyPercentage}
              sx={{ height: 6 }}
              color={occupancyPercentage > 90 ? 'success' : occupancyPercentage > 70 ? 'warning' : 'danger'}
            />
          </Box>

          {/* Maintenance Score */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography level="body-sm" fontWeight="medium">
                Maintenance Score
              </Typography>
              <Typography level="body-sm">
                {property.maintenanceScore}/100
              </Typography>
            </Box>
            <LinearProgress
              determinate
              value={property.maintenanceScore}
              sx={{ height: 6 }}
              color={property.maintenanceScore > 80 ? 'success' : property.maintenanceScore > 60 ? 'warning' : 'danger'}
            />
          </Box>

          {/* Status and Issues */}
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="sm"
                color={getStatusColor(property.status)}
                variant="soft"
                startDecorator={getStatusIcon(property.status)}
              >
                {property.status}
              </Chip>
              {property.activeIssues > 0 && (
                <Chip size="sm" color="warning" variant="outlined">
                  {property.activeIssues} issues
                </Chip>
              )}
            </Stack>
          </Stack>

          {/* Last Inspection */}
          <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
            Last inspection: {property.lastInspection}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
} 