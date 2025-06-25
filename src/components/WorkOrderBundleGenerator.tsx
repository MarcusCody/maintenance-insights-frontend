import { useState } from 'react'
import {
  Stack,
  Box,
  Typography,
  Input,
  Button,
  Chip,
  Alert,
  Card,
  CardContent,
  IconButton,
  Grid,
} from '@mui/joy'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  AutoFixHigh as AutoFixHighIcon,
  LocationOn as LocationIcon,
  Build as BuildIcon,
} from '@mui/icons-material'

// Mock work order data for demonstration - expanded dataset
const mockWorkOrders = {
  'WO-001': {
    id: 'WO-001',
    title: 'Kitchen faucet repair',
    property: 'Sunset Apartments #204',
    serviceArea: 'North District',
    serviceType: 'plumbing',
    priority: 'medium',
    estimatedCost: 120,
    estimatedDuration: 2,
    address: '123 Sunset Blvd, Los Angeles, CA',
    coordinates: { lat: 34.0928, lng: -118.3287 }
  },
  'WO-002': {
    id: 'WO-002',
    title: 'Bathroom sink clog',
    property: 'Sunset Apartments #206',
    serviceArea: 'North District',
    serviceType: 'plumbing',
    priority: 'low',
    estimatedCost: 85,
    estimatedDuration: 1,
    address: '123 Sunset Blvd, Los Angeles, CA',
    coordinates: { lat: 34.0928, lng: -118.3287 }
  },
  'WO-003': {
    id: 'WO-003',
    title: 'Toilet running issue',
    property: 'Sunset Apartments #208',
    serviceArea: 'North District',
    serviceType: 'plumbing',
    priority: 'high',
    estimatedCost: 65,
    estimatedDuration: 0.5,
    address: '123 Sunset Blvd, Los Angeles, CA',
    coordinates: { lat: 34.0928, lng: -118.3287 }
  },
  'WO-004': {
    id: 'WO-004',
    title: 'Light fixture replacement',
    property: 'Oak Street Complex #12',
    serviceArea: 'North District',
    serviceType: 'electrical',
    priority: 'low',
    estimatedCost: 95,
    estimatedDuration: 1,
    address: '456 Oak Street, Beverly Hills, CA',
    coordinates: { lat: 34.0736, lng: -118.4004 }
  },
  'WO-005': {
    id: 'WO-005',
    title: 'HVAC maintenance',
    property: 'Downtown Plaza #5',
    serviceArea: 'Central District',
    serviceType: 'hvac',
    priority: 'medium',
    estimatedCost: 180,
    estimatedDuration: 3,
    address: '789 Downtown Ave, Los Angeles, CA',
    coordinates: { lat: 34.0522, lng: -118.2437 }
  },
  'WO-006': {
    id: 'WO-006',
    title: 'Water heater repair',
    property: 'Garden View #15',
    serviceArea: 'North District',
    serviceType: 'plumbing',
    priority: 'high',
    estimatedCost: 200,
    estimatedDuration: 3,
    address: '789 Garden View St, Beverly Hills, CA',
    coordinates: { lat: 34.0740, lng: -118.4010 }
  },
  'WO-007': {
    id: 'WO-007',
    title: 'Outlet installation',
    property: 'Oak Street Complex #15',
    serviceArea: 'North District',
    serviceType: 'electrical',
    priority: 'medium',
    estimatedCost: 110,
    estimatedDuration: 1.5,
    address: '456 Oak Street, Beverly Hills, CA',
    coordinates: { lat: 34.0736, lng: -118.4004 }
  },
  'WO-008': {
    id: 'WO-008',
    title: 'Circuit breaker replacement',
    property: 'Metro Heights #8',
    serviceArea: 'North District',
    serviceType: 'electrical',
    priority: 'high',
    estimatedCost: 150,
    estimatedDuration: 2,
    address: '321 Metro Ave, Beverly Hills, CA',
    coordinates: { lat: 34.0742, lng: -118.4008 }
  },
  'WO-009': {
    id: 'WO-009',
    title: 'Pipe leak repair',
    property: 'Metro Heights #12',
    serviceArea: 'North District',
    serviceType: 'plumbing',
    priority: 'high',
    estimatedCost: 175,
    estimatedDuration: 2.5,
    address: '321 Metro Ave, Beverly Hills, CA',
    coordinates: { lat: 34.0742, lng: -118.4008 }
  },
  'WO-010': {
    id: 'WO-010',
    title: 'AC filter replacement',
    property: 'Downtown Plaza #8',
    serviceArea: 'Central District',
    serviceType: 'hvac',
    priority: 'low',
    estimatedCost: 75,
    estimatedDuration: 0.5,
    address: '789 Downtown Ave, Los Angeles, CA',
    coordinates: { lat: 34.0522, lng: -118.2437 }
  },
  'WO-011': {
    id: 'WO-011',
    title: 'Heating system repair',
    property: 'Central Plaza #3',
    serviceArea: 'Central District',
    serviceType: 'hvac',
    priority: 'medium',
    estimatedCost: 220,
    estimatedDuration: 4,
    address: '654 Central Ave, Los Angeles, CA',
    coordinates: { lat: 34.0525, lng: -118.2440 }
  },
  'WO-012': {
    id: 'WO-012',
    title: 'Drain cleaning',
    property: 'Westside Towers #22',
    serviceArea: 'West District',
    serviceType: 'plumbing',
    priority: 'medium',
    estimatedCost: 90,
    estimatedDuration: 1,
    address: '987 Westside Blvd, Santa Monica, CA',
    coordinates: { lat: 34.0195, lng: -118.4912 }
  }
}

