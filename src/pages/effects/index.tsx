import Grid from '@mui/material/Grid'
import EffectsManager from 'src/views/dashboards/talents/EffectManager'

const EffectsPage = () => (
  <Grid container spacing={6}>
    <Grid item xs={12}>
      <EffectsManager />
    </Grid>
  </Grid>
)

export default EffectsPage
