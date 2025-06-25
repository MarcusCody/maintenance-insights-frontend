import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  Alert,
  Avatar,
  Grid,
  Select,
  Option,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  LinearProgress,
} from '@mui/joy'
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MonetizationOn as MoneyIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  Legend,
} from 'recharts'

// Mock data
const monthlyTrends = [
  { month: 'Jan', requests: 45, completed: 42, cost: 12500, satisfaction: 4.2 },
  { month: 'Feb', requests: 52, completed: 48, cost: 15200, satisfaction: 4.1 },
  { month: 'Mar', requests: 38, completed: 36, cost: 9800, satisfaction: 4.4 },
  { month: 'Apr', requests: 61, completed: 58, cost: 18400, satisfaction: 4.0 },
  { month: 'May', requests: 49, completed: 47, cost: 14100, satisfaction: 4.3 },
  { month: 'Jun', requests: 55, completed: 53, cost: 16700, satisfaction: 4.2 },
]

const categoryBreakdown = [
  { name: 'Plumbing', value: 35, cost: 8500, avgTime: 2.5, color: '#8884d8' },
  { name: 'Electrical', value: 25, cost: 6200, avgTime: 3.2, color: '#82ca9d' },
  { name: 'HVAC', value: 20, cost: 7800, avgTime: 4.1, color: '#ffc658' },
  { name: 'Appliances', value: 12, cost: 3400, avgTime: 2.8, color: '#ff7300' },
  { name: 'General', value: 8, cost: 1900, avgTime: 1.5, color: '#00ff88' },
]

const predictiveInsights = [
  {
    type: 'prediction',
    title: 'HVAC Maintenance Spike Predicted',
    description: 'Based on seasonal patterns, expect 40% increase in HVAC requests next month',
    confidence: 87,
    impact: 'high',
    recommendation: 'Pre-schedule HVAC specialists and stock common parts'
  },
  {
    type: 'cost_optimization',
    title: 'Bundling Opportunity',
    description: 'Plumbing requests in Sector 3 can be bundled to save $1,200/month',
    confidence: 92,
    impact: 'medium',
    recommendation: 'Implement smart bundling for plumbing category'
  }
]

interface KPICardProps {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  color: 'primary' | 'success' | 'warning' | 'danger'
}

const KPICard = ({ title, value, change, icon, color }: KPICardProps) => (
  <Card>
    <CardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 1 }}>
            {title}
          </Typography>
          <Typography level="h2" fontWeight="bold">
            {value}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
            {change > 0 ? (
              <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 16, color: 'danger.main' }} />
            )}
            <Typography 
              level="body-xs" 
              sx={{ color: change > 0 ? 'success.main' : 'danger.main' }}
            >
              {Math.abs(change)}% vs last month
            </Typography>
          </Stack>
        </Box>
        <Avatar sx={{ bgcolor: `${color}.main`, width: 48, height: 48 }}>
          {icon}
        </Avatar>
      </Stack>
    </CardContent>
  </Card>
)