interface WorkOrder {
  id: string
  title: string
  property: string
  serviceArea: string
  serviceType: string
  priority: string
  estimatedCost: number
  estimatedDuration: number
  address: string
  coordinates: { lat: number; lng: number }
}

interface BundleRecommendation {
  id: string
  name: string
  workOrders: WorkOrder[]
  bundlingCriteria: string
  totalCost: number
  totalDuration: number
  savings: number
  savingsPercentage: number
  serviceArea: string
  serviceTypes: string[]
}

// Function to find relevant work orders based on service area and service type compatibility
const findRelevantWorkOrders = (primaryWorkOrder: WorkOrder): WorkOrder[] => {
  const allWorkOrders = Object.values(mockWorkOrders)
  const relevantWorkOrders: WorkOrder[] = [primaryWorkOrder]
  
  // Find work orders in the same service area
  const sameAreaWorkOrders = allWorkOrders.filter(wo => 
    wo.id !== primaryWorkOrder.id && 
    wo.serviceArea === primaryWorkOrder.serviceArea
  )
  
  // Priority 1: Same service type in same area (highest compatibility)
  const sameServiceType = sameAreaWorkOrders.filter(wo => 
    wo.serviceType === primaryWorkOrder.serviceType
  )
  
  // Priority 2: Compatible service types in same area
  const compatibleServices = getCompatibleServices(primaryWorkOrder.serviceType)
  const compatibleWorkOrders = sameAreaWorkOrders.filter(wo => 
    compatibleServices.includes(wo.serviceType)
  )
  
  // Add same service type work orders first (up to 3 total for efficiency)
  sameServiceType.forEach(wo => {
    if (relevantWorkOrders.length < 4) {
      relevantWorkOrders.push(wo)
    }
  })
  
  // Add compatible service type work orders if we have space and it makes sense
  compatibleWorkOrders.forEach(wo => {
    if (relevantWorkOrders.length < 3 && !relevantWorkOrders.includes(wo)) {
      relevantWorkOrders.push(wo)
    }
  })
  
  // Sort by priority and proximity
  return relevantWorkOrders.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder]
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder]
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }
    
    // If same priority, sort by service type compatibility
    if (a.serviceType === primaryWorkOrder.serviceType && b.serviceType !== primaryWorkOrder.serviceType) {
      return -1
    }
    if (b.serviceType === primaryWorkOrder.serviceType && a.serviceType !== primaryWorkOrder.serviceType) {
      return 1
    }
    
    return 0
  })
}

// Define service type compatibility for bundling
const getCompatibleServices = (serviceType: string): string[] => {
  const compatibilityMatrix: Record<string, string[]> = {
    'plumbing': ['plumbing'], // Plumbing works best with other plumbing
    'electrical': ['electrical'], // Electrical works best with other electrical  
    'hvac': ['hvac', 'electrical'], // HVAC can work with electrical (power connections)
    'general': ['general', 'plumbing', 'electrical', 'hvac'] // General maintenance can bundle with anything
  }
  
  return compatibilityMatrix[serviceType] || [serviceType]
}

