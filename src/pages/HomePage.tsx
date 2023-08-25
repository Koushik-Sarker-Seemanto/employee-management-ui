import { Button, Grid, Typography } from '@mui/material';
import HomeSection from '../sections/Home/HomeSection';

const HomePage = () => {
  return (
    <Grid container sx={{ p: 4 }} display={'flex'} justifyContent={'center'}>
      <HomeSection />
    </Grid>
  );
};

export default HomePage;
