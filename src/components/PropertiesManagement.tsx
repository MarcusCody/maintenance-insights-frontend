import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  Button,
  Alert,
  Avatar,
  Grid,
  Select,
  Option,
  Input,
  IconButton,
  Table,
  LinearProgress,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from '@mui/joy'
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  People as PeopleIcon,
  Build as BuildIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material'
import PropertyCard from './PropertyCard'

// Mock data for properties
const mockProperties = [
  {
    id: 'PROP-001',
    name: 'Sunset Apartments',
    type: 'residential' as const,
    address: '123 Sunset Blvd, Los Angeles, CA 90028',
    units: 48,
    occupancy: 46,
    maintenanceScore: 92,
    activeIssues: 3,
    lastInspection: '2024-01-10',
    status: 'good' as const,
    monthlyRevenue: 72000,
    expenses: 18500,
    manager: 'Sarah Johnson',
    yearBuilt: 2018,
    amenities: ['Pool', 'Gym', 'Parking', 'Laundry'],
    maintenanceHistory: {
      thisMonth: 8,
      lastMonth: 12,
      avgCost: 245
    }
  },
  {
    id: 'PROP-002',
    name: 'Oak Street Complex',
    type: 'residential' as const,
    address: '456 Oak Street, Beverly Hills, CA 90210',
    units: 32,
    occupancy: 29,
    maintenanceScore: 88,
    activeIssues: 2,
    lastInspection: '2024-01-08',
    status: 'good' as const,
    monthlyRevenue: 64000,
    expenses: 15200,
    manager: 'Mike Rodriguez',
    yearBuilt: 2020,
    amenities: ['Gym', 'Parking', 'Garden'],
    maintenanceHistory: {
      thisMonth: 6,
      lastMonth: 9,
      avgCost: 198
    }
  },
  {
    id: 'PROP-003',
    name: 'Downtown Plaza',
    type: 'commercial' as const,
    address: '789 Downtown Ave, Los Angeles, CA 90013',
    units: 24,
    occupancy: 21,
    maintenanceScore: 75,
    activeIssues: 5,
    lastInspection: '2024-01-05',
    status: 'warning' as const,
    monthlyRevenue: 96000,
    expenses: 28400,
    manager: 'Lisa Chen',
    yearBuilt: 2015,
    amenities: ['Parking', 'Security', 'Elevator'],
    maintenanceHistory: {
      thisMonth: 12,
      lastMonth: 15,
      avgCost: 312
    }
  },
  {
    id: 'PROP-004',
    name: 'Garden View Residences',
    type: 'residential' as const,
    address: '321 Garden Way, Santa Monica, CA 90405',
    units: 28,
    occupancy: 27,
    maintenanceScore: 95,
    activeIssues: 1,
    lastInspection: '2024-01-12',
    status: 'good' as const,
    monthlyRevenue: 58000,
    expenses: 12800,
    manager: 'David Park',
    yearBuilt: 2021,
    amenities: ['Pool', 'Garden', 'Parking'],
    maintenanceHistory: {
      thisMonth: 4,
      lastMonth: 6,
      avgCost: 156
    }
  },
  {
    id: 'PROP-005',
    name: 'Metro Heights',
    type: 'residential' as const,
    address: '654 Metro Blvd, Hollywood, CA 90028',
    units: 36,
    occupancy: 31,
    maintenanceScore: 82,
    activeIssues: 4,
    lastInspection: '2024-01-07',
    status: 'warning' as const,
    monthlyRevenue: 54000,
    expenses: 16200,
    manager: 'Jennifer Wu',
    yearBuilt: 2017,
    amenities: ['Gym', 'Parking'],
    maintenanceHistory: {
      thisMonth: 10,
      lastMonth: 13,
      avgCost: 278
    }
  },
  {
    id: 'PROP-006',
    name: 'Industrial Park East',
    type: 'industrial' as const,
    address: '987 Industrial Way, Long Beach, CA 90805',
    units: 12,
    occupancy: 10,
    maintenanceScore: 78,
    activeIssues: 3,
    lastInspection: '2024-01-06',
    status: 'warning' as const,
    monthlyRevenue: 45000,
    expenses: 18900,
    manager: 'Robert Kim',
    yearBuilt: 2012,
    amenities: ['Loading Dock', 'Security'],
    maintenanceHistory: {
      thisMonth: 8,
      lastMonth: 11,
      avgCost: 425
    }
  }
]

const propertyStats = {
  totalProperties: 6,
  totalUnits: 180,
  totalOccupied: 164,
  occupancyRate: 91.1,
  avgMaintenanceScore: 85,
  totalRevenue: 389000,
  totalExpenses: 110000,
  netIncome: 279000
}

const maintenanceOverview = [
  { category: 'Plumbing', count: 15, avgCost: 225, trend: 'up' },
  { category: 'Electrical', count: 12, avgCost: 185, trend: 'down' },
  { category: 'HVAC', count: 8, avgCost: 340, trend: 'up' },
  { category: 'General', count: 6, avgCost: 125, trend: 'stable' },
]

export default function PropertiesManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [activeTab, setActiveTab] = useState(0)
  const filteredProperties = useMemo(() => {
    return mockProperties.filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.address.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || property.type === filterType
      const matchesStatus = filterStatus === 'all' || property.status === filterStatus
      
      return matchesSearch && matchesType && matchesStatus
    })
  }, [searchTerm, filterType, filterStatus])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon sx={{ color: 'danger.main', fontSize: 16 }} />
      case 'down': return <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, transform: 'rotate(180deg)' }} />
      default: return <CheckCircleIcon sx={{ color: 'neutral.main', fontSize: 16 }} />
    }
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography level="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <HomeIcon color="primary" />
            Properties Management
          </Typography>
          <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
            Manage and monitor all properties in your portfolio
          </Typography>
        </Box>
        <Button startDecorator={<AddIcon />} size="sm">
          Add Property
        </Button>
      </Box>

      {/* Portfolio Overview */}
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                    Total Properties
                  </Typography>
                  <Typography level="h2" fontWeight="bold">
                    {propertyStats.totalProperties}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <HomeIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                    Occupancy Rate
                  </Typography>
                  <Typography level="h2" fontWeight="bold">
                    {propertyStats.occupancyRate}%
                  </Typography>
                  <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                    {propertyStats.totalOccupied}/{propertyStats.totalUnits} units
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <PeopleIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                    Avg Maintenance Score
                  </Typography>
                  <Typography level="h2" fontWeight="bold">
                    {propertyStats.avgMaintenanceScore}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <BuildIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                    Net Income
                  </Typography>
                  <Typography level="h2" fontWeight="bold">
                    ${(propertyStats.netIncome / 1000).toFixed(0)}K
                  </Typography>
                  <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                    Monthly
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <AssessmentIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Maintenance Overview */}
      <Card>
        <CardContent>
          <Typography level="h4" sx={{ mb: 2 }}>
            Maintenance Overview
          </Typography>
          <Grid container spacing={2}>
            {maintenanceOverview.map((item) => (
              <Grid xs={12} sm={6} md={3} key={item.category}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography level="body-sm" fontWeight="bold">
                          {item.category}
                        </Typography>
                        <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                          {item.count} requests
                        </Typography>
                        <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                          ${item.avgCost} avg cost
                        </Typography>
                      </Box>
                      {getTrendIcon(item.trend)}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Properties Section */}
      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as number)}>
            <TabList>
              <Tab>Properties List</Tab>
              <Tab>Performance Analysis</Tab>
              <Tab>Financial Overview</Tab>
            </TabList>

            {/* Properties List Tab */}
            <TabPanel value={0}>
              <Stack spacing={3}>
                {/* Search and Filters */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Input
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startDecorator={<SearchIcon />}
                    sx={{ flex: 1 }}
                  />
                  <Select
                    value={filterType}
                    onChange={(_, value) => setFilterType(value as string)}
                    placeholder="Type"
                    size="sm"
                  >
                    <Option value="all">All Types</Option>
                    <Option value="residential">Residential</Option>
                    <Option value="commercial">Commercial</Option>
                    <Option value="industrial">Industrial</Option>
                  </Select>
                  <Select
                    value={filterStatus}
                    onChange={(_, value) => setFilterStatus(value as string)}
                    placeholder="Status"
                    size="sm"
                  >
                    <Option value="all">All Status</Option>
                    <Option value="good">Good</Option>
                    <Option value="warning">Warning</Option>
                    <Option value="critical">Critical</Option>
                  </Select>
                  <IconButton variant="outlined" size="sm">
                    <FilterIcon />
                  </IconButton>
                </Stack>

                {/* Properties Grid */}
                <Grid container spacing={3}>
                  {filteredProperties.map((property) => (
                    <Grid xs={12} md={6} lg={4} key={property.id}>
                      <PropertyCard property={property} />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </TabPanel>

            {/* Performance Analysis Tab */}
            <TabPanel value={1}>
              <Stack spacing={3}>
                <Typography level="h4">Property Performance Metrics</Typography>
                <Table hoverRow>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Occupancy</th>
                      <th>Maintenance Score</th>
                      <th>Active Issues</th>
                      <th>Monthly Revenue</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map((property) => (
                      <tr key={property.id}>
                        <td>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar size="sm" sx={{ bgcolor: 'primary.main' }}>
                              <HomeIcon />
                            </Avatar>
                            <Box>
                              <Typography level="body-sm" fontWeight="medium">
                                {property.name}
                              </Typography>
                              <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                {property.type}
                              </Typography>
                            </Box>
                          </Stack>
                        </td>
                        <td>
                          <Box>
                            <Typography level="body-sm">
                              {Math.round((property.occupancy / property.units) * 100)}%
                            </Typography>
                            <LinearProgress
                              determinate
                              value={(property.occupancy / property.units) * 100}
                              sx={{ mt: 0.5, width: 80 }}
                              color={(property.occupancy / property.units) > 0.9 ? 'success' : 'warning'}
                            />
                          </Box>
                        </td>
                        <td>
                          <Chip
                            size="sm"
                            color={property.maintenanceScore >= 90 ? 'success' : property.maintenanceScore >= 80 ? 'warning' : 'danger'}
                            variant="soft"
                          >
                            {property.maintenanceScore}
                          </Chip>
                        </td>
                        <td>
                          <Chip
                            size="sm"
                            color={property.activeIssues === 0 ? 'success' : property.activeIssues <= 2 ? 'warning' : 'danger'}
                            variant="outlined"
                          >
                            {property.activeIssues}
                          </Chip>
                        </td>
                        <td>
                          <Typography level="body-sm" fontWeight="medium">
                            ${(property.monthlyRevenue / 1000).toFixed(0)}K
                          </Typography>
                        </td>
                        <td>
                          <Stack direction="row" spacing={1}>
                            <IconButton size="sm" variant="outlined">
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton size="sm" variant="outlined">
                              <EditIcon />
                            </IconButton>
                            <IconButton size="sm" variant="outlined">
                              <MoreVertIcon />
                            </IconButton>
                          </Stack>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Stack>
            </TabPanel>

            {/* Financial Overview Tab */}
            <TabPanel value={2}>
              <Stack spacing={3}>
                <Typography level="h4">Financial Performance</Typography>
                <Grid container spacing={3}>
                  {filteredProperties.map((property) => (
                    <Grid xs={12} md={6} lg={4} key={property.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography level="title-md" fontWeight="bold">
                                {property.name}
                              </Typography>
                              <Chip size="sm" color="primary" variant="soft">
                                {property.type}
                              </Chip>
                            </Box>
                            
                            <Stack spacing={1}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography level="body-sm">Monthly Revenue</Typography>
                                <Typography level="body-sm" fontWeight="bold" sx={{ color: 'success.main' }}>
                                  ${property.monthlyRevenue.toLocaleString()}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography level="body-sm">Monthly Expenses</Typography>
                                <Typography level="body-sm" fontWeight="bold" sx={{ color: 'danger.main' }}>
                                  ${property.expenses.toLocaleString()}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                <Typography level="body-sm" fontWeight="bold">Net Income</Typography>
                                <Typography level="body-sm" fontWeight="bold" sx={{ color: 'primary.main' }}>
                                  ${(property.monthlyRevenue - property.expenses).toLocaleString()}
                                </Typography>
                              </Box>
                            </Stack>

                            <Box>
                              <Typography level="body-sm" sx={{ mb: 1 }}>
                                Profit Margin: {Math.round(((property.monthlyRevenue - property.expenses) / property.monthlyRevenue) * 100)}%
                              </Typography>
                              <LinearProgress
                                determinate
                                value={((property.monthlyRevenue - property.expenses) / property.monthlyRevenue) * 100}
                                color="success"
                              />
                            </Box>

                            <Alert color="primary" variant="soft" size="sm">
                              <Typography level="body-xs">
                                <strong>Maintenance:</strong> {property.maintenanceHistory.thisMonth} requests this month
                                (avg ${property.maintenanceHistory.avgCost})
                              </Typography>
                            </Alert>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </TabPanel>
          </Tabs>
        </CardContent>
      </Card>
    </Stack>
  )
}
