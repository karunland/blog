import { Box, Container, Typography } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Gizlilik Politikası
        </Typography>
        <Typography variant="body1" paragraph>
          Son güncellenme: {new Date().toLocaleDateString()}
        </Typography>
        <Typography variant="body1" paragraph>
          Bu gizlilik politikası, web sitemizin nasıl bilgi topladığını, kullandığını ve koruduğunu açıklar.
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Toplanan Bilgiler
        </Typography>
        <Typography variant="body1" paragraph>
          Sitemizi kullandığınızda, aşağıdaki bilgileri toplayabiliriz:
          - Adınız ve e-posta adresiniz
          - Google hesap bilgileriniz (Google ile giriş yaptığınızda)
          - Kullanım istatistikleri ve log kayıtları
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Bilgilerin Kullanımı
        </Typography>
        <Typography variant="body1" paragraph>
          Topladığımız bilgileri şu amaçlarla kullanırız:
          - Hesabınızı yönetmek
          - Hizmetlerimizi iyileştirmek
          - Size daha iyi bir deneyim sunmak
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Bilgi Güvenliği
        </Typography>
        <Typography variant="body1" paragraph>
          Bilgilerinizin güvenliği bizim için önemlidir. Verilerinizi korumak için uygun güvenlik önlemlerini alıyoruz.
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          İletişim
        </Typography>
        <Typography variant="body1" paragraph>
          Gizlilik politikamızla ilgili sorularınız için bizimle iletişime geçebilirsiniz.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy; 