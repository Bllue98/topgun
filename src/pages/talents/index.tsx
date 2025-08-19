// ** MUI Imports
import Grid from '@mui/material/Grid'
import TalentManager from 'src/views/dashboards/talents/TalentManager'
import RarityManager from 'src/views/dashboards/talents/RarityManager'

const Talent = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TalentManager />
        <RarityManager />
      </Grid>
    </Grid>
  )
}

export default Talent
