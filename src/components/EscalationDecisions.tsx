import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  Button,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Sheet,
  IconButton,
  Tooltip,
} from '@mui/joy'
import {
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as MoneyIcon,
  Person as PersonIcon,
  AutoFixHigh as AutoFixHighIcon,
  Refresh as RefreshIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material'

interface EscalationScenario {
  id: string
  requestId: string
  property: string
  issue: string
  escalationReason: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  potentialImpact: string[]
  recommendedActions: {
    action: string
    priority: number
    timeline: string
    cost?: number
  }[]
  stakeholders: string[]
  aiConfidence: number
}

const mockEscalations: EscalationScenario[] = [
  {
    id: 'ESC-001',
    requestId: 'REQ-001',
    property: 'Sunset Apartments #204',
    issue: 'Water leak in bathroom',
    escalationReason: 'Potential structural damage detected',
    riskLevel: 'high',
    potentialImpact: [
      'Water damage to adjacent units',
      'Mold growth risk within 48 hours',
      'Structural integrity concerns',
      'Potential tenant displacement'
    ],
    recommendedActions: [
      {
        action: 'Emergency water shutoff',
        priority: 1,
        timeline: 'Immediate',
        cost: 0
      },
      {
        action: 'Professional water damage assessment',
        priority: 2,
        timeline: 'Within 2 hours',
        cost: 350
      },
      {
        action: 'Temporary tenant relocation',
        priority: 3,
        timeline: 'Within 4 hours',
        cost: 200
      }
    ],
    stakeholders: ['Property Manager', 'Insurance Agent', 'Tenant'],
    aiConfidence: 92
  },
  {
    id: 'ESC-002',
    requestId: 'REQ-004',
    property: 'Downtown Plaza #12',
    issue: 'Electrical panel sparking',
    escalationReason: 'Fire safety hazard identified',
    riskLevel: 'critical',
    potentialImpact: [
      'Fire risk to entire building',
      'Electrical system failure',
      'Life safety concerns',
      'Building code violations'
    ],
    recommendedActions: [
      {
        action: 'Immediate power shutoff to affected area',
        priority: 1,
        timeline: 'Immediate',
        cost: 0
      },
      {
        action: 'Emergency electrician dispatch',
        priority: 2,
        timeline: 'Within 30 minutes',
        cost: 450
      },
      {
        action: 'Fire department notification',
        priority: 3,
        timeline: 'Within 15 minutes',
        cost: 0
      }
    ],
    stakeholders: ['Property Manager', 'Fire Department', 'All Tenants', 'Insurance'],
    aiConfidence: 98
  }
]

export default function EscalationDecisions() {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'danger'
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'neutral'
      default: return 'neutral'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'success'
    if (confidence >= 85) return 'warning'
    return 'danger'
  }

  return (
    <Card>
      <CardContent>
        <Typography level="h4" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon color="warning" />
          Escalation Decision Support
          <Tooltip title="Refresh escalation analysis">
            <IconButton size="sm" variant="outlined">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Typography>


        <Stack spacing={3}>
          {mockEscalations.map((escalation) => (
            <Sheet
              key={escalation.id}
              variant="outlined"
              sx={{ 
                p: 3, 
                borderRadius: 'md',
                borderColor: getRiskColor(escalation.riskLevel) + '.main',
                borderWidth: 2
              }}
            >
              <Stack spacing={3}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Stack spacing={1}>
                    <Typography level="title-md" fontWeight="bold">
                      {escalation.issue}
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                      {escalation.property} • {escalation.escalationReason}
                    </Typography>
                  </Stack>
                  
                  <Stack alignItems="flex-end" spacing={1}>
                    <Chip 
                      size="sm" 
                      color={getRiskColor(escalation.riskLevel)}
                      variant="solid"
                      startDecorator={<WarningIcon />}
                    >
                      {escalation.riskLevel.toUpperCase()} RISK
                    </Chip>
                    <Chip 
                      size="sm" 
                      color={getConfidenceColor(escalation.aiConfidence)}
                      variant="soft"
                      startDecorator={<AutoFixHighIcon />}
                    >
                      {escalation.aiConfidence}% confidence
                    </Chip>
                  </Stack>
                </Box>

                {/* Potential Impact */}
                <Box>
                  <Typography level="body-sm" fontWeight="medium" sx={{ mb: 1 }}>
                    Potential Impact:
                  </Typography>
                  <List size="sm">
                    {escalation.potentialImpact.map((impact, idx) => (
                      <ListItem key={idx}>
                        <ListItemDecorator>
                          <WarningIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                        </ListItemDecorator>
                        <ListItemContent>
                          <Typography level="body-xs">{impact}</Typography>
                        </ListItemContent>
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {/* Recommended Actions */}
                <Box>
                  <Typography level="body-sm" fontWeight="medium" sx={{ mb: 2 }}>
                    AI-Recommended Actions:
                  </Typography>
                  <Stack spacing={2}>
                    {escalation.recommendedActions
                      .sort((a, b) => a.priority - b.priority)
                      .map((action, idx) => (
                      <Box
                        key={idx}
                        sx={{ 
                          p: 2, 
                          bgcolor: 'background.level1', 
                          borderRadius: 'sm',
                          border: '1px solid',
                          borderColor: action.priority === 1 ? 'danger.outlinedBorder' : 'neutral.outlinedBorder'
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                          <Chip size="sm" color="primary" variant="solid">
                            #{action.priority}
                          </Chip>
                          <Typography level="body-sm" fontWeight="medium">
                            {action.action}
                          </Typography>
                          <Box sx={{ ml: 'auto' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography level="body-xs">
                                {action.timeline}
                              </Typography>
                              {action.cost && (
                                <>
                                  <MoneyIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                  <Typography level="body-xs">
                                    ${action.cost}
                                  </Typography>
                                </>
                              )}
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Stakeholders */}
                <Box>
                  <Typography level="body-sm" fontWeight="medium" sx={{ mb: 1 }}>
                    Notify Stakeholders:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {escalation.stakeholders.map((stakeholder, idx) => (
                      <Chip 
                        key={idx}
                        size="sm" 
                        variant="outlined" 
                        startDecorator={<PersonIcon />}
                      >
                        {stakeholder}
                      </Chip>
                    ))}
                  </Stack>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
                  <Button size="sm" variant="outlined" startDecorator={<EmailIcon />}>
                    Send Alerts
                  </Button>
                  <Button size="sm" variant="outlined" startDecorator={<PhoneIcon />}>
                    Emergency Call
                  </Button>
                  <Button size="sm" variant="solid" color="danger">
                    Execute Plan
                  </Button>
                </Box>
              </Stack>
            </Sheet>
          ))}
        </Stack>

        {/* Summary */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.level1', borderRadius: 'md' }}>
          <Typography level="body-sm" fontWeight="medium" sx={{ mb: 2 }}>
            Escalation Summary
          </Typography>
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                Critical Issues
              </Typography>
              <Typography level="title-sm" fontWeight="bold" sx={{ color: 'danger.main' }}>
                {mockEscalations.filter(e => e.riskLevel === 'critical').length}
              </Typography>
            </Box>
            <Box>
              <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                High Risk Issues
              </Typography>
              <Typography level="title-sm" fontWeight="bold" sx={{ color: 'warning.main' }}>
                {mockEscalations.filter(e => e.riskLevel === 'high').length}
              </Typography>
            </Box>
            <Box>
              <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                Avg. AI Confidence
              </Typography>
              <Typography level="title-sm" fontWeight="bold">
                {Math.round(mockEscalations.reduce((sum, e) => sum + e.aiConfidence, 0) / mockEscalations.length)}%
              </Typography>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
} 