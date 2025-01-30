const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const REDIRECT_URI = window.location.origin + '/google-callback';

export const initiateGoogleLogin = (type = 'login') => {
  // State'e login veya register bilgisini ekleyelim
  const state = btoa(JSON.stringify({ type }));
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=email profile&state=${state}&prompt=select_account`;
  
  // Aynı sekmede Google'a yönlendir
  window.location.href = googleAuthUrl;
};

export const handleGoogleCallback = () => {
  // URL'den token ve state bilgisini al
  const params = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = params.get('access_token');
  const state = params.get('state');
  
  if (accessToken && state) {
    try {
      const { type } = JSON.parse(atob(state));
      return {
        accessToken,
        type
      };
    } catch (error) {
      console.error('State parsing error:', error);
      return null;
    }
  }
  
  return null;
}; 