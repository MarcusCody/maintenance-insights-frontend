import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Alert,
  IconButton,
  Tooltip,
  Sheet,
} from '@mui/joy'
import {
  AutoFixHigh as AutoFixHighIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  MonetizationOn as MoneyIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'

interface MaintenanceRequest {
  id: string
  property: string
  issue: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'emergency'
  location: string
  description: string
  createdAt: string
  estimatedDuration: string
  estimatedCost: number
}

interface Contractor {
  id: string
  name: string
  company: string
  rating: number
  completionRate: number
  avgResponseTime: string
  specialties: string[]
  currentLoad: number
  distance: number
  hourlyRate: number
  availability: 'available' | 'busy' | 'unavailable'
  lastJobCompletion: string
}

interface DispatchRecommendation {
  requestId: string
  contractor: Contractor
  confidence: number
  reasoning: string[]
  estimatedCompletion: string
  costSavings?: number
  urgencyScore: number
  bundlingOpportunity?: {
    otherRequests: string[]
    totalSavings: number
  }
}

const mockRequests: MaintenanceRequest[] = [
  {
    id: 'REQ-001',
    property: 'Sunset Apartments #204',
    issue: 'Water leak in bathroom',
    category: 'plumbing',
    priority: 'high',
    location: 'Unit 204, Master Bathroom',
    description: 'Tenant reports water leak under sink, visible water damage to cabinet',
    createdAt: '2024-01-15T10:30:00Z',
    estimatedDuration: '2-3 hours',
    estimatedCost: 250,
  },
  {
    id: 'REQ-002',
    property: 'Oak Street Complex #15',
    issue: 'HVAC not heating properly',
    category: 'hvac',
    priority: 'high',
    location: 'Unit 15, Living Room',
    description: 'Temperature not reaching set point, possible filter or thermostat issue',
    createdAt: '2024-01-15T09:15:00Z',
    estimatedDuration: '1-2 hours',
    estimatedCost: 180,
  },
  {
    id: 'REQ-003',
    property: 'Sunset Apartments #206',
    issue: 'Kitchen faucet dripping',
    category: 'plumbing',
    priority: 'medium',
    location: 'Unit 206, Kitchen',
    description: 'Persistent drip from kitchen faucet, tenant reports increased water bill',
    createdAt: '2024-01-15T08:45:00Z',
    estimatedDuration: '1 hour',
    estimatedCost: 120,
  },
]

const mockContractors: Contractor[] = [
  {
    id: 'CONT-001',
    name: 'Mike Rodriguez',
    company: 'Rodriguez Plumbing Pro',
    rating: 4.9,
    completionRate: 98,
    avgResponseTime: '15 mins',
    specialties: ['plumbing', 'water damage'],
    currentLoad: 2,
    distance: 0.8,
    hourlyRate: 85,
    availability: 'available',
    lastJobCompletion: '2024-01-14T16:30:00Z',
  },
  {
    id: 'CONT-002',
    name: 'Sarah Chen',
    company: 'Climate Control Experts',
    rating: 4.8,
    completionRate: 96,
    avgResponseTime: '20 mins',
    specialties: ['hvac', 'electrical'],
    currentLoad: 1,
    distance: 1.2,
    hourlyRate: 95,
    availability: 'available',
    lastJobCompletion: '2024-01-14T14:15:00Z',
  },
  {
    id: 'CONT-003',
    name: 'Tom Wilson',
    company: 'Wilson Maintenance Co',
    rating: 4.7,
    completionRate: 94,
    avgResponseTime: '25 mins',
    specialties: ['plumbing', 'general maintenance'],
    currentLoad: 3,
    distance: 2.1,
    hourlyRate: 75,
    availability: 'busy',
    lastJobCompletion: '2024-01-13T11:00:00Z',
  },
]

const generateRecommendations = (requests: MaintenanceRequest[]): DispatchRecommendation[] => {
  return requests.map(request => {
    const suitableContractors = mockContractors.filter(contractor => 
      contractor.specialties.includes(request.category) && contractor.availability === 'available'
    )
    
    const bestContractor = suitableContractors.sort((a, b) => {
      const scoreA = (a.rating * 0.3) + (a.completionRate * 0.3) + ((5 - a.distance) * 0.2) + ((5 - a.currentLoad) * 0.2)
      const scoreB = (b.rating * 0.3) + (b.completionRate * 0.3) + ((5 - b.distance) * 0.2) + ((5 - b.currentLoad) * 0.2)
      return scoreB - scoreA
    })[0]

    const bundlingOpportunity = request.category === 'plumbing' ? {
      otherRequests: ['REQ-003'],
      totalSavings: 45
    } : undefined

    return {
      requestId: request.id,
      contractor: bestContractor,
      confidence: Math.floor(85 + Math.random() * 10),
      reasoning: [
        `High rating (${bestContractor.rating}/5.0) with ${bestContractor.completionRate}% completion rate`,
        `Specializes in ${request.category} with low current workload`,
        `Close proximity (${bestContractor.distance} miles) for quick response`,
        bundlingOpportunity ? 'Bundling opportunity identified for cost savings' : 'Optimal scheduling window available'
      ],
      estimatedCompletion: request.priority === 'high' ? 'Today 2:30 PM' : 'Tomorrow 10:00 AM',
      costSavings: bundlingOpportunity ? bundlingOpportunity.totalSavings : undefined,
      urgencyScore: request.priority === 'emergency' ? 95 : request.priority === 'high' ? 80 : request.priority === 'medium' ? 60 : 40,
      bundlingOpportunity
    }
  })
}

export default function DispatchRecommendations() {
  const [recommendations] = useState<DispatchRecommendation[]>(generateRecommendations(mockRequests))
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'danger'
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'neutral'
      default: return 'neutral'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'success'
    if (confidence >= 80) return 'warning'
    return 'danger'
  }

  return (
    <Card>
      <CardContent>
        <Typography level="h4" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoFixHighIcon color="primary" />
          AI Dispatch Recommendations
          <Tooltip title="Refresh recommendations">
            <IconButton size="sm" variant="outlined">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Typography>

        <Alert color="primary" variant="soft" sx={{ mb: 3 }}>
          <Typography level="body-sm">
            <strong>3 maintenance requests</strong> ready for dispatch. AI has analyzed contractor availability, 
            expertise, location, and workload to provide optimal recommendations.
          </Typography>
        </Alert>

        <Stack spacing={3}>
          {recommendations.map((rec) => {
            const request = mockRequests.find(r => r.id === rec.requestId)!
            const isSelected = selectedRequest === rec.requestId
            
            return (
              <Sheet
                key={rec.requestId}
                variant={isSelected ? 'outlined' : 'soft'}
                sx={{ 
                  p: 3, 
                  borderRadius: 'md',
                  borderColor: isSelected ? 'primary.main' : undefined,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setSelectedRequest(isSelected ? null : rec.requestId)}
              >
                <Stack spacing={2}>
                  {/* Request Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Stack spacing={1}>
                      <Typography level="title-md" fontWeight="bold">
                        {request.issue}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip size="sm" color={getPriorityColor(request.priority)} variant="soft">
                          {request.priority}
                        </Chip>
                        <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                          {request.property}
                        </Typography>
                        <LocationIcon sx={{ fontSize: 16, color: 'text.tertiary' }} />
                        <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                          {request.location}
                        </Typography>
                      </Stack>
                    </Stack>
                    
                    <Stack alignItems="flex-end" spacing={1}>
                      <Chip 
                        size="sm" 
                        color={getConfidenceColor(rec.confidence)}
                        variant="solid"
                        startDecorator={<AutoFixHighIcon />}
                      >
                        {rec.confidence}% confidence
                      </Chip>
                      <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                        Urgency: {rec.urgencyScore}/100
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Recommended Contractor */}
                  <Box sx={{ 
                    bgcolor: 'background.level1', 
                    p: 2, 
                    borderRadius: 'sm',
                    border: '1px solid',
                    borderColor: 'success.outlinedBorder'
                  }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <PersonIcon />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography level="title-sm" fontWeight="bold">
                          {rec.contractor.name}
                        </Typography>
                        <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                          {rec.contractor.company}
                        </Typography>
                      </Box>
                      <Stack alignItems="flex-end" spacing={0.5}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography level="body-sm" fontWeight="medium">
                            {rec.contractor.rating}
                          </Typography>
                        </Stack>
                        <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                          {rec.contractor.completionRate}% completion
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={3}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography level="body-xs">
                          {rec.contractor.avgResponseTime} response
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography level="body-xs">
                          {rec.contractor.distance} miles away
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <SpeedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography level="body-xs">
                          {rec.contractor.currentLoad} active jobs
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  {/* AI Reasoning */}
                  <Box>
                    <Typography level="body-sm" fontWeight="medium" sx={{ mb: 1 }}>
                      Why this recommendation:
                    </Typography>
                    <List size="sm">
                      {rec.reasoning.map((reason, idx) => (
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

                  {/* Bundling Opportunity */}
                  {rec.bundlingOpportunity && (
                    <Alert color="success" variant="soft">
                      <Box>
                        <Typography level="body-sm" fontWeight="medium">
                          💡 Bundling Opportunity Detected
                        </Typography>
                        <Typography level="body-xs">
                          Combine with {rec.bundlingOpportunity.otherRequests.length} other plumbing request(s) 
                          to save <strong>${rec.bundlingOpportunity.totalSavings}</strong> in travel and setup costs.
                        </Typography>
                      </Box>
                    </Alert>
                  )}

                  {/* Dispatch Actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography level="body-sm">
                        <strong>ETA:</strong> {rec.estimatedCompletion}
                      </Typography>
                      <Typography level="body-sm">
                        <strong>Est. Cost:</strong> ${request.estimatedCost}
                      </Typography>
                      {rec.costSavings && (
                        <Chip size="sm" color="success" variant="soft" startDecorator={<MoneyIcon />}>
                          Save ${rec.costSavings}
                        </Chip>
                      )}
                    </Stack>
                    
                    <Stack direction="row" spacing={1}>
                      <Button size="sm" variant="outlined">
                        Modify
                      </Button>
                      <Button 
                        size="sm" 
                        variant="solid" 
                        startDecorator={<SendIcon />}
                        color="success"
                      >
                        Dispatch Now
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Sheet>
            )
          })}
        </Stack>

        {/* Summary Stats */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.level1', borderRadius: 'md' }}>
          <Typography level="body-sm" fontWeight="medium" sx={{ mb: 2 }}>
            Dispatch Summary
          </Typography>
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                Total Estimated Cost
              </Typography>
              <Typography level="title-sm" fontWeight="bold">
                ${recommendations.reduce((sum, rec) => sum + mockRequests.find(r => r.id === rec.requestId)!.estimatedCost, 0)}
              </Typography>
            </Box>
            <Box>
              <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                Potential Savings
              </Typography>
              <Typography level="title-sm" fontWeight="bold" sx={{ color: 'success.main' }}>
                ${recommendations.reduce((sum, rec) => sum + (rec.costSavings || 0), 0)}
              </Typography>
            </Box>
            <Box>
              <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                Avg. Confidence
              </Typography>
              <Typography level="title-sm" fontWeight="bold">
                {Math.round(recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length)}%
              </Typography>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
} 