const generateBundleRecommendations = (workOrders: WorkOrder[]): BundleRecommendation[] => {
  const bundles: BundleRecommendation[] = []
  
  // Group by service area first
  const areaGroups = workOrders.reduce((groups, wo) => {
    if (!groups[wo.serviceArea]) groups[wo.serviceArea] = []
    groups[wo.serviceArea].push(wo)
    return groups
  }, {} as Record<string, WorkOrder[]>)

  Object.entries(areaGroups).forEach(([area, areaWorkOrders]) => {
    // Within each area, group by service type
    const serviceGroups = areaWorkOrders.reduce((groups, wo) => {
      if (!groups[wo.serviceType]) groups[wo.serviceType] = []
      groups[wo.serviceType].push(wo)
      return groups
    }, {} as Record<string, WorkOrder[]>)

    // Create bundles for service types with multiple work orders
    Object.entries(serviceGroups).forEach(([serviceType, serviceWorkOrders]) => {
      if (serviceWorkOrders.length > 1) {
        const totalCost = serviceWorkOrders.reduce((sum, wo) => sum + wo.estimatedCost, 0)
        const totalDuration = serviceWorkOrders.reduce((sum, wo) => sum + wo.estimatedDuration, 0)
        const travelSavings = (serviceWorkOrders.length - 1) * 50 // $50 per trip saved
        const bulkDiscount = totalCost * 0.1 // 10% bulk discount
        const savings = travelSavings + bulkDiscount
        const savingsPercentage = (savings / totalCost) * 100

        bundles.push({
          id: `BUNDLE-${area.replace(' ', '')}-${serviceType.toUpperCase()}`,
          name: `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Bundle - ${area}`,
          workOrders: serviceWorkOrders.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
          }),
          bundlingCriteria: `Same service area (${area}) and service type (${serviceType})`,
          totalCost,
          totalDuration,
          savings,
          savingsPercentage,
          serviceArea: area,
          serviceTypes: [serviceType]
        })
      }
    })

    // Also create mixed-service bundles for same area if beneficial
    if (areaWorkOrders.length > 2) {
      const uniqueServices = [...new Set(areaWorkOrders.map(wo => wo.serviceType))]
      if (uniqueServices.length > 1) {
        const totalCost = areaWorkOrders.reduce((sum, wo) => sum + wo.estimatedCost, 0)
        const totalDuration = areaWorkOrders.reduce((sum, wo) => sum + wo.estimatedDuration, 0)
        const travelSavings = (areaWorkOrders.length - 1) * 40 // Slightly less savings for mixed services
        const savings = travelSavings
        const savingsPercentage = (savings / totalCost) * 100

        if (savingsPercentage > 5) { // Only suggest if savings are meaningful
          bundles.push({
            id: `BUNDLE-${area.replace(' ', '')}-MIXED`,
            name: `Mixed Services Bundle - ${area}`,
            workOrders: areaWorkOrders.sort((a, b) => {
              const priorityOrder = { high: 3, medium: 2, low: 1 }
              return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
            }),
            bundlingCriteria: `Same service area (${area}) with multiple service types`,
            totalCost,
            totalDuration,
            savings,
            savingsPercentage,
            serviceArea: area,
            serviceTypes: uniqueServices
          })
        }
      }
    }
  })

  return bundles.sort((a, b) => b.savings - a.savings)
}

