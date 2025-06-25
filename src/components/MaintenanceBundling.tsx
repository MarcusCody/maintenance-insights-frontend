import { useState, useMemo, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  Button,
  Alert,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Avatar,
  Grid,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Table,
} from '@mui/joy'
import AssetBundleGenerator from './AssetBundleGenerator'
import {
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  Route as RouteIcon,
  Savings as SavingsIcon,
  Lightbulb as LightbulbIcon,
  Send as SendIcon,
} from '@mui/icons-material'

interface MaintenanceRequest {
  id: string
  property: string
  propertyId: string
  issue: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'emergency'
  location: string
  coordinates: { lat: number; lng: number }
  description: string
  createdAt: string
  estimatedDuration: number
  estimatedCost: number
  urgencyScore: number
  tenantImpact: 'low' | 'medium' | 'high'
}

interface BundleGroup {
  id: string
  name: string
  requests: MaintenanceRequest[]
  category: string
  totalCost: number
  totalDuration: number
  savings: number
  savingsPercentage: number
  optimalRoute: string[]
  estimatedCompletion: string
  bundlingReasons: string[]
  riskFactors: string[]
  priority: 'low' | 'medium' | 'high'
}

interface BundlingInsight {
  type: 'cost_optimization' | 'efficiency' | 'tenant_satisfaction'
  title: string
  description: string
  impact: number
  recommendation: string
  potentialSavings?: number
}

// Mock data for maintenance requests
const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'REQ-001',
    property: 'Sunset Apartments #204',
    propertyId: 'PROP-001',
    issue: 'Kitchen faucet leaking',
    category: 'plumbing',
    priority: 'medium',
    location: 'Unit 204, Kitchen',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    description: 'Kitchen faucet has persistent drip',
    createdAt: '2024-01-15T10:30:00Z',
    estimatedDuration: 1.5,
    estimatedCost: 120,
    urgencyScore: 65,
    tenantImpact: 'medium'
  },
  {
    id: 'REQ-002',
    property: 'Sunset Apartments #206',
    propertyId: 'PROP-001',
    issue: 'Bathroom sink clogged',
    category: 'plumbing',
    priority: 'medium',
    location: 'Unit 206, Bathroom',
    coordinates: { lat: 40.7130, lng: -74.0062 },
    description: 'Bathroom sink draining slowly',
    createdAt: '2024-01-15T11:15:00Z',
    estimatedDuration: 1,
    estimatedCost: 85,
    urgencyScore: 55,
    tenantImpact: 'medium'
  },
  {
    id: 'REQ-003',
    property: 'Sunset Apartments #208',
    propertyId: 'PROP-001',
    issue: 'Toilet running continuously',
    category: 'plumbing',
    priority: 'high',
    location: 'Unit 208, Bathroom',
    coordinates: { lat: 40.7132, lng: -74.0064 },
    description: 'Toilet won\'t stop running',
    createdAt: '2024-01-15T09:45:00Z',
    estimatedDuration: 0.5,
    estimatedCost: 65,
    urgencyScore: 75,
    tenantImpact: 'high'
  },
  {
    id: 'REQ-004',
    property: 'Oak Street Complex #12',
    propertyId: 'PROP-002',
    issue: 'Light fixture not working',
    category: 'electrical',
    priority: 'low',
    location: 'Unit 12, Living Room',
    coordinates: { lat: 40.7200, lng: -74.0100 },
    description: 'Ceiling light fixture not turning on',
    createdAt: '2024-01-15T14:20:00Z',
    estimatedDuration: 1,
    estimatedCost: 95,
    urgencyScore: 35,
    tenantImpact: 'low'
  },
  {
    id: 'REQ-005',
    property: 'Oak Street Complex #15',
    propertyId: 'PROP-002',
    issue: 'Outlet not working',
    category: 'electrical',
    priority: 'medium',
    location: 'Unit 15, Kitchen',
    coordinates: { lat: 40.7202, lng: -74.0102 },
    description: 'Kitchen outlet has no power',
    createdAt: '2024-01-15T13:30:00Z',
    estimatedDuration: 0.5,
    estimatedCost: 75,
    urgencyScore: 60,
    tenantImpact: 'medium'
  },
  {
    id: 'REQ-006',
    property: 'Downtown Plaza #5',
    propertyId: 'PROP-003',
    issue: 'AC unit making noise',
    category: 'hvac',
    priority: 'high',
    location: 'Unit 5, Living Room',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    description: 'AC unit making loud grinding noise',
    createdAt: '2024-01-15T08:15:00Z',
    estimatedDuration: 2,
    estimatedCost: 180,
    urgencyScore: 80,
    tenantImpact: 'high'
  }
]

