import React, { useState, useEffect, useRef } from "react";
import { Data } from "../Products/Cards";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const autoplay = true;
  const startX = useRef(null);

  useEffect(() => {
    const storedSlides = localStorage.getItem("slides");
    if (storedSlides) {
      setSlides(JSON.parse(storedSlides));
    } else {
      localStorage.setItem("slides", JSON.stringify(Data));
      setSlides(Data);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Autoplay
  useEffect(() => {
    if (!autoplay || slides.length === 0) return;
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearTimeout(timer);
  }, [autoplay, current, slides]);

  const goToPrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    if (endX - startX.current > 50) goToPrev();
    if (startX.current - endX > 50) goToNext();
    startX.current = null;
  };

  if (!slides.length) return null;

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 220, sm: 350, md: 450, lg: 500 },
        mb: 4,
        position: "relative",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: 3
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Image */}
      <img
        src={slides[current].DeskImg || slides[current].MblImg || slides[current].mobileImage || slides[current].desktopImage}
        alt={slides[current].name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "all 0.5s ease-in-out"
        }}
      />

      {/* Prev Button */}
      <IconButton
        onClick={goToPrev}
        sx={{
          position: "absolute",
          top: "50%",
          left: 10,
          transform: "translateY(-50%)",
          bgcolor: "white",
          boxShadow: 2,
          zIndex: 2
        }}
        aria-label="Previous"
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      {/* Next Button */}
      <IconButton
        onClick={goToNext}
        sx={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
          bgcolor: "white",
          boxShadow: 2,
          zIndex: 2
        }}
        aria-label="Next"
      >
        <ArrowForwardIosIcon />
      </IconButton>

      {/* Indicators */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 1
        }}
      >
        {slides.map((_, idx) => (
          <Box
            key={idx}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: idx === current ? "primary.main" : "grey.400",
              cursor: "pointer",
              border: idx === current ? "2px solid white" : "none"
            }}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Carousel;
