import Marquee from "react-fast-marquee";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

function MarqueeBanner() {
  return (
    <>
      <Box>
        <Marquee speed={50} gradient={false}>
          <Typography variant="h6" sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            🎉 Welcome to our shopping cart! Enjoy exclusive deals and offers 🛒
          </Typography>
        </Marquee>
      </Box>

    </>
  );
}

export default MarqueeBanner;