// AI-powered bundling algorithm
const generateBundles = (requests: MaintenanceRequest[]): BundleGroup[] => {
  const bundles: BundleGroup[] = []
  
  // Group by category and proximity
  const categoryGroups = requests.reduce((groups, request) => {
    const key = request.category
    if (!groups[key]) groups[key] = []
    groups[key].push(request)
    return groups
  }, {} as Record<string, MaintenanceRequest[]>)

  Object.entries(categoryGroups).forEach(([category, categoryRequests]) => {
    // Further group by property proximity
    const proximityGroups = categoryRequests.reduce((groups, request) => {
      const existingGroup = groups.find(group => 
        group.some(r => r.propertyId === request.propertyId)
      )
      
      if (existingGroup) {
        existingGroup.push(request)
      } else {
        groups.push([request])
      }
      return groups
    }, [] as MaintenanceRequest[][])

    proximityGroups.forEach((group, index) => {
      if (group.length > 1) {
        const totalCost = group.reduce((sum, req) => sum + req.estimatedCost, 0)
        const totalDuration = group.reduce((sum, req) => sum + req.estimatedDuration, 0)
        
        // Calculate savings
        const travelSavings = (group.length - 1) * 45
        const bulkDiscount = totalCost * 0.08
        const totalSavings = travelSavings + bulkDiscount
        const savingsPercentage = (totalSavings / totalCost) * 100

        const highestPriority = group.reduce((highest, req) => 
          req.priority === 'emergency' ? 'high' : 
          req.priority === 'high' || highest === 'high' ? 'high' :
          req.priority === 'medium' || highest === 'medium' ? 'medium' : 'low'
        , 'low' as 'low' | 'medium' | 'high')

        bundles.push({
          id: `BUNDLE-${category.toUpperCase()}-${index + 1}`,
          name: `${category.charAt(0).toUpperCase() + category.slice(1)} Bundle - ${group[0].property.split(' ')[0]} Area`,
          requests: group.sort((a, b) => b.urgencyScore - a.urgencyScore),
          category,
          totalCost,
          totalDuration,
          savings: totalSavings,
          savingsPercentage,
          optimalRoute: group.map(req => req.property),
          estimatedCompletion: 'Today 3:00 PM',
          bundlingReasons: [
            `All requests are ${category}-related for specialist efficiency`,
            'Multiple requests in same property complex reduce travel time',
            group.length >= 3 ? 'Bulk service discount applies for 3+ requests' : 'Reduced setup and travel costs'
          ],
          riskFactors: group.some(req => req.priority === 'high') ? 
            ['Contains high-priority requests that may need immediate attention'] : [],
          priority: highestPriority
        })
      }
    })
  })

  return bundles.sort((a, b) => b.savings - a.savings)
}

const generateInsights = (bundles: BundleGroup[]): BundlingInsight[] => {
  const insights: BundlingInsight[] = []
  
  const totalPotentialSavings = bundles.reduce((sum, bundle) => sum + bundle.savings, 0)
  if (totalPotentialSavings > 200) {
    insights.push({
      type: 'cost_optimization',
      title: 'Significant Cost Savings Available',
      description: `Bundling opportunities can save $${totalPotentialSavings.toFixed(0)} this week`,
      impact: 9,
      recommendation: 'Prioritize bundled dispatch to maximize cost efficiency',
      potentialSavings: totalPotentialSavings
    })
  }
  
  const plumbingBundle = bundles.find(b => b.category === 'plumbing')
  if (plumbingBundle && plumbingBundle.requests.length >= 3) {
    insights.push({
      type: 'efficiency',
      title: 'Plumbing Specialist Efficiency',
      description: 'Multiple plumbing issues in same area can be handled by single specialist',
      impact: 8,
      recommendation: 'Schedule plumbing bundle for maximum specialist utilization'
    })
  }
  
  return insights.sort((a, b) => b.impact - a.impact)
}

interface MaintenanceBundlingProps {
  onNavigateToDispatch?: () => void
}

