import { useState, useEffect } from 'react'
import {
  Stack,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  Table,
  Avatar,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from '@mui/joy'
import {
  Send as SendIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Build as BuildIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'

interface BundleForDispatch {
  id: string
  name: string
  workOrders: Array<{
    id: string
    assetId: string
    assetName: string
    assetType: string
    estimatedCost: number
    estimatedDuration: number
    priority: string
  }>
  serviceArea: string
  totalCost: number
  savings: number
  savingsPercentage: number
  acceptedAt: string
  status: string
  createdFrom: string
  originalWoid?: string
  dispatchedAt?: string
}

export default function BundleDispatch() {
  const [availableBundles, setAvailableBundles] = useState<BundleForDispatch[]>([])
  const [dispatchedBundles, setDispatchedBundles] = useState<BundleForDispatch[]>([])
  const [activeTab, setActiveTab] = useState(0)

  // Load available bundles from localStorage
  const loadBundles = () => {
    const dispatchQueue = JSON.parse(localStorage.getItem('dispatchQueue') || '[]')
    const readyBundles = dispatchQueue.filter((bundle: BundleForDispatch) => 
      bundle.status === 'ready_for_dispatch'
    )
    const dispatched = dispatchQueue.filter((bundle: BundleForDispatch) => 
      bundle.status === 'dispatched'
    )
    setAvailableBundles(readyBundles)
    setDispatchedBundles(dispatched)
  }

  useEffect(() => {
    loadBundles()
  }, [])

  const dispatchBundle = (bundleId: string) => {
    // Update status of the specific bundle
    const dispatchQueue = JSON.parse(localStorage.getItem('dispatchQueue') || '[]')
    const updatedQueue = dispatchQueue.map((bundle: BundleForDispatch) => {
      if (bundle.id === bundleId) {
        return {
          ...bundle,
          status: 'dispatched',
          dispatchedAt: new Date().toISOString()
        }
      }
      return bundle
    })

    localStorage.setItem('dispatchQueue', JSON.stringify(updatedQueue))
    
    // Also update bundle history
    const bundleHistory = JSON.parse(localStorage.getItem('bundleHistory') || '[]')
    const updatedHistory = bundleHistory.map((bundle: BundleForDispatch) => {
      if (bundle.id === bundleId) {
        return {
          ...bundle,
          status: 'dispatched',
          dispatchedAt: new Date().toISOString()
        }
      }
      return bundle
    })
    localStorage.setItem('bundleHistory', JSON.stringify(updatedHistory))

    // Find the bundle name for the success message
    const dispatchedBundle = availableBundles.find(b => b.id === bundleId)
    alert(`Successfully dispatched bundle: ${dispatchedBundle?.name || 'Unknown'}!`)
    loadBundles() // Refresh the list
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'neutral'
    }
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography level="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <SendIcon color="primary" />
            Bundle Dispatch Center
          </Typography>
          <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
            Dispatch ready bundles to field teams and view dispatch history
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startDecorator={<RefreshIcon />}
          onClick={loadBundles}
        >
          Refresh
        </Button>
      </Box>

      {/* Tabs */}
      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as number)}>
            <TabList>
              <Tab>Ready for Dispatch ({availableBundles.length})</Tab>
              <Tab>Dispatched Bundles ({dispatchedBundles.length})</Tab>
            </TabList>

            {/* Ready for Dispatch Tab */}
            <TabPanel value={0}>

      

      {/* Available Bundles */}
      {availableBundles.length === 0 ? (
        <Alert color="neutral" variant="soft">
          <Typography level="body-sm">
            No bundles ready for dispatch. Create bundles using the Asset Bundle Generator to see them here.
          </Typography>
        </Alert>
      ) : (
                 <Grid container spacing={3}>
           {availableBundles.map((bundle) => (
             <Grid xs={12} lg={6} key={bundle.id}>
               <Card 
                 sx={{ 
                   height: '100%',
                   transition: 'all 0.2s ease',
                   border: '1px solid',
                   borderColor: 'divider',
                   '&:hover': {
                     borderColor: 'primary.main',
                     boxShadow: 'sm'
                   }
                 }}
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
                              {bundle.serviceArea}
                            </Chip>
                            <Chip size="sm" color="success" variant="soft">
                              Ready for Dispatch
                            </Chip>
                            <Chip size="sm" color="neutral" variant="outlined">
                              {bundle.workOrders.length} WOs
                            </Chip>
                          </Stack>
                        </Box>
                                                 <Avatar sx={{ bgcolor: 'success.main' }}>
                           <BuildIcon />
                         </Avatar>
                      </Box>

                      {/* Bundle Info */}
                      <Box sx={{ 
                        bgcolor: 'success.softBg', 
                        p: 2, 
                        borderRadius: 'sm',
                        border: '1px solid',
                        borderColor: 'success.outlinedBorder'
                      }}>
                        <Stack direction="row" spacing={3} alignItems="center">
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
                              Savings
                            </Typography>
                            <Typography level="title-sm" fontWeight="bold" sx={{ color: 'success.main' }}>
                              ${bundle.savings.toFixed(0)} ({bundle.savingsPercentage.toFixed(1)}%)
                            </Typography>
                          </Box>
                          <Box>
                            <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                              Duration
                            </Typography>
                            <Typography level="title-sm" fontWeight="bold">
                              {bundle.workOrders.reduce((sum, wo) => sum + wo.estimatedDuration, 0)}h
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      {/* Work Orders List */}
                      <Box>
                        <Typography level="body-sm" fontWeight="medium" sx={{ mb: 1 }}>
                          Work Orders in Bundle:
                        </Typography>
                                                 <List size="sm">
                           {bundle.workOrders.map((wo, idx) => (
                             <ListItem key={wo.id}>
                               <ListItemDecorator>
                                 <Chip 
                                   size="sm" 
                                   color={getPriorityColor(wo.priority)}
                                   variant="soft"
                                 >
                                   {idx + 1}
                                 </Chip>
                               </ListItemDecorator>
                               <ListItemContent>
                                 <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                   <Typography level="body-xs" fontWeight="medium">
                                     {wo.assetName} ({wo.assetType})
                                   </Typography>
                                   <Chip size="sm" variant="outlined" color="neutral">
                                     {wo.id}
                                   </Chip>
                                 </Stack>
                                 <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                   ${wo.estimatedCost} • {wo.estimatedDuration}h • {wo.priority} priority
                                 </Typography>
                               </ListItemContent>
                             </ListItem>
                           ))}
                         </List>
                      </Box>

                      {/* Bundle Metadata */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography level="body-xs">
                              Created: {new Date(bundle.acceptedAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          {bundle.originalWoid && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography level="body-xs">
                                From: {bundle.originalWoid}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                        
                                                 <Button 
                           size="sm" 
                           variant="solid"
                           color="primary"
                           startDecorator={<SendIcon />}
                           onClick={() => dispatchBundle(bundle.id)}
                         >
                           Dispatch
                         </Button>
                      </Box>
                    </Stack>
                  </CardContent>
                                 </Card>
               </Grid>
             ))}
         </Grid>
      )}

      
           </TabPanel>

           {/* Dispatched Bundles Tab */}
           <TabPanel value={1}>
             <Stack spacing={3}>
               {dispatchedBundles.length === 0 ? (
                 <Alert color="neutral" variant="soft">
                   <Typography level="body-sm">
                     No bundles have been dispatched yet.
                   </Typography>
                 </Alert>
               ) : (
                 <>
                   <Typography level="h4">Dispatched Bundles History</Typography>
                   <Table>
                     <thead>
                       <tr>
                         <th>Bundle Name</th>
                         <th>Service Area</th>
                         <th>Work Orders</th>
                         <th>Total Cost</th>
                         <th>Savings</th>
                         <th>Created</th>
                         <th>Dispatched</th>
                         <th>Status</th>
                       </tr>
                     </thead>
                     <tbody>
                       {dispatchedBundles.map((bundle) => (
                         <tr key={bundle.id}>
                           <td>
                             <Typography level="body-sm" fontWeight="medium">
                               {bundle.name}
                             </Typography>
                           </td>
                           <td>
                             <Typography level="body-sm">
                               {bundle.serviceArea}
                             </Typography>
                           </td>
                           <td>
                             <Typography level="body-sm">
                               {bundle.workOrders.length}
                             </Typography>
                           </td>
                           <td>
                             <Typography level="body-sm">
                               ${bundle.totalCost.toFixed(0)}
                             </Typography>
                           </td>
                           <td>
                             <Chip size="sm" color="success" variant="soft">
                               ${bundle.savings.toFixed(0)}
                             </Chip>
                           </td>
                           <td>
                             <Typography level="body-sm">
                               {new Date(bundle.acceptedAt).toLocaleDateString()}
                             </Typography>
                           </td>
                           <td>
                             <Typography level="body-sm">
                               {bundle.dispatchedAt ? new Date(bundle.dispatchedAt).toLocaleDateString() : 'N/A'}
                             </Typography>
                           </td>
                           <td>
                             <Chip size="sm" color="primary" variant="solid">
                               Dispatched
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