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
  Grid,
  Checkbox,
  Avatar,
  LinearProgress,
} from '@mui/joy'
import {
  Search as SearchIcon,
  AutoFixHigh as AutoFixHighIcon,
  LocationOn as LocationIcon,
  Build as BuildIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Thermostat as ThermostatIcon,
  Kitchen as KitchenIcon,
  Lightbulb as LightbulbIcon,
  ElectricalServices as ElectricalIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material'

interface Asset {
  id: string
  name: string
  type: string
  location: string
  specificLocation: string
  installationDate: string
  assetAge: number
  lastServiced: string
  typicalServiceInterval: number
  confidenceLevel: 'High' | 'Medium' | 'Low'
  reason: string
  daysUntilService: number
  priority: 'High' | 'Medium' | 'Low'
}

interface BundleOpportunity {
  location: string
  assets: Asset[]
  totalAssets: number
}

// Mock API response structure
const mockApiResponse: BundleOpportunity = {
  location: "Sunset Ridge Apartments",
  assets: [
    {
      id: "HVAC-RTU-001",
      name: "Carrier 50TCQ Rooftop Unit",
      type: "HVAC",
      location: "Sunset Ridge Apartments",
      specificLocation: "Building A - Rooftop North",
      installationDate: "March 15, 2019",
      assetAge: 5,
      lastServiced: "108 days ago",
      typicalServiceInterval: 120,
      confidenceLevel: "High",
      reason: "Quarterly maintenance due. Compressor showing signs of wear, filter replacement required.",
      daysUntilService: 12,
      priority: "High"
    },
    {
      id: "REF-WI-204",
      name: "Whirlpool WRF555SDFZ Refrigerator",
      type: "Refrigeration",
      location: "Sunset Ridge Apartments",
      specificLocation: "Unit 204A - Kitchen",
      installationDate: "June 8, 2021",
      assetAge: 3,
      lastServiced: "95 days ago",
      typicalServiceInterval: 90,
      confidenceLevel: "High",
      reason: "Overdue for maintenance. Tenant reported temperature fluctuations.",
      daysUntilService: -5,
      priority: "High"
    },
    {
      id: "LIGHT-LOB-001",
      name: "Philips LED Lobby Lighting Array",
      type: "Lighting",
      location: "Sunset Ridge Apartments",
      specificLocation: "Main Lobby - Entrance",
      installationDate: "January 12, 2020",
      assetAge: 4,
      lastServiced: "45 days ago",
      typicalServiceInterval: 180,
      confidenceLevel: "Medium",
      reason: "Preventive maintenance for LED driver inspection and photocell calibration.",
      daysUntilService: 135,
      priority: "Low"
    },
    {
      id: "ELEC-MP-001",
      name: "Square D 400A Main Panel",
      type: "Electrical",
      location: "Sunset Ridge Apartments",
      specificLocation: "Building A - Electrical Room",
      installationDate: "September 3, 2018",
      assetAge: 6,
      lastServiced: "200 days ago",
      typicalServiceInterval: 365,
      confidenceLevel: "Medium",
      reason: "Annual electrical safety inspection required by local code compliance.",
      daysUntilService: 165,
      priority: "Medium"
    },
    {
      id: "HVAC-AHU-002",
      name: "Trane TAM Air Handler Unit",
      type: "HVAC",
      location: "Sunset Ridge Apartments",
      specificLocation: "Building A - Mechanical Room 2F",
      installationDate: "November 20, 2020",
      assetAge: 4,
      lastServiced: "75 days ago",
      typicalServiceInterval: 90,
      confidenceLevel: "High",
      reason: "Filter replacement and belt inspection due. System efficiency monitoring recommended.",
      daysUntilService: 15,
      priority: "Medium"
    }
  ],
  totalAssets: 5
}

interface AssetBundleGeneratorProps {
  onBundleCreated?: () => void
}

export default function AssetBundleGenerator({ onBundleCreated }: AssetBundleGeneratorProps) {
  const [workOrderId, setWorkOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [bundleData, setBundleData] = useState<BundleOpportunity | null>(null)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleGenerateBundle = async () => {
    if (!workOrderId.trim()) {
      setError('Please enter a Work Order ID')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Call the API
      const response = await fetch('https://zgm8h6cl-3000.asse.devtunnels.ms111/bundles/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ woid: workOrderId }),
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`)
      }

      const data = await response.json()
      setBundleData(data)
      
      // Auto-select high priority assets
      const highPriorityAssets = data.assets
        ?.filter((asset: Asset) => asset.priority === 'High')
        ?.map((asset: Asset) => asset.id) || []
      setSelectedAssets(highPriorityAssets)
      
    } catch (err) {
      console.error('API call failed, using mock data:', err)
      // Fallback to mock data for demo purposes
      setBundleData(mockApiResponse)
      const highPriorityAssets = mockApiResponse.assets
        ?.filter(asset => asset.priority === 'High')
        .map(asset => asset.id)
      setSelectedAssets(highPriorityAssets)
      setError('Using demo data (API not available)')
    } finally {
      setLoading(false)
    }
  }

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    )
  }

  const getAssetIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hvac': return <ThermostatIcon />
      case 'refrigeration': return <KitchenIcon />
      case 'lighting': return <LightbulbIcon />
      case 'electrical': return <ElectricalIcon />
      default: return <BuildIcon />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'danger'
      case 'Medium': return 'warning'
      case 'Low': return 'success'
      default: return 'neutral'
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'success'
      case 'Medium': return 'warning'
      case 'Low': return 'danger'
      default: return 'neutral'
    }
  }

  const selectedAssetsData = bundleData?.assets.filter(asset => selectedAssets.includes(asset.id)) || []

  const generateBundle = () => {
    if (selectedAssetsData.length === 0) {
      setError('Please select at least one asset')
      return
    }

    // Generate realistic work order numbers
    const generateWONumber = () => {
      const prefix = 'B'
      const randomNumber = Math.floor(Math.random() * (9999999 - 9000000) + 9000000)
      return `${prefix}${randomNumber}`
    }

    // Create bundle object
    const newBundle = {
      id: `bundle-${Date.now()}`,
      name: `${bundleData?.location} Asset Bundle`,
      workOrders: selectedAssetsData.map(asset => ({
        id: generateWONumber(),
        assetId: asset.id,
        assetName: asset.name,
        assetType: asset.type,
        priority: asset.priority,
        specificLocation: asset.specificLocation
      })),
      serviceArea: bundleData?.location,
      acceptedAt: new Date().toISOString(),
      status: 'ready_for_dispatch',
      createdFrom: 'asset_bundling',
      originalWoid: workOrderId,
      estimatedDuration: `${Math.ceil(selectedAssetsData.length * 1.5)} hours`
    }

    // Save to localStorage for bundle history and dispatch availability
    const existingBundles = JSON.parse(localStorage.getItem('bundleHistory') || '[]')
    const updatedBundles = [...existingBundles, newBundle]
    localStorage.setItem('bundleHistory', JSON.stringify(updatedBundles))

    // Also save to dispatch queue
    const dispatchQueue = JSON.parse(localStorage.getItem('dispatchQueue') || '[]')
    const updatedQueue = [...dispatchQueue, newBundle]
    localStorage.setItem('dispatchQueue', JSON.stringify(updatedQueue))

    // Show success message
    setSuccessMessage(`Bundle created successfully! ${newBundle.name} with ${newBundle.workOrders.length} work orders. Redirecting to Bundle Dispatch...`)
    
    // Auto-hide success message and redirect after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null)
      // Reset the form
      setWorkOrderId('')
      setBundleData(null)
      setSelectedAssets([])
      setError(null)
      
      // Redirect to bundle dispatch page
      if (onBundleCreated) {
        onBundleCreated()
      }
    }, 3000)
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography level="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AutoFixHighIcon color="primary" />
          Smart Asset Bundling
        </Typography>
        <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
          Enter a Work Order ID to discover bundling opportunities with nearby assets
        </Typography>
      </Box>

      {/* Success Snackbar */}
      {successMessage && (
        <Alert 
          color="success" 
          variant="soft"
          sx={{ 
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            minWidth: '400px',
            maxWidth: '600px',
            boxShadow: 'lg',
            animation: 'slideDown 0.3s ease-out',
            '@keyframes slideDown': {
              from: { opacity: 0, transform: 'translateX(-50%) translateY(-20px)' },
              to: { opacity: 1, transform: 'translateX(-50%) translateY(0)' }
            },
            bgcolor: 'success.softBg',
            borderColor: 'success.outlinedBorder',
            border: '1px solid'
          }}
          startDecorator={<CheckCircleIcon sx={{ color: 'success.main' }} />}
          endDecorator={
            <Button 
              size="sm" 
              variant="plain" 
              color="neutral"
              onClick={() => setSuccessMessage(null)}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { bgcolor: 'neutral.softHoverBg' }
              }}
            >
              ✕
            </Button>
          }
        >
          <Typography level="body-sm" fontWeight="medium" sx={{ color: 'text.primary' }}>
            {successMessage}
          </Typography>
        </Alert>
      )}

      {/* Work Order Input */}
      <Card>
        <CardContent>
          <Typography level="h4" sx={{ mb: 2 }}>
            Generate Bundle Suggestions
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="flex-end">
              <Box sx={{ flex: 1 }}>
                <Typography level="body-sm" sx={{ mb: 1 }}>
                  Work Order ID
                </Typography>
                <Input
                  placeholder="Enter Work Order ID (e.g., 9815575)"
                  value={workOrderId}
                  onChange={(e) => setWorkOrderId(e.target.value)}
                  startDecorator={<SearchIcon />}
                  disabled={loading}
                />
              </Box>
              <Button
                variant="solid"
                startDecorator={loading ? undefined : <PsychologyIcon />}
                onClick={handleGenerateBundle}
                loading={loading}
                disabled={!workOrderId.trim()}
              >
                Generate bundle
              </Button>
            </Stack>
            
            {/* Suggested Work Order IDs */}
            <Box>
              <Typography level="body-xs" sx={{ mb: 1, color: 'text.secondary' }}>
                🔍 Recent work orders with bundling opportunities:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {[
                  { id: '9815575', type: 'Rooftop HVAC Service', priority: 'High' },
                  { id: '9798675', type: 'Electrical Panel Inspection', priority: 'Medium' },
                  { id: '9814286', type: 'Appliance Maintenance', priority: 'High' }
                ].map((suggestion) => (
                  <Chip
                    key={suggestion.id}
                    size="sm"
                    variant="outlined"
                    color={suggestion.priority === 'High' ? 'danger' : 'warning'}
                    onClick={() => setWorkOrderId(suggestion.id)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { 
                        bgcolor: suggestion.priority === 'High' ? 'danger.softHoverBg' : 'warning.softHoverBg',
                        borderColor: suggestion.priority === 'High' ? 'danger.main' : 'warning.main'
                      }
                    }}
                  >
                    {suggestion.id} • {suggestion.type}
                  </Chip>
                ))}
              </Stack>
              <Typography level="body-xs" sx={{ mt: 1, color: 'text.tertiary', fontStyle: 'italic' }}>
                Click on a work order to check for bundling opportunities
              </Typography>
            </Box>
          </Stack>
          
          {error && (
            <Alert color="warning" variant="soft" sx={{ mt: 2 }}>
              <Typography level="body-sm">{error}</Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Bundle Results */}
      {bundleData && (
        <>
          {/* Bundle Overview */}
          <Card>
            <CardContent>
              <Typography level="h4" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon color="primary" />
                Bundling Opportunity Detected
              </Typography>
              
              <Alert color="success" variant="soft" sx={{ mb: 3 }}>
                <Typography level="body-sm" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PsychologyIcon sx={{ color: 'success.main' }} />
                  <strong>AI has identified {bundleData.totalAssets} assets</strong> in {bundleData.location} that are approaching their next service window.
                </Typography>
              </Alert>

              <Grid container spacing={3}>
                <Grid xs={12} sm={6} md={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography level="h2" sx={{ color: 'primary.main' }}>
                      {bundleData.totalAssets}
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                      Available Assets
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={12} sm={6} md={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography level="h2" sx={{ color: 'success.main' }}>
                      {selectedAssets.length}
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                      Selected Assets
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Asset Selection */}
          <Card>
            <CardContent>
              <Typography level="h4" sx={{ mb: 2 }}>
                Select Assets for Bundling
              </Typography>
              
              {selectedAssets.length > 0 && (
                <Alert color="primary" variant="soft" sx={{ mb: 3 }}>
                  <Typography level="body-sm">
                    <strong>{selectedAssets.length} assets selected</strong> for bundling
                  </Typography>
                </Alert>
              )}

              <Grid container spacing={2}>
                {bundleData.assets.map((asset) => {
                  const isSelected = selectedAssets.includes(asset.id)
                  const isOverdue = asset.daysUntilService < 0
                  
                  return (
                    <Grid xs={12} md={6} key={asset.id}>
                      <Card 
                        variant={isSelected ? "outlined" : "soft"}
                        sx={{ 
                          cursor: 'pointer',
                          border: isSelected ? '2px solid' : '1px solid',
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          '&:hover': { borderColor: 'primary.main' }
                        }}
                        onClick={() => toggleAssetSelection(asset.id)}
                      >
                        <CardContent>
                          <Stack spacing={2}>
                            {/* Asset Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Checkbox 
                                  checked={isSelected}
                                  onChange={() => toggleAssetSelection(asset.id)}
                                  sx={{ pointerEvents: 'none' }}
                                />
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                  {getAssetIcon(asset.type)}
                                </Avatar>
                                <Box>
                                  <Typography level="title-sm" fontWeight="bold">
                                    {asset.name}
                                  </Typography>
                                  <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                    {asset.id} • {asset.type}
                                  </Typography>
                                </Box>
                              </Stack>
                              <Stack alignItems="flex-end" spacing={0.5}>
                                <Chip 
                                  size="sm" 
                                  color={getPriorityColor(asset.priority)} 
                                  variant="soft"
                                >
                                  {asset.priority}
                                </Chip>
                                <Chip 
                                  size="sm" 
                                  color={getConfidenceColor(asset.confidenceLevel)} 
                                  variant="outlined"
                                >
                                  {asset.confidenceLevel} confidence
                                </Chip>
                              </Stack>
                            </Box>

                            {/* Service Status */}
                            <Box sx={{ 
                              bgcolor: isOverdue ? 'danger.softBg' : 'warning.softBg', 
                              p: 2, 
                              borderRadius: 'sm' 
                            }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                <Typography level="body-sm" fontWeight="medium">
                                  Last Serviced: {asset.lastServiced}
                                </Typography>
                                <Typography level="body-sm" fontWeight="medium">
                                  {isOverdue ? (
                                    <Chip size="sm" color="danger" variant="solid" startDecorator={<WarningIcon />}>
                                      {Math.abs(asset.daysUntilService)} days overdue
                                    </Chip>
                                  ) : (
                                    <Chip size="sm" color="warning" variant="soft" startDecorator={<ScheduleIcon />}>
                                      {asset.daysUntilService} days until service
                                    </Chip>
                                  )}
                                </Typography>
                              </Stack>
                              <LinearProgress
                                determinate
                                value={Math.min(100, ((asset.typicalServiceInterval + asset.daysUntilService) / asset.typicalServiceInterval) * 100)}
                                color={isOverdue ? 'danger' : 'warning'}
                                sx={{ height: 6 }}
                              />
                            </Box>

                            {/* Asset Information */}
                            <Box sx={{ 
                              bgcolor: 'neutral.softBg', 
                              p: 1.5, 
                              borderRadius: 'sm',
                              border: '1px solid',
                              borderColor: 'neutral.outlinedBorder'
                            }}>
                              <Stack spacing={1}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                    <strong>Location:</strong>
                                  </Typography>
                                  <Typography level="body-xs" fontWeight="medium">
                                    {asset.specificLocation}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                    <strong>Installed:</strong>
                                  </Typography>
                                  <Typography level="body-xs" fontWeight="medium">
                                    {asset.installationDate}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                    <strong>Age:</strong>
                                  </Typography>
                                  <Typography level="body-xs" fontWeight="medium">
                                    {asset.assetAge} years
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Box>

                            {/* Asset Details */}
                            <Box>
                              <Typography level="body-xs" sx={{ mb: 1, color: 'text.secondary' }}>
                                <strong>Recommendation:</strong>
                              </Typography>
                              <Typography level="body-xs">
                                {asset.reason}
                              </Typography>
                            </Box>


                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {selectedAssets.length > 0 && (
            <Card sx={{ bgcolor: 'primary.softBg' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography level="title-md" fontWeight="bold">
                      Bundle Summary
                    </Typography>
                    <Typography level="body-sm">
                      {selectedAssets.length} assets selected for bundling
                    </Typography>
                    <Typography level="body-xs" sx={{ color: 'text.secondary', mt: 1 }}>
                      This will create {selectedAssets.length} work orders and make the bundle available for dispatch
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={() => setSelectedAssets([])}>
                      Clear Selection
                    </Button>
                    <Button 
                      variant="solid" 
                      startDecorator={<SendIcon />}
                      onClick={generateBundle}
                    >
                      Add to Bundle ({selectedAssets.length})
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Stack>
  )
}
