// ** MUI Imports
import Grid from '@mui/material/Grid'
import RelatoryDialog from 'src/views/dashboards/relatory/RelatoryDialog'

// import RelatoryDialog from 'src/views/dashboards/relatory/RelatoryDialog'
import RelatoryZodForm from 'src/views/dashboards/relatory/RelatoryZodForm'

const Relatory = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <RelatoryDialog /> */}
        <RelatoryZodForm />
      </Grid>
    </Grid>
  )
}

export default Relatory
