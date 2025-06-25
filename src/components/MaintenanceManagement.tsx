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
  Build as BuildIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  MonetizationOn as MoneyIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Warning as PriorityIcon,
} from '@mui/icons-material'

// Mock data for maintenance requests
const mockMaintenanceRequests = [
  {
    id: 'REQ-001',
    title: 'Kitchen faucet leaking',
    description: 'Persistent drip from kitchen faucet causing water damage',
    property: 'Sunset Apartments #204',
    category: 'plumbing',
    priority: 'medium' as const,
    status: 'open' as const,
    createdAt: '2024-01-15T10:30:00Z',
    assignedTo: 'Mike Rodriguez',
    estimatedCost: 120,
    actualCost: 0,
    estimatedDuration: 2,
    actualDuration: 0,
    tenant: 'John Smith',
    tenantContact: '(555) 123-4567',
    urgencyScore: 65,
    lastUpdate: '2024-01-15T10:30:00Z',
    images: ['faucet1.jpg', 'faucet2.jpg'],
    notes: []
  },
  {
    id: 'REQ-002',
    title: 'HVAC not heating properly',
    description: 'Temperature not reaching set point, possible filter issue',
    property: 'Oak Street Complex #15',
    category: 'hvac',
    priority: 'high' as const,
    status: 'in_progress' as const,
    createdAt: '2024-01-15T09:15:00Z',
    assignedTo: 'Sarah Chen',
    estimatedCost: 180,
    actualCost: 165,
    estimatedDuration: 3,
    actualDuration: 2.5,
    tenant: 'Mary Johnson',
    tenantContact: '(555) 987-6543',
    urgencyScore: 80,
    lastUpdate: '2024-01-15T14:20:00Z',
    images: ['hvac1.jpg'],
    notes: [
      { time: '2024-01-15T11:00:00Z', author: 'Sarah Chen', text: 'Diagnosed filter blockage, replacing now' },
      { time: '2024-01-15T14:20:00Z', author: 'Sarah Chen', text: 'Filter replaced, testing system' }
    ]
  },
  {
    id: 'REQ-003',
    title: 'Bathroom sink clogged',
    description: 'Sink draining slowly, likely hair blockage',
    property: 'Sunset Apartments #206',
    category: 'plumbing',
    priority: 'low' as const,
    status: 'completed' as const,
    createdAt: '2024-01-14T16:45:00Z',
    assignedTo: 'Mike Rodriguez',
    estimatedCost: 85,
    actualCost: 75,
    estimatedDuration: 1,
    actualDuration: 0.8,
    tenant: 'Lisa Park',
    tenantContact: '(555) 456-7890',
    urgencyScore: 35,
    lastUpdate: '2024-01-15T09:30:00Z',
    images: [],
    notes: [
      { time: '2024-01-15T08:00:00Z', author: 'Mike Rodriguez', text: 'Started drain cleaning' },
      { time: '2024-01-15T09:30:00Z', author: 'Mike Rodriguez', text: 'Completed. Drain flowing normally.' }
    ]
  },
  {
    id: 'REQ-004',
    title: 'Elevator maintenance',
    description: 'Scheduled quarterly elevator inspection and maintenance',
    property: 'Downtown Plaza',
    category: 'general',
    priority: 'medium' as const,
    status: 'scheduled' as const,
    createdAt: '2024-01-12T14:00:00Z',
    assignedTo: 'Metro Elevator Services',
    estimatedCost: 450,
    actualCost: 0,
    estimatedDuration: 4,
    actualDuration: 0,
    tenant: 'N/A',
    tenantContact: 'N/A',
    urgencyScore: 50,
    lastUpdate: '2024-01-12T14:00:00Z',
    images: [],
    notes: []
  },
  {
    id: 'REQ-005',
    title: 'Electrical outlet not working',
    description: 'Kitchen GFCI outlet has no power, needs reset or replacement',
    property: 'Garden View #12',
    category: 'electrical',
    priority: 'medium' as const,
    status: 'open' as const,
    createdAt: '2024-01-16T08:20:00Z',
    assignedTo: null,
    estimatedCost: 95,
    actualCost: 0,
    estimatedDuration: 1.5,
    actualDuration: 0,
    tenant: 'Robert Kim',
    tenantContact: '(555) 321-0987',
    urgencyScore: 60,
    lastUpdate: '2024-01-16T08:20:00Z',
    images: ['outlet1.jpg'],
    notes: []
  }
]