export default function WorkOrderBundleGenerator() {
  const [workOrderIds, setWorkOrderIds] = useState<string[]>([''])
  const [validWorkOrders, setValidWorkOrders] = useState<WorkOrder[]>([])
  const [bundleRecommendations, setBundleRecommendations] = useState<BundleRecommendation[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)

  const addWorkOrderField = () => {
    setWorkOrderIds([...workOrderIds, ''])
  }

  const removeWorkOrderField = (index: number) => {
    const newIds = workOrderIds.filter((_, i) => i !== index)
    setWorkOrderIds(newIds)
  }

  const updateWorkOrderId = (index: number, value: string) => {
    const newIds = [...workOrderIds]
    newIds[index] = value.toUpperCase()
    setWorkOrderIds(newIds)
  }

  const generateBundles = () => {
    // Validate work order IDs and get work order data
    const validIds = workOrderIds.filter(id => id.trim() !== '' && mockWorkOrders[id as keyof typeof mockWorkOrders])
    const inputWorkOrders = validIds.map(id => mockWorkOrders[id as keyof typeof mockWorkOrders])
    
    if (inputWorkOrders.length === 0) {
      setValidWorkOrders([])
      setBundleRecommendations([])
      setShowRecommendations(true)
      return
    }

    let allRelevantWorkOrders: WorkOrder[] = []
    
    if (inputWorkOrders.length === 1) {
      // Single WO ID: Find relevant work orders automatically
      const primaryWorkOrder = inputWorkOrders[0]
      allRelevantWorkOrders = findRelevantWorkOrders(primaryWorkOrder)
      
      setValidWorkOrders(allRelevantWorkOrders)
      
      if (allRelevantWorkOrders.length > 1) {
        const recommendations = generateBundleRecommendations(allRelevantWorkOrders)
        setBundleRecommendations(recommendations)
      } else {
        setBundleRecommendations([])
      }
    } else {
      // Multiple WO IDs: Use provided work orders and find additional relevant ones
      const uniqueWorkOrders = new Set<WorkOrder>()
      
      // Add all input work orders
      inputWorkOrders.forEach(wo => uniqueWorkOrders.add(wo))
      
      // For each input work order, find relevant ones in the same area
      inputWorkOrders.forEach(wo => {
        const relevant = findRelevantWorkOrders(wo)
        relevant.forEach(rwo => {
          if (rwo.id !== wo.id) {
            uniqueWorkOrders.add(rwo)
          }
        })
      })
      
      allRelevantWorkOrders = Array.from(uniqueWorkOrders)
      setValidWorkOrders(allRelevantWorkOrders)
      
      const recommendations = generateBundleRecommendations(allRelevantWorkOrders)
      setBundleRecommendations(recommendations)
    }
    
    setShowRecommendations(true)
  }

  const acceptBundle = (bundle: BundleRecommendation) => {
    // Store bundle in localStorage for bundle history
    const existingBundles = JSON.parse(localStorage.getItem('bundleHistory') || '[]')
    const newBundle = {
      ...bundle,
      acceptedAt: new Date().toISOString(),
      status: 'accepted'
    }
    existingBundles.push(newBundle)
    localStorage.setItem('bundleHistory', JSON.stringify(existingBundles))
    
    // Show success message or redirect to bundling page
    alert(`Bundle "${bundle.name}" has been accepted and added to your bundle history!`)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'neutral'
    }
  }

  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case 'plumbing': return 'primary'
      case 'electrical': return 'warning'
      case 'hvac': return 'success'
      default: return 'neutral'
    }
  }

  return (
    <Stack spacing={3}>
      {/* Work Order Input Section */}
      <Box>
        <Typography level="body-sm" sx={{ mb: 2, fontWeight: 'medium' }}>
          Enter Work Order IDs - AI will automatically find relevant work orders in the same service area
        </Typography>
        <Alert color="primary" variant="soft" size="sm" sx={{ mb: 2 }}>
          <Typography level="body-xs">
            <strong>Available Work Orders:</strong> WO-001 to WO-012 across North District, Central District, and West District
          </Typography>
        </Alert>
        <Stack spacing={2}>
          {workOrderIds.map((id, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="center">
              <Input
                placeholder="Enter WO ID (e.g., WO-001)"
                value={id}
                onChange={(e) => updateWorkOrderId(index, e.target.value)}
                sx={{ flex: 1 }}
                color={id && mockWorkOrders[id as keyof typeof mockWorkOrders] ? 'success' : 'neutral'}
              />
              {workOrderIds.length > 1 && (
                <IconButton
                  size="sm"
                  variant="outlined"
                  color="danger"
                  onClick={() => removeWorkOrderField(index)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>
          ))}
          <Stack direction="row" spacing={1}>
            <Button
              size="sm"
              variant="outlined"
              startDecorator={<AddIcon />}
              onClick={addWorkOrderField}
            >
              Add Work Order
            </Button>
            <Button
              size="sm"
              variant="solid"
              startDecorator={<AutoFixHighIcon />}
              onClick={generateBundles}
              disabled={workOrderIds.filter(id => id.trim() !== '').length < 1}
            >
              Generate Bundle Recommendations
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Valid Work Orders Display */}
      {validWorkOrders.length > 0 && (
        <Box>
          <Typography level="body-sm" sx={{ mb: 2, fontWeight: 'medium' }}>
            Work Orders Found: {validWorkOrders.length}
            {validWorkOrders.length > workOrderIds.filter(id => id.trim() !== '').length && (
              <Chip size="sm" color="success" variant="soft" sx={{ ml: 2 }}>
                +{validWorkOrders.length - workOrderIds.filter(id => id.trim() !== '').length} AI Suggested
              </Chip>
            )}
          </Typography>
          <Grid container spacing={1}>
            {validWorkOrders.map((wo, index) => {
              const isUserInput = workOrderIds.some(id => id.trim().toUpperCase() === wo.id)
              const isFirstWorkOrder = index === 0
              
              return (
                <Grid xs={12} sm={6} md={4} key={wo.id}>
                  <Card 
                    size="sm" 
                    variant={isUserInput ? "outlined" : "soft"}
                    sx={{ 
                      border: isFirstWorkOrder ? '2px solid' : undefined,
                      borderColor: isFirstWorkOrder ? 'primary.main' : undefined
                    }}
                  >
                    <CardContent>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography level="body-sm" fontWeight="bold">
                            {wo.id}
                            {isFirstWorkOrder && (
                              <Chip size="sm" color="primary" variant="solid" sx={{ ml: 1 }}>
                                Primary
                              </Chip>
                            )}
                            {!isUserInput && !isFirstWorkOrder && (
                              <Chip size="sm" color="success" variant="soft" sx={{ ml: 1 }}>
                                AI Suggested
                              </Chip>
                            )}
                          </Typography>
                          <Chip size="sm" color={getPriorityColor(wo.priority)} variant="soft">
                            {wo.priority}
                          </Chip>
                        </Box>
                        <Typography level="body-xs">
                          {wo.title}
                        </Typography>
                        <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                          {wo.property}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip size="sm" color={getServiceTypeColor(wo.serviceType)} variant="soft" startDecorator={<BuildIcon />}>
                            {wo.serviceType}
                          </Chip>
                          <Chip size="sm" color="neutral" variant="outlined" startDecorator={<LocationIcon />}>
                            {wo.serviceArea}
                          </Chip>
                        </Stack>
                        <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                          ${wo.estimatedCost} • {wo.estimatedDuration}h
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
          
          {validWorkOrders.length > 1 && (
            <Alert color="success" variant="soft" sx={{ mt: 2 }}>
              <Typography level="body-sm">
                <strong>Smart Bundling:</strong> AI found {validWorkOrders.length - 1} related work orders in the same service area 
                ({validWorkOrders[0]?.serviceArea}) for potential bundling opportunities.
              </Typography>
            </Alert>
          )}
        </Box>
      )}

      {/* Bundle Recommendations */}
      {showRecommendations && (
        <Box>
          <Typography level="h4" sx={{ mb: 2 }}>
            Bundle Recommendations
          </Typography>
          
          {bundleRecommendations.length === 0 ? (
            <Alert color="warning" variant="soft">
              <Typography level="body-sm">
                {validWorkOrders.length === 1 
                  ? `No additional work orders found in ${validWorkOrders[0]?.serviceArea} that can be bundled with ${validWorkOrders[0]?.id}.`
                  : "No bundle opportunities found. Try work orders from the same service area or compatible service types."
                }
              </Typography>
            </Alert>
          ) : (
            <Stack spacing={2}>
              {bundleRecommendations.map((bundle) => (
                <Card key={bundle.id} variant="outlined">
                  <CardContent>
                    <Stack spacing={2}>
                      {/* Bundle Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography level="title-md" fontWeight="bold">
                            {bundle.name}
                          </Typography>
                          <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                            {bundle.bundlingCriteria}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography level="title-sm" sx={{ color: 'success.main' }}>
                            Save ${bundle.savings.toFixed(0)} ({bundle.savingsPercentage.toFixed(1)}%)
                          </Typography>
                          <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                            Total: ${bundle.totalCost} • {bundle.totalDuration}h
                          </Typography>
                        </Box>
                      </Box>

                      {/* Work Orders in Bundle */}
                      <Box>
                        <Typography level="body-sm" fontWeight="medium" sx={{ mb: 1 }}>
                          Work Orders ({bundle.workOrders.length}):
                        </Typography>
                        <Grid container spacing={1}>
                          {bundle.workOrders.map((wo) => (
                            <Grid xs={12} sm={6} key={wo.id}>
                              <Box sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Box>
                                    <Typography level="body-xs" fontWeight="medium">
                                      {wo.id} - {wo.title}
                                    </Typography>
                                    <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                      {wo.property}
                                    </Typography>
                                  </Box>
                                  <Stack direction="row" spacing={0.5}>
                                    <Chip size="sm" color={getPriorityColor(wo.priority)} variant="soft">
                                      {wo.priority}
                                    </Chip>
                                    <Chip size="sm" color={getServiceTypeColor(wo.serviceType)} variant="soft">
                                      {wo.serviceType}
                                    </Chip>
                                  </Stack>
                                </Stack>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button size="sm" variant="outlined">
                          Modify Bundle
                        </Button>
                        <Button
                          size="sm"
                          variant="solid"
                          color="success"
                          startDecorator={<SendIcon />}
                          onClick={() => acceptBundle(bundle)}
                        >
                          Accept Bundle
                        </Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Stack>
  )
}
