import Grid from '@mui/material/Grid'
import CostsManager from 'src/views/dashboards/talents/CostManager'

const CostsPage = () => (
  <Grid container spacing={6}>
    <Grid item xs={12}>
      <CostsManager />
    </Grid>
  </Grid>
)

export default CostsPage
