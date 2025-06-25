import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  Alert,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Table,
} from '@mui/joy'
import AssetBundleGenerator from './AssetBundleGenerator'
import {
  Group as GroupIcon,
} from '@mui/icons-material'





interface MaintenanceBundlingProps {
  onNavigateToDispatch?: () => void
}

export default function MaintenanceBundling({ onNavigateToDispatch }: MaintenanceBundlingProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [bundleHistory, setBundleHistory] = useState<Array<{
    id: string
    name: string
    workOrders?: Array<{ id: string }>
    serviceArea?: string
    totalCost?: number
    savings?: number
    savingsPercentage?: number
    acceptedAt?: string
    status?: string
  }>>([])

  // Load bundle history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('bundleHistory') || '[]')
    setBundleHistory(history)
  }, [activeTab]) // Refresh when switching tabs

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography level="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <GroupIcon color="primary" />
          AI-Powered Maintenance Bundling
        </Typography>
        <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
          Optimize maintenance operations by intelligently grouping related requests
        </Typography>
      </Box>

      {/* Tabs for Current Bundles and History */}
      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as number)}>
            <TabList>
              <Tab>Asset Bundle Generator</Tab>
              <Tab>Bundle History ({bundleHistory.length})</Tab>
            </TabList>

            {/* Asset Bundle Generator Tab */}
            <TabPanel value={0}>
              <AssetBundleGenerator onBundleCreated={onNavigateToDispatch} />
            </TabPanel>

            {/* Bundle History Tab */}
            <TabPanel value={1}>
              <Stack spacing={3}>
                {bundleHistory.length === 0 ? (
                  <Alert color="neutral" variant="soft">
                    <Typography level="body-sm">
                      No bundle history yet. Accept bundles from the Work Order Bundle Generator to see them here.
                    </Typography>
                  </Alert>
                ) : (
                  <>
                    <Typography level="h4">Bundle History</Typography>
                    <Table hoverRow>
                      <thead>
                        <tr>
                          <th>Bundle Name</th>
                          <th>Work Orders</th>
                          <th>Service Area</th>
                          <th>Total Cost</th>
                          <th>Savings</th>
                          <th>Accepted Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bundleHistory.map((bundle, index) => (
                          <tr key={bundle.id || index}>
                            <td>
                              <Typography level="body-sm" fontWeight="medium">
                                {bundle.name}
                              </Typography>
                            </td>
                            <td>
                              <Typography level="body-sm">
                                {bundle.workOrders?.length || 0} work orders
                              </Typography>
                            </td>
                            <td>
                              <Typography level="body-sm">
                                {bundle.serviceArea || 'N/A'}
                              </Typography>
                            </td>
                            <td>
                              <Typography level="body-sm">
                                ${bundle.totalCost?.toFixed(0) || 'N/A'}
                              </Typography>
                            </td>
                            <td>
                              <Chip size="sm" color="success" variant="soft">
                                ${bundle.savings?.toFixed(0) || '0'} ({bundle.savingsPercentage?.toFixed(1) || '0'}%)
                              </Chip>
                            </td>
                            <td>
                              <Typography level="body-sm">
                                {bundle.acceptedAt ? new Date(bundle.acceptedAt).toLocaleDateString() : 'N/A'}
                              </Typography>
                            </td>
                            <td>
                              <Chip 
                                size="sm" 
                                color={bundle.status === 'accepted' ? 'success' : 'neutral'} 
                                variant="soft"
                              >
                                {bundle.status || 'pending'}
                              </Chip>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                )}
              </Stack>
            </TabPanel>
          </Tabs>
        </CardContent>
      </Card>
    </Stack>
  )
} 