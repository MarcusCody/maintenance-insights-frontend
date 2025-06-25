import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Sheet,
  Stack,
  IconButton,
  Badge,
  Button,
  Avatar,
} from '@mui/joy'
import {
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  AutoFixHigh as AutoFixHighIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Build as BuildIcon,
  Analytics as AnalyticsIcon,
  Send as SendIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import MaintenanceRequestModal from './components/MaintenanceRequestModal'
import MaintenanceBundling from './components/MaintenanceBundling'

function App() {
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [activeTab, setActiveTab] = useState('bundling')

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      {/* Sidebar */}
      <Sheet 
        sx={{ 
          width: 280,
          p: 3, 
          borderRight: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Typography level="h3" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            color: '#1A2B3C',
            fontWeight: 600,
            fontSize: '1.75rem'
          }}>
            <AutoFixHighIcon sx={{ fontSize: 32, color: '#2563EB' }} />
            MaintenanceAI
          </Typography>
        </Box>

        {/* Navigation */}
        <Stack spacing={1} sx={{ flex: 1 }}>
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

        {/* Bottom Section */}
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

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Sheet sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography level="h3" sx={{ color: '#1A2B3C', fontWeight: 600 }}>
                Real-Time Maintenance Insights
              </Typography>
              <Typography level="body-sm" sx={{ color: '#64748B', mt: 0.5 }}>
                Intelligent Work Order Management
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton variant="outlined">
                <Badge badgeContent={3} color="danger">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton 
                variant="outlined"
                sx={{ 
                  borderColor: '#E2E8F0',
                  color: '#64748B',
                  '&:hover': {
                    borderColor: '#CBD5E1',
                    bgcolor: '#F1F5F9'
                  }
                }}
              >
                <PersonIcon />
              </IconButton>
            </Stack>
          </Box>
        </Sheet>

        {/* Main Content */}
        <Container maxWidth={false} sx={{ flex: 1, py: 4 }}>
          <MaintenanceBundling />
        </Container>
      </Box>
      
      {/* Floating Action Button */}
      <IconButton
        size="lg"
        onClick={() => setShowMaintenanceModal(true)}
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
      
      {/* Maintenance Request Modal */}
      <MaintenanceRequestModal
        open={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
      />
    </Box>
  )
}

export default App