export default function MaintenanceBundling({ onNavigateToDispatch }: MaintenanceBundlingProps) {
  const [selectedBundles, setSelectedBundles] = useState<string[]>([])
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
  
  const bundles = useMemo(() => generateBundles(mockMaintenanceRequests), [])
  const insights = useMemo(() => generateInsights(bundles), [bundles])

  // Load bundle history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('bundleHistory') || '[]')
    setBundleHistory(history)
  }, [activeTab]) // Refresh when switching tabs
  
  const toggleBundleSelection = (bundleId: string) => {
    setSelectedBundles(prev => 
      prev.includes(bundleId) 
        ? prev.filter(id => id !== bundleId)
        : [...prev, bundleId]
    )
  }
  
  const selectedBundleData = bundles.filter(bundle => selectedBundles.includes(bundle.id))
  const totalSelectedSavings = selectedBundleData.reduce((sum, bundle) => sum + bundle.savings, 0)
  const totalSelectedCost = selectedBundleData.reduce((sum, bundle) => sum + bundle.totalCost, 0)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'neutral'
      default: return 'neutral'
    }
  }

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
              <Tab>Current Bundle Opportunities</Tab>
              <Tab>Bundle History ({bundleHistory.length})</Tab>
            </TabList>

            {/* Asset Bundle Generator Tab */}
            <TabPanel value={0}>
              <AssetBundleGenerator onBundleCreated={onNavigateToDispatch} />
            </TabPanel>

            {/* Current Bundles Tab */}
            <TabPanel value={1}>
              <Stack spacing={3}>

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card>
          <CardContent>
            <Typography level="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LightbulbIcon color="warning" />
              AI Bundling Insights
            </Typography>
            <Stack spacing={2}>
              {insights.map((insight, index) => (
                <Alert
                  key={index}
                  color={insight.type === 'cost_optimization' ? 'success' : 
                         insight.type === 'efficiency' ? 'primary' : 'warning'}
                  variant="soft"
                >
                  <Box>
                    <Typography level="body-sm" fontWeight="bold">
                      {insight.title} (Impact: {insight.impact}/10)
                    </Typography>
                    <Typography level="body-xs" sx={{ mb: 1 }}>
                      {insight.description}
                    </Typography>
                    <Typography level="body-xs" fontWeight="medium">
                      💡 {insight.recommendation}
                    </Typography>
                    {insight.potentialSavings && (
                      <Chip size="sm" color="success" variant="soft" sx={{ mt: 1 }}>
                        ${insight.potentialSavings.toFixed(0)} potential savings
                      </Chip>
                    )}
                  </Box>
                </Alert>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Bundle Selection Summary */}
      {selectedBundles.length > 0 && (
        <Card sx={{ bgcolor: 'primary.softBg' }}>
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="center">
              <Box>
                <Typography level="title-md" fontWeight="bold">
                  {selectedBundles.length} Bundle{selectedBundles.length > 1 ? 's' : ''} Selected
                </Typography>
                <Typography level="body-sm">
                  {selectedBundleData.reduce((sum, bundle) => sum + bundle.requests.length, 0)} maintenance requests
                </Typography>
              </Box>
              <Box>
                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                  Total Cost
                </Typography>
                <Typography level="title-sm" fontWeight="bold">
                  ${totalSelectedCost.toFixed(0)}
                </Typography>
              </Box>
              <Box>
                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                  Total Savings
                </Typography>
                <Typography level="title-sm" fontWeight="bold" sx={{ color: 'success.main' }}>
                  ${totalSelectedSavings.toFixed(0)}
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <Button 
                  size="sm" 
                  startDecorator={<SendIcon />}
                  disabled={selectedBundles.length === 0}
                >
                  Dispatch Selected ({selectedBundles.length})
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Bundle Cards */}
      <Grid container spacing={3}>
        {bundles.map((bundle) => {
          const isSelected = selectedBundles.includes(bundle.id)
          
          return (
            <Grid xs={12} lg={6} key={bundle.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: isSelected ? '2px solid' : '1px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected ? 'primary.softBg' : 'background.surface'
                }}
                onClick={() => toggleBundleSelection(bundle.id)}
              >
                <CardContent>
                  <Stack spacing={2}>
                    {/* Bundle Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography level="title-md" fontWeight="bold">
                          {bundle.name}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                          <Chip size="sm" color="primary" variant="soft">
                            {bundle.category}
                          </Chip>
                          <Chip size="sm" color={getPriorityColor(bundle.priority)} variant="soft">
                            {bundle.priority} priority
                          </Chip>
                          <Chip size="sm" color="neutral" variant="outlined">
                            {bundle.requests.length} requests
                          </Chip>
                        </Stack>
                      </Box>
                      <Badge 
                        badgeContent={isSelected ? '✓' : ''}
                        color="success"
                      >
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <GroupIcon />
                        </Avatar>
                      </Badge>
                    </Box>

                    {/* Savings Highlight */}
                    <Box sx={{ 
                      bgcolor: 'success.softBg', 
                      p: 2, 
                      borderRadius: 'sm',
                      border: '1px solid',
                      borderColor: 'success.outlinedBorder'
                    }}>
                      <Stack direction="row" spacing={3} alignItems="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SavingsIcon sx={{ color: 'success.main' }} />
                          <Box>
                            <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                              Potential Savings
                            </Typography>
                            <Typography level="title-sm" fontWeight="bold" sx={{ color: 'success.main' }}>
                              ${bundle.savings.toFixed(0)} ({bundle.savingsPercentage.toFixed(1)}%)
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                            Total Cost
                          </Typography>
                          <Typography level="title-sm" fontWeight="bold">
                            ${bundle.totalCost.toFixed(0)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                            Duration
                          </Typography>
                          <Typography level="title-sm" fontWeight="bold">
                            {bundle.totalDuration.toFixed(1)}h
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    {/* Request List */}
                    <Box>
                      <Typography level="body-sm" fontWeight="medium" sx={{ mb: 1 }}>
                        Bundled Requests:
                      </Typography>
                      <List size="sm">
                        {bundle.requests.map((request, idx) => (
                          <ListItem key={request.id}>
                            <ListItemDecorator>
                              <Chip 
                                size="sm" 
                                color={getPriorityColor(request.priority)}
                                variant="soft"
                              >
                                {idx + 1}
                              </Chip>
                            </ListItemDecorator>
                            <ListItemContent>
                              <Typography level="body-xs" fontWeight="medium">
                                {request.issue}
                              </Typography>
                              <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                {request.property} • ${request.estimatedCost} • {request.estimatedDuration}h
                              </Typography>
                            </ListItemContent>
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    {/* Bundling Reasons */}
                    <Box>
                      <Typography level="body-sm" fontWeight="medium" sx={{ mb: 1 }}>
                        Why bundle these requests:
                      </Typography>
                      <List size="sm">
                        {bundle.bundlingReasons.map((reason, idx) => (
                          <ListItem key={idx}>
                            <ListItemDecorator>
                              <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                            </ListItemDecorator>
                            <ListItemContent>
                              <Typography level="body-xs">{reason}</Typography>
                            </ListItemContent>
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    {/* Risk Factors */}
                    {bundle.riskFactors.length > 0 && (
                      <Alert color="warning" variant="soft" size="sm">
                        <Box>
                          <Typography level="body-xs" fontWeight="bold">
                            ⚠️ Considerations:
                          </Typography>
                          {bundle.riskFactors.map((risk, idx) => (
                            <Typography key={idx} level="body-xs" sx={{ display: 'block', mt: 0.5 }}>
                              • {risk}
                            </Typography>
                          ))}
                        </Box>
                      </Alert>
                    )}

                    {/* Bundle Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography level="body-xs">
                            ETA: {bundle.estimatedCompletion}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <RouteIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography level="body-xs">
                            {bundle.optimalRoute.length} stops
                          </Typography>
                        </Box>
                      </Stack>
                      
                      <Stack direction="row" spacing={1}>
                        <Button size="sm" variant="outlined">
                          Customize
                        </Button>
                        <Button 
                          size="sm" 
                          variant={isSelected ? 'solid' : 'outlined'}
                          color={isSelected ? 'success' : 'primary'}
                        >
                          {isSelected ? 'Selected' : 'Select Bundle'}
                        </Button>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Summary Statistics */}
      <Card>
        <CardContent>
          <Typography level="h4" sx={{ mb: 2 }}>
            Bundling Summary
          </Typography>
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography level="h2" sx={{ color: 'primary.main' }}>
                  {bundles.length}
                </Typography>
                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                  Bundle Opportunities
                </Typography>
              </Box>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography level="h2" sx={{ color: 'success.main' }}>
                  ${bundles.reduce((sum, bundle) => sum + bundle.savings, 0).toFixed(0)}
                </Typography>
                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                  Total Potential Savings
                </Typography>
              </Box>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography level="h2" sx={{ color: 'warning.main' }}>
                  {bundles.reduce((sum, bundle) => sum + bundle.requests.length, 0)}
                </Typography>
                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                  Requests Available
                </Typography>
              </Box>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography level="h2" sx={{ color: 'neutral.main' }}>
                  {bundles.length > 0 ? Math.round(bundles.reduce((sum, bundle) => sum + bundle.savingsPercentage, 0) / bundles.length) : 0}%
                </Typography>
                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                  Avg. Savings Rate
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
              </Stack>
            </TabPanel>

            {/* Bundle History Tab */}
            <TabPanel value={2}>
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