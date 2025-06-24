import { useState } from 'react'
import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Option,
  Button,
  Chip,
  Alert,
  Box,
  Divider,
} from '@mui/joy'
import { AutoFixHigh as AutoFixHighIcon, LocationOn as LocationIcon } from '@mui/icons-material'

interface MaintenanceRequestModalProps {
  open: boolean
  onClose: () => void
}

const aiSuggestions = [
  'Based on similar issues, this typically takes 2-3 hours to resolve',
  'Recommended contractor: ABC Plumbing (98% success rate)',
  'Best time to schedule: Tuesday morning (lowest disruption)',
  'Estimated cost: $150-$250 based on historical data',
]

export default function MaintenanceRequestModal({ open, onClose }: MaintenanceRequestModalProps) {
  const [formData, setFormData] = useState({
    property: '',
    category: '',
    priority: '',
    description: '',
    location: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Maintenance request submitted:', formData)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ width: 600, maxWidth: '90vw' }}>
        <ModalClose />
        <Typography level="h4" sx={{ mb: 2 }}>
          Create Maintenance Request
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
              <FormControl sx={{ flex: 1 }}>
                <FormLabel>Property</FormLabel>
                <Select
                  placeholder="Select property"
                  value={formData.property}
                  onChange={(_, value) => setFormData({ ...formData, property: value || '' })}
                >
                  <Option value="sunset-apartments">Sunset Apartments</Option>
                  <Option value="oak-street-complex">Oak Street Complex</Option>
                  <Option value="downtown-plaza">Downtown Plaza</Option>
                  <Option value="riverside-towers">Riverside Towers</Option>
                </Select>
              </FormControl>
              
              <FormControl sx={{ flex: 1 }}>
                <FormLabel>Category</FormLabel>
                <Select
                  placeholder="Select category"
                  value={formData.category}
                  onChange={(_, value) => setFormData({ ...formData, category: value || '' })}
                >
                  <Option value="plumbing">Plumbing</Option>
                  <Option value="electrical">Electrical</Option>
                  <Option value="hvac">HVAC</Option>
                  <Option value="appliances">Appliances</Option>
                  <Option value="structural">Structural</Option>
                  <Option value="other">Other</Option>
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={2}>
              <FormControl sx={{ flex: 1 }}>
                <FormLabel>Priority</FormLabel>
                <Select
                  placeholder="Select priority"
                  value={formData.priority}
                  onChange={(_, value) => setFormData({ ...formData, priority: value || '' })}
                >
                  <Option value="low">
                    <Chip size="sm" color="neutral" variant="soft">Low</Chip>
                  </Option>
                  <Option value="medium">
                    <Chip size="sm" color="warning" variant="soft">Medium</Chip>
                  </Option>
                  <Option value="high">
                    <Chip size="sm" color="danger" variant="soft">High</Chip>
                  </Option>
                  <Option value="emergency">
                    <Chip size="sm" color="danger">Emergency</Chip>
                  </Option>
                </Select>
              </FormControl>
              
              <FormControl sx={{ flex: 1 }}>
                <FormLabel>Location</FormLabel>
                <Input
                  placeholder="e.g., Unit 204, Basement, Roof"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  startDecorator={<LocationIcon />}
                />
              </FormControl>
            </Stack>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Describe the maintenance issue in detail..."
                minRows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </FormControl>

            {formData.category && (
              <>
                <Divider />
                <Box>
                  <Typography level="body-sm" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AutoFixHighIcon color="primary" />
                    AI Insights for {formData.category} issues
                  </Typography>
                  <Stack spacing={1}>
                    {aiSuggestions.map((suggestion, index) => (
                      <Alert key={index} color="primary" variant="soft" size="sm">
                        <Typography level="body-xs">{suggestion}</Typography>
                      </Alert>
                    ))}
                  </Stack>
                </Box>
              </>
            )}

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formData.property || !formData.category || !formData.description}>
                Create Request
              </Button>
            </Stack>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  )
} 