const contractors = [
  { id: 'CONT-001', name: 'Mike Rodriguez', company: 'Rodriguez Plumbing', specialties: ['plumbing'] },
  { id: 'CONT-002', name: 'Sarah Chen', company: 'Climate Control Experts', specialties: ['hvac'] },
  { id: 'CONT-003', name: 'Tom Wilson', company: 'Wilson Electric', specialties: ['electrical'] },
  { id: 'CONT-004', name: 'Metro Elevator Services', company: 'Metro Elevator Services', specialties: ['general'] },
]

const maintenanceStats = {
  totalRequests: 47,
  openRequests: 12,
  inProgress: 8,
  completed: 25,
  scheduled: 2,
  avgResponseTime: 1.8,
  avgCompletionTime: 2.4,
  totalCost: 8750,
  avgCost: 186
}

export default function MaintenanceManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [activeTab, setActiveTab] = useState(0)


  const filteredRequests = useMemo(() => {
    return mockMaintenanceRequests.filter(request => {
      const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || request.status === filterStatus
      const matchesCategory = filterCategory === 'all' || request.category === filterCategory
      const matchesPriority = filterPriority === 'all' || request.priority === filterPriority
      
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority
    })
  }, [searchTerm, filterStatus, filterCategory, filterPriority])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'warning'
      case 'in_progress': return 'primary'
      case 'completed': return 'success'
      case 'scheduled': return 'neutral'
      case 'cancelled': return 'danger'
      default: return 'neutral'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'neutral'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <PendingIcon />
      case 'in_progress': return <PlayArrowIcon />
      case 'completed': return <CheckCircleIcon />
      case 'scheduled': return <ScheduleIcon />
      case 'cancelled': return <CancelIcon />
      default: return <AssignmentIcon />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography level="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <BuildIcon color="primary" />
            Maintenance Management
          </Typography>
          <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
            Track and manage all maintenance requests across your portfolio
          </Typography>
        </Box>
        <Button startDecorator={<AddIcon />} size="sm">
          New Request
        </Button>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                    Total Requests
                  </Typography>
                  <Typography level="h2" fontWeight="bold">
                    {maintenanceStats.totalRequests}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AssignmentIcon />
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
                    Open/In Progress
                  </Typography>
                  <Typography level="h2" fontWeight="bold">
                    {maintenanceStats.openRequests + maintenanceStats.inProgress}
                  </Typography>
                  <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                    {maintenanceStats.openRequests} open, {maintenanceStats.inProgress} active
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <PendingIcon />
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
                    Avg Response Time
                  </Typography>
                  <Typography level="h2" fontWeight="bold">
                    {maintenanceStats.avgResponseTime}h
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <TimelineIcon />
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
                    Total Cost
                  </Typography>
                  <Typography level="h2" fontWeight="bold">
                    ${(maintenanceStats.totalCost / 1000).toFixed(1)}K
                  </Typography>
                  <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                    ${maintenanceStats.avgCost} avg
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'danger.main' }}>
                  <MoneyIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as number)}>
            <TabList>
              <Tab>All Requests</Tab>
              <Tab>Active Work</Tab>
              <Tab>Scheduling</Tab>
              <Tab>Reports</Tab>
            </TabList>

            {/* All Requests Tab */}
            <TabPanel value={0}>
              <Stack spacing={3}>
                {/* Filters */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Input
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startDecorator={<SearchIcon />}
                    sx={{ flex: 1 }}
                  />
                  <Select
                    value={filterStatus}
                    onChange={(_, value) => setFilterStatus(value as string)}
                    placeholder="Status"
                    size="sm"
                  >
                    <Option value="all">All Status</Option>
                    <Option value="open">Open</Option>
                    <Option value="in_progress">In Progress</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="scheduled">Scheduled</Option>
                  </Select>
                  <Select
                    value={filterCategory}
                    onChange={(_, value) => setFilterCategory(value as string)}
                    placeholder="Category"
                    size="sm"
                  >
                    <Option value="all">All Categories</Option>
                    <Option value="plumbing">Plumbing</Option>
                    <Option value="electrical">Electrical</Option>
                    <Option value="hvac">HVAC</Option>
                    <Option value="general">General</Option>
                  </Select>
                  <Select
                    value={filterPriority}
                    onChange={(_, value) => setFilterPriority(value as string)}
                    placeholder="Priority"
                    size="sm"
                  >
                    <Option value="all">All Priorities</Option>
                    <Option value="high">High</Option>
                    <Option value="medium">Medium</Option>
                    <Option value="low">Low</Option>
                  </Select>
                </Stack>

                {/* Requests Table */}
                <Table hoverRow>
                  <thead>
                    <tr>
                      <th>Request</th>
                      <th>Property</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th>Cost</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id}>
                        <td>
                          <Box>
                            <Typography level="body-sm" fontWeight="medium">
                              {request.title}
                            </Typography>
                            <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                              {request.id} • {formatDate(request.createdAt)}
                            </Typography>
                          </Box>
                        </td>
                        <td>
                          <Typography level="body-sm">
                            {request.property}
                          </Typography>
                        </td>
                        <td>
                          <Chip size="sm" color="primary" variant="soft">
                            {request.category}
                          </Chip>
                        </td>
                        <td>
                          <Chip
                            size="sm"
                            color={getPriorityColor(request.priority)}
                            variant="soft"
                            startDecorator={<PriorityIcon />}
                          >
                            {request.priority}
                          </Chip>
                        </td>
                        <td>
                          <Chip
                            size="sm"
                            color={getStatusColor(request.status)}
                            variant="soft"
                            startDecorator={getStatusIcon(request.status)}
                          >
                            {request.status.replace('_', ' ')}
                          </Chip>
                        </td>
                        <td>
                          <Typography level="body-sm">
                            {request.assignedTo || 'Unassigned'}
                          </Typography>
                        </td>
                        <td>
                          <Stack spacing={0.5}>
                            <Typography level="body-sm">
                              ${request.actualCost || request.estimatedCost}
                            </Typography>
                            {request.actualCost > 0 && request.actualCost !== request.estimatedCost && (
                              <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                Est: ${request.estimatedCost}
                              </Typography>
                            )}
                          </Stack>
                        </td>
                        <td>
                          <Stack direction="row" spacing={1}>
                            <IconButton size="sm" variant="outlined">
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton size="sm" variant="outlined">
                              <EditIcon />
                            </IconButton>
                            {request.status === 'open' && (
                              <IconButton size="sm" variant="outlined" color="success">
                                <PlayArrowIcon />
                              </IconButton>
                            )}
                          </Stack>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Stack>
            </TabPanel>

            {/* Active Work Tab */}
            <TabPanel value={1}>
              <Stack spacing={3}>
                <Typography level="h4">Active Maintenance Work</Typography>
                <Grid container spacing={3}>
                  {filteredRequests
                    .filter(req => req.status === 'in_progress')
                    .map((request) => (
                      <Grid xs={12} md={6} key={request.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Stack spacing={2}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                  <Typography level="title-md" fontWeight="bold">
                                    {request.title}
                                  </Typography>
                                  <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                                    {request.property}
                                  </Typography>
                                </Box>
                                <Chip
                                  size="sm"
                                  color={getPriorityColor(request.priority)}
                                  variant="soft"
                                >
                                  {request.priority}
                                </Chip>
                              </Box>

                              <Typography level="body-sm">
                                {request.description}
                              </Typography>

                              <Stack direction="row" spacing={2}>
                                <Box>
                                  <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                    Assigned to
                                  </Typography>
                                  <Typography level="body-sm" fontWeight="medium">
                                    {request.assignedTo}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                    Progress
                                  </Typography>
                                  <Typography level="body-sm" fontWeight="medium">
                                    {Math.round((request.actualDuration / request.estimatedDuration) * 100)}%
                                  </Typography>
                                </Box>
                              </Stack>

                              <LinearProgress
                                determinate
                                value={(request.actualDuration / request.estimatedDuration) * 100}
                                color="primary"
                              />

                              {request.notes.length > 0 && (
                                <Box>
                                  <Typography level="body-xs" sx={{ color: 'text.secondary', mb: 1 }}>
                                    Latest Update:
                                  </Typography>
                                  <Alert color="primary" variant="soft" size="sm">
                                    <Typography level="body-xs">
                                      {request.notes[request.notes.length - 1].text}
                                    </Typography>
                                  </Alert>
                                </Box>
                              )}

                              <Stack direction="row" spacing={1}>
                                <Button size="sm" variant="outlined">
                                  View Details
                                </Button>
                                <Button size="sm" variant="solid" color="success">
                                  Mark Complete
                                </Button>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Stack>
            </TabPanel>

            {/* Scheduling Tab */}
            <TabPanel value={2}>
              <Stack spacing={3}>
                <Typography level="h4">Maintenance Scheduling</Typography>
                
                <Alert color="primary" variant="soft">
                  <Typography level="body-sm">
                    <strong>Smart Scheduling:</strong> AI recommendations for optimal maintenance scheduling based on contractor availability, location, and workload.
                  </Typography>
                </Alert>

                <Grid container spacing={3}>
                  <Grid xs={12} md={8}>
                    <Card>
                      <CardContent>
                        <Typography level="h4" sx={{ mb: 2 }}>Scheduled Requests</Typography>
                        <Stack spacing={2}>
                          {filteredRequests
                            .filter(req => req.status === 'scheduled')
                            .map((request) => (
                              <Card key={request.id} variant="outlined">
                                <CardContent>
                                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Box>
                                      <Typography level="body-sm" fontWeight="bold">
                                        {request.title}
                                      </Typography>
                                      <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                        {request.property} • {request.assignedTo}
                                      </Typography>
                                    </Box>
                                    <Stack alignItems="flex-end" spacing={0.5}>
                                      <Chip size="sm" color="neutral" variant="soft">
                                        {formatDate(request.createdAt)}
                                      </Chip>
                                      <Typography level="body-xs">
                                        Est. ${request.estimatedCost}
                                      </Typography>
                                    </Stack>
                                  </Stack>
                                </CardContent>
                              </Card>
                            ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography level="h4" sx={{ mb: 2 }}>Contractor Availability</Typography>
                        <Stack spacing={2}>
                          {contractors.map((contractor) => (
                            <Box key={contractor.id}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography level="body-sm" fontWeight="medium">
                                  {contractor.name}
                                </Typography>
                                <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                  {Math.floor(Math.random() * 40 + 60)}% available
                                </Typography>
                              </Box>
                              <LinearProgress
                                determinate
                                value={Math.floor(Math.random() * 40 + 60)}
                                color="success"
                                sx={{ mb: 1 }}
                              />
                              <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                {contractor.specialties.join(', ')}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Stack>
            </TabPanel>

            {/* Reports Tab */}
            <TabPanel value={3}>
              <Stack spacing={3}>
                <Typography level="h4">Maintenance Reports & Analytics</Typography>
                
                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography level="h4" sx={{ mb: 2 }}>Request Status Distribution</Typography>
                        <Stack spacing={2}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography level="body-sm">Completed</Typography>
                              <Typography level="body-sm">{maintenanceStats.completed}</Typography>
                            </Box>
                            <LinearProgress
                              determinate
                              value={(maintenanceStats.completed / maintenanceStats.totalRequests) * 100}
                              color="success"
                            />
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography level="body-sm">In Progress</Typography>
                              <Typography level="body-sm">{maintenanceStats.inProgress}</Typography>
                            </Box>
                            <LinearProgress
                              determinate
                              value={(maintenanceStats.inProgress / maintenanceStats.totalRequests) * 100}
                              color="primary"
                            />
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography level="body-sm">Open</Typography>
                              <Typography level="body-sm">{maintenanceStats.openRequests}</Typography>
                            </Box>
                            <LinearProgress
                              determinate
                              value={(maintenanceStats.openRequests / maintenanceStats.totalRequests) * 100}
                              color="warning"
                            />
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography level="h4" sx={{ mb: 2 }}>Performance Metrics</Typography>
                        <Stack spacing={2}>
                          <Alert color="success" variant="soft">
                            <Typography level="body-sm" fontWeight="bold">
                              Response Time: {maintenanceStats.avgResponseTime}h
                            </Typography>
                            <Typography level="body-xs">
                              15% improvement from last month
                            </Typography>
                          </Alert>
                          <Alert color="primary" variant="soft">
                            <Typography level="body-sm" fontWeight="bold">
                              Completion Rate: {Math.round((maintenanceStats.completed / maintenanceStats.totalRequests) * 100)}%
                            </Typography>
                            <Typography level="body-xs">
                              {maintenanceStats.completed} of {maintenanceStats.totalRequests} requests completed
                            </Typography>
                          </Alert>
                          <Alert color="warning" variant="soft">
                            <Typography level="body-sm" fontWeight="bold">
                              Average Cost: ${maintenanceStats.avgCost}
                            </Typography>
                            <Typography level="body-xs">
                              8% increase from last month
                            </Typography>
                          </Alert>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Stack>
            </TabPanel>
          </Tabs>
        </CardContent>
      </Card>
    </Stack>
  )
}
