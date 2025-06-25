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
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'

interface BundleForDispatch {
  id: string
  name: string
  workOrders: Array<{
    id: string
    assetId: string
    assetName: string
    assetType: string
    priority: string
  }>
  serviceArea: string
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
    setSuccessMessage(`Successfully dispatched bundle: ${dispatchedBundle?.name || 'Unknown'}!`)
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
    
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
                         bgcolor: 'primary.softBg', 
                         p: 2, 
                         borderRadius: 'sm',
                         border: '1px solid',
                         borderColor: 'primary.outlinedBorder'
                       }}>
                         <Stack direction="row" spacing={3} alignItems="center">
                           <Box>
                             <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                               Work Orders
                             </Typography>
                             <Typography level="title-sm" fontWeight="bold">
                               {bundle.workOrders.length}
                             </Typography>
                           </Box>
                           <Box>
                             <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                               Service Area
                             </Typography>
                             <Typography level="title-sm" fontWeight="bold">
                               {bundle.serviceArea}
                             </Typography>
                           </Box>
                           <Box>
                             <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                               Status
                             </Typography>
                             <Typography level="title-sm" fontWeight="bold" sx={{ color: 'success.main' }}>
                               Ready
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
                                   {wo.priority} priority
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