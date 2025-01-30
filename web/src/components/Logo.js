import React from 'react';
import { useLottie } from 'lottie-react';
import appIconAnimation from '../assets/icon.json';
import { Box } from '@mui/material';

const Logo = ({ width = 100, showAnimation = true }) => {
  const options = {
    animationData: appIconAnimation,
    loop: true,
    autoplay: false,
  };

  const { View: LottieView, play, stop } = useLottie(options);

  if (!showAnimation) {
    return (
      <Box sx={{ width }}>
        {LottieView}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        marginLeft: 'auto',
        marginRight: 'auto',
        width,
        cursor: 'pointer',
        transition: 'width 0.3s ease'
      }}
      onMouseEnter={() => play()}
      onMouseLeave={() => stop()}
    >
      {LottieView}
    </Box>
  );
};

export default Logo; 