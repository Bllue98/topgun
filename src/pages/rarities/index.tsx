import Grid from '@mui/material/Grid'
import RarityManager from 'src/views/dashboards/talents/RarityManager'

const RaritiesPage = () => (
  <Grid container spacing={6}>
    <Grid item xs={12}>
      <RarityManager />
    </Grid>
  </Grid>
)

export default RaritiesPage
