import { Container, Grid, Skeleton, Card, Box, Stack, useTheme } from '@mui/material';
import { BlogList } from '../components/blogList';

function BlogCardSkeleton() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      elevation={1}
      sx={{
        height: '100%',
        maxHeight: 420,
        display: 'flex',
        flexDirection: 'column',
        border: '0.8px solid transparent',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: isDark ? 'background.paper' : '#fff',
      }}
    >
      {/* Author Section */}
      <Box sx={{ p: 2, pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Skeleton 
          variant="circular" 
          width={40} 
          height={40}
          sx={{ 
            border: '2px solid',
            borderColor: 'primary.light',
            bgcolor: isDark ? 'grey.800' : 'grey.200'
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Skeleton 
            variant="text" 
            width={120} 
            sx={{ 
              transform: 'scale(1, 0.8)',
              bgcolor: isDark ? 'grey.800' : 'grey.200'
            }} 
          />
          <Skeleton 
            variant="text" 
            width={80} 
            sx={{ 
              transform: 'scale(1, 0.6)',
              bgcolor: isDark ? 'grey.800' : 'grey.200'
            }} 
          />
        </Box>
      </Box>

      {/* Image Section */}
      <Box sx={{ position: 'relative', height: 200, px: 1 }}>
        <Skeleton
          variant="rectangular"
          sx={{
            height: '100%',
            borderRadius: '24px',
            bgcolor: isDark ? 'grey.800' : 'grey.200'
          }}
          animation="wave"
        />
      </Box>

      {/* Title Section */}
      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Skeleton 
          variant="text" 
          sx={{ 
            transform: 'scale(1, 0.8)',
            mb: 0.5,
            bgcolor: isDark ? 'grey.800' : 'grey.200'
          }} 
        />
        <Skeleton 
          variant="text" 
          width="80%" 
          sx={{ 
            transform: 'scale(1, 0.8)',
            bgcolor: isDark ? 'grey.800' : 'grey.200'
          }} 
        />
      </Box>

      {/* Stats Bar */}
      <Box 
        sx={{ 
          px: 2,
          py: 1.5,
          borderTop: '1px solid',
          borderColor: isDark ? 'grey.800' : 'divider',
          mt: 'auto'
        }}
      >
        <Stack 
          direction="row" 
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Skeleton 
                variant="circular" 
                width={18} 
                height={18} 
                sx={{ bgcolor: isDark ? 'grey.800' : 'grey.200' }}
              />
              <Skeleton 
                variant="text" 
                width={20} 
                sx={{ 
                  transform: 'scale(1, 0.7)',
                  bgcolor: isDark ? 'grey.800' : 'grey.200'
                }} 
              />
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Skeleton 
                variant="circular" 
                width={18} 
                height={18} 
                sx={{ bgcolor: isDark ? 'grey.800' : 'grey.200' }}
              />
              <Skeleton 
                variant="text" 
                width={20} 
                sx={{ 
                  transform: 'scale(1, 0.7)',
                  bgcolor: isDark ? 'grey.800' : 'grey.200'
                }} 
              />
            </Stack>
          </Stack>
          <Skeleton 
            variant="rounded" 
            width={90} 
            height={24} 
            sx={{ 
              borderRadius: '16px',
              bgcolor: isDark ? 'grey.800' : 'grey.200'
            }} 
          />
        </Stack>
      </Box>
    </Card>
  );
}

export function Blog() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BlogList 
            SkeletonComponent={
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                    <BlogCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            }
          />
        </Grid>
      </Grid>
    </Container>
  );
}
