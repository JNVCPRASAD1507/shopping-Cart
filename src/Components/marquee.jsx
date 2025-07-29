import Marquee from "react-fast-marquee";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

const MarqueeBanner = () => {
  return (
    <Box sx={{ width: '100%',  gradient: 'linear-gradient(to right, #195046ff, #2c355bff)', py: { xs: 1, sm: 1.5 }, px: { xs: 1, sm: 2 } }}>
      <Marquee speed={40} gradient={false} pauseOnHover style={{ width: '100%' }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
            fontWeight: 'bold',
            color: 'black',
            letterSpacing: 1,
            whiteSpace: 'nowrap',
           
          }}
        >
          🎉 Welcome to our shopping cart! Enjoy exclusive deals and offers 🛒
        </Typography>
      </Marquee>
    </Box>
  );
}

export default MarqueeBanner;