// ** MUI Imports
import Grid from '@mui/material/Grid'
import ReportDialog from 'src/views/dashboards/report/ReportDialog'

const Report = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ReportDialog />
      </Grid>
    </Grid>
  )
}

export default Report
