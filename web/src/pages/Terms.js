import { Box, Container, Typography } from '@mui/material';

const Terms = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Kullanım Koşulları
        </Typography>
        <Typography variant="body1" paragraph>
          Son güncellenme: {new Date().toLocaleDateString()}
        </Typography>
        <Typography variant="body1" paragraph>
          Bu web sitesini kullanarak, aşağıdaki kullanım koşullarını kabul etmiş olursunuz.
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Hesap Oluşturma ve Güvenlik
        </Typography>
        <Typography variant="body1" paragraph>
          - Sitemizde hesap oluşturmak için doğru ve güncel bilgiler sağlamalısınız
          - Hesap güvenliğinizden siz sorumlusunuz
          - Hesabınızla ilgili şüpheli bir durum fark ederseniz bize bildirmelisiniz
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Kullanım Kuralları
        </Typography>
        <Typography variant="body1" paragraph>
          - Sitemizi yasal amaçlar için kullanmalısınız
          - Başkalarının haklarına saygı göstermelisiniz
          - Zararlı içerik paylaşımı yasaktır
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          İçerik ve Telif Hakkı
        </Typography>
        <Typography variant="body1" paragraph>
          - Paylaştığınız içeriklerden siz sorumlusunuz
          - Başkalarının telif haklarına saygı göstermelisiniz
          - Size ait olmayan içerikleri paylaşırken kaynak belirtmelisiniz
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Hizmet Değişiklikleri
        </Typography>
        <Typography variant="body1" paragraph>
          - Hizmetlerimizde değişiklik yapma hakkını saklı tutarız
          - Önemli değişiklikler hakkında kullanıcılarımızı bilgilendiririz
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Sorumluluk Reddi
        </Typography>
        <Typography variant="body1" paragraph>
          - Hizmetlerimizi "olduğu gibi" sunuyoruz
          - Kesintisiz hizmet garantisi vermiyoruz
          - Kullanıcı içeriklerinden sorumlu değiliz
        </Typography>
      </Box>
    </Container>
  );
};

export default Terms; 