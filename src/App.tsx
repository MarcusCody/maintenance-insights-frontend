import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Sheet,
  Stack,
  Chip,
  Button,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemDecorator,
  ListItemContent,
  Divider,
  Alert,
  LinearProgress,
  Badge,
} from '@mui/joy'
import MaintenanceRequestModal from './components/MaintenanceRequestModal'
import DispatchRecommendations from './components/DispatchRecommendations'
import EscalationDecisions from './components/EscalationDecisions'
import MaintenanceBundling from './components/MaintenanceBundling'
import MaintenanceAnalytics from './components/MaintenanceAnalytics'
import PropertiesManagement from './components/PropertiesManagement'
import MaintenanceManagement from './components/MaintenanceManagement'
import {
  Dashboard as DashboardIcon,
  Build as BuildIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Home as HomeIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Analytics as AnalyticsIcon,
  AutoFixHigh as AutoFixHighIcon,
  Add as AddIcon,
  Send as SendIcon,
  Group as GroupIcon,
} from '@mui/icons-material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// Mock data for the dashboard
const maintenanceData = [
  { month: 'Jan', requests: 45, completed: 42, cost: 12500 },
  { month: 'Feb', requests: 52, completed: 48, cost: 15200 },
  { month: 'Mar', requests: 38, completed: 36, cost: 9800 },
  { month: 'Apr', requests: 61, completed: 58, cost: 18400 },
  { month: 'May', requests: 49, completed: 47, cost: 14100 },
  { month: 'Jun', requests: 55, completed: 53, cost: 16700 },
]

const propertyTypes = [
  { name: 'Residential', value: 65, color: '#8884d8' },
  { name: 'Commercial', value: 25, color: '#82ca9d' },
  { name: 'Industrial', value: 10, color: '#ffc658' },
]

const urgentAlerts = [
  { id: 1, property: 'Sunset Apartments #204', issue: 'Water leak detected', priority: 'high', time: '2 hours ago' },
  { id: 2, property: 'Oak Street Complex #15', issue: 'HVAC system failure', priority: 'high', time: '4 hours ago' },
  { id: 3, property: 'Downtown Plaza #8', issue: 'Elevator maintenance due', priority: 'medium', time: '1 day ago' },
]