export default function MaintenanceAnalytics() {
  const [timeRange, setTimeRange] = useState('6months')
  const [activeTab, setActiveTab] = useState(0)

  const kpiData = useMemo(() => [
    {
      title: 'Total Requests',
      value: 300,
      change: 12.5,
      icon: <BuildIcon />,
      color: 'primary' as const
    },
    {
      title: 'Completion Rate',
      value: '94.2%',
      change: 2.3,
      icon: <CheckCircleIcon />,
      color: 'success' as const
    },
    {
      title: 'Avg Response Time',
      value: '1.8h',
      change: -15.2,
      icon: <SpeedIcon />,
      color: 'warning' as const
    },
    {
      title: 'Total Cost',
      value: '$86.7K',
      change: 8.1,
      icon: <MoneyIcon />,
      color: 'danger' as const
    }
  ], [])

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'warning'
      case 'cost_optimization': return 'success'
      default: return 'primary'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TimelineIcon />
      case 'cost_optimization': return <MoneyIcon />
      default: return <AnalyticsIcon />
    }
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography level="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AnalyticsIcon color="primary" />
            Maintenance Analytics Dashboard
          </Typography>
          <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
            Comprehensive insights and performance metrics
          </Typography>
        </Box>
        <Select
          value={timeRange}
          onChange={(_, value) => setTimeRange(value as string)}
          size="sm"
        >
          <Option value="1month">Last Month</Option>
          <Option value="3months">Last 3 Months</Option>
          <Option value="6months">Last 6 Months</Option>
          <Option value="1year">Last Year</Option>
        </Select>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3}>
        {kpiData.map((kpi, index) => (
          <Grid xs={12} sm={6} lg={3} key={index}>
            <KPICard {...kpi} />
          </Grid>
        ))}
      </Grid>

      {/* AI Insights */}
      <Card>
        <CardContent>
          <Typography level="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AssessmentIcon color="primary" />
            AI-Powered Insights
          </Typography>
          <Grid container spacing={2}>
            {predictiveInsights.map((insight, index) => (
              <Grid xs={12} md={6} key={index}>
                <Alert
                  color={getInsightColor(insight.type)}
                  variant="soft"
                  startDecorator={getInsightIcon(insight.type)}
                >
                  <Box>
                    <Typography level="body-sm" fontWeight="bold">
                      {insight.title}
                    </Typography>
                    <Typography level="body-xs" sx={{ mb: 1 }}>
                      {insight.description}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip size="sm" color="neutral" variant="outlined">
                        {insight.confidence}% confidence
                      </Chip>
                      <Chip size="sm" color={insight.impact === 'high' ? 'danger' : 'warning'} variant="soft">
                        {insight.impact} impact
                      </Chip>
                    </Stack>
                    <Typography level="body-xs" fontWeight="medium" sx={{ mt: 1 }}>
                      💡 {insight.recommendation}
                    </Typography>
                  </Box>
                </Alert>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as number)}>
            <TabList>
              <Tab><ShowChartIcon sx={{ mr: 1 }} />Trends</Tab>
              <Tab><PieChartIcon sx={{ mr: 1 }} />Categories</Tab>
              <Tab><BarChartIcon sx={{ mr: 1 }} />Performance</Tab>
            </TabList>

            {/* Trends Tab */}
            <TabPanel value={0}>
              <Stack spacing={3}>
                <Typography level="h4">Request & Completion Trends</Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="requests" fill="#8884d8" name="Requests" />
                      <Bar yAxisId="left" dataKey="completed" fill="#82ca9d" name="Completed" />
                      <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#ff7300" strokeWidth={3} name="Satisfaction" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Box>

                <Typography level="h4">Cost Trends</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                      <Area type="monotone" dataKey="cost" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Stack>
            </TabPanel>

            {/* Categories Tab */}
            <TabPanel value={1}>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <Typography level="h4" sx={{ mb: 2 }}>Request Distribution</Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {categoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography level="h4" sx={{ mb: 2 }}>Category Performance</Typography>
                  <Stack spacing={2}>
                    {categoryBreakdown.map((category) => (
                      <Card key={category.name} variant="outlined">
                        <CardContent>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography level="body-sm" fontWeight="bold">
                                {category.name}
                              </Typography>
                              <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                {category.value}% of requests
                              </Typography>
                            </Box>
                            <Stack alignItems="flex-end" spacing={0.5}>
                              <Typography level="body-sm" fontWeight="bold">
                                ${category.cost.toLocaleString()}
                              </Typography>
                              <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                {category.avgTime}h avg
                              </Typography>
                            </Stack>
                          </Stack>
                          <LinearProgress
                            determinate
                            value={category.value}
                            sx={{ mt: 1 }}
                            color="primary"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Performance Tab */}
            <TabPanel value={2}>
              <Stack spacing={3}>
                <Typography level="h4">Performance Metrics</Typography>
                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography level="h4" sx={{ mb: 2 }}>Response Time by Category</Typography>
                        <Stack spacing={2}>
                          {categoryBreakdown.map((category) => (
                            <Box key={category.name}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography level="body-sm">{category.name}</Typography>
                                <Typography level="body-sm">{category.avgTime}h</Typography>
                              </Box>
                              <LinearProgress
                                determinate
                                value={(category.avgTime / 5) * 100}
                                color={category.avgTime < 2 ? 'success' : category.avgTime < 3 ? 'warning' : 'danger'}
                              />
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography level="h4" sx={{ mb: 2 }}>Cost Optimization</Typography>
                        <Stack spacing={2}>
                          <Alert color="success" variant="soft">
                            <Typography level="body-sm" fontWeight="bold">Bundling Savings</Typography>
                            <Typography level="body-xs">
                              Smart bundling could reduce costs by 25%
                            </Typography>
                          </Alert>
                          <Alert color="primary" variant="soft">
                            <Typography level="body-sm" fontWeight="bold">Bulk Materials</Typography>
                            <Typography level="body-xs">
                              Bulk pricing could save 15% on materials
                            </Typography>
                          </Alert>
                          <Alert color="warning" variant="soft">
                            <Typography level="body-sm" fontWeight="bold">Preventive Maintenance</Typography>
                            <Typography level="body-xs">
                              Could reduce emergency repairs by 30%
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
