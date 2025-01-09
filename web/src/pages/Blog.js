
import { Container, Grid } from '@mui/material';
import { BlogList } from '../components/blogList';

export function Blog() {
    return <>
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <BlogList />
                </Grid>
            </Grid>
        </Container>
    </>
}