const aiInsights = [
  { type: 'prediction', message: 'HVAC systems in Building A are likely to need maintenance within 2 weeks based on usage patterns' },
  { type: 'recommendation', message: 'Bundling plumbing repairs in Sector 3 could save 25% on service costs' },
  { type: 'optimization', message: 'Scheduling preventive maintenance on Tuesdays shows 15% better completion rates' },
]

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.surface' }}>
      {/* Sidebar */}
      <Sheet
        sx={{
          width: 240,
          p: 2,
          bgcolor: 'background.level1',
          borderRight: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography level="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoFixHighIcon color="primary" />
            MaintenanceAI
          </Typography>
          <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
            Real-Time Insights
          </Typography>
        </Box>

        <Stack spacing={1}>
          <Button
            variant={activeTab === 'dashboard' ? 'solid' : 'plain'}
            startDecorator={<DashboardIcon />}
            onClick={() => setActiveTab('dashboard')}
            sx={{ justifyContent: 'flex-start' }}
          >
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'properties' ? 'solid' : 'plain'}
            startDecorator={<HomeIcon />}
            onClick={() => setActiveTab('properties')}
            sx={{ justifyContent: 'flex-start' }}
          >
            Properties
          </Button>
          <Button
            variant={activeTab === 'maintenance' ? 'solid' : 'plain'}
            startDecorator={<BuildIcon />}
            onClick={() => setActiveTab('maintenance')}
            sx={{ justifyContent: 'flex-start' }}
          >
            Maintenance
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'solid' : 'plain'}
            startDecorator={<AnalyticsIcon />}
            onClick={() => setActiveTab('analytics')}
            sx={{ justifyContent: 'flex-start' }}
          >
            Analytics
          </Button>
          <Button
            variant={activeTab === 'dispatch' ? 'solid' : 'plain'}
            startDecorator={<SendIcon />}
            onClick={() => setActiveTab('dispatch')}
            sx={{ justifyContent: 'flex-start' }}
          >
            Dispatch
          </Button>
          <Button
            variant={activeTab === 'bundling' ? 'solid' : 'plain'}
            startDecorator={<GroupIcon />}
            onClick={() => setActiveTab('bundling')}
            sx={{ justifyContent: 'flex-start' }}
          >
            Bundling
          </Button>
        </Stack>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Stack spacing={1}>
            <Button variant="plain" startDecorator={<SettingsIcon />} sx={{ justifyContent: 'flex-start' }}>
              Settings
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
              <Avatar size="sm" />
              <Box>
                <Typography level="body-sm">John Smith</Typography>
                <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                  Property Manager
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Sheet>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Sheet sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography level="h3">Real-Time Maintenance Insights</Typography>
            <Stack direction="row" spacing={1}>
              <IconButton variant="outlined">
                <Badge badgeContent={3} color="danger">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton variant="outlined">
                <PersonIcon />
              </IconButton>
            </Stack>
          </Box>
        </Sheet>

        {/* Dashboard Content */}
        <Container maxWidth={false} sx={{ flex: 1, py: 3 }}>
          {activeTab === 'dispatch' ? (
            <Stack spacing={3}>
              <DispatchRecommendations />
              <EscalationDecisions />
            </Stack>
          ) : activeTab === 'bundling' ? (
            <MaintenanceBundling />
          ) : activeTab === 'analytics' ? (
            <MaintenanceAnalytics />
          ) : activeTab === 'properties' ? (
            <PropertiesManagement />
          ) : activeTab === 'maintenance' ? (
            <MaintenanceManagement />
          ) : (
            <>
          {/* Key Metrics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                        Active Properties
                      </Typography>
                      <Typography level="h2">247</Typography>
                    </Box>
                    <HomeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
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
                        Open Requests
                      </Typography>
                      <Typography level="h2">23</Typography>
                      <Chip size="sm" color="warning" variant="soft">
                        +5 today
                      </Chip>
                    </Box>
                    <BuildIcon sx={{ fontSize: 40, color: 'warning.main' }} />
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
                        Completion Rate
                      </Typography>
                      <Typography level="h2">94%</Typography>
                      <LinearProgress determinate value={94} sx={{ mt: 1 }} />
                    </Box>
                    <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />
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
                        Monthly Savings
                      </Typography>
                      <Typography level="h2">$12.4K</Typography>
                      <Chip size="sm" color="success" variant="soft">
                        ↑ 18%
                      </Chip>
                    </Box>
                    <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* AI Insights */}
            <Grid xs={12} md={8}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography level="h4" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoFixHighIcon color="primary" />
                    AI-Powered Insights
                  </Typography>
                  <Stack spacing={2}>
                    {aiInsights.map((insight, index) => (
                      <Alert
                        key={index}
                        color={insight.type === 'prediction' ? 'warning' : insight.type === 'recommendation' ? 'primary' : 'success'}
                        variant="soft"
                      >
                        <Typography level="body-sm">{insight.message}</Typography>
                      </Alert>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Maintenance Trends Chart */}
              <Card>
                <CardContent>
                  <Typography level="h4" sx={{ mb: 2 }}>Maintenance Trends</Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={maintenanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="requests" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="completed" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Sidebar Content */}
            <Grid xs={12} md={4}>
              {/* Urgent Alerts */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography level="h4" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="warning" />
                    Urgent Alerts
                  </Typography>
                  <List>
                    {urgentAlerts.map((alert, index) => (
                      <div key={alert.id}>
                        <ListItem>
                          <ListItemDecorator>
                            <Chip
                              size="sm"
                              color={alert.priority === 'high' ? 'danger' : 'warning'}
                              variant="soft"
                            >
                              {alert.priority}
                            </Chip>
                          </ListItemDecorator>
                          <ListItemContent>
                            <Typography level="body-sm" fontWeight="md">
                              {alert.property}
                            </Typography>
                            <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                              {alert.issue}
                            </Typography>
                            <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                              {alert.time}
                            </Typography>
                          </ListItemContent>
                        </ListItem>
                        {index < urgentAlerts.length - 1 && <Divider />}
                      </div>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Property Distribution */}
              <Card>
                <CardContent>
                  <Typography level="h4" sx={{ mb: 2 }}>Property Distribution</Typography>
                  <Box sx={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={propertyTypes}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {propertyTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
            </>
          )}
        </Container>
        
        {/* Floating Action Button */}
        <IconButton
          size="lg"
          onClick={() => setModalOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            borderRadius: '50%',
            width: 56,
            height: 56,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            boxShadow: 'lg',
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      
      {/* Maintenance Request Modal */}
      <MaintenanceRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  )
}

export default App
