import React, { useState, useEffect, useRef } from "react";
import { Data } from "../Products/Cards";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Carousel = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const autoplay = true;
  const startX = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedSlides = localStorage.getItem("slides");
    if (storedSlides) {
      setSlides(JSON.parse(storedSlides));
    } else {
      localStorage.setItem("slides", JSON.stringify(Data));
      setSlides(Data);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const currentSlide = slides[current];
  const imageUrl = isMobile
    ? currentSlide.MblImg || currentSlide.mobileImage
    : currentSlide.DeskImg || currentSlide.desktopImage;

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 220, sm: 350, md: 450, lg: 500 },
        mb: 4,
        position: "relative",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: 3,
        cursor: "pointer"
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - box.left;
        if (x < box.width * 0.3) {
          goToPrev();
        } else if (x > box.width * 0.7) {
          goToNext();
        }
      }}
    >
      {/* Slide Image */}
      <img
        src={imageUrl}
        alt={currentSlide && currentSlide.name ? currentSlide.name : "slide"}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "all 0.5s ease-in-out"
        }}
      />

      {/* Slide Indicators */}
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
              width: 10,
              height: 8,
              borderRadius: "50%",
              bgcolor: idx === current ? "black" : "white",
              cursor: "pointer",
              border: idx === current ? "2px solid white" : "none",
              transition: "all 0.3s ease"
            }}
            onClick={(event) => {
              event.stopPropagation();
              setCurrent(idx);
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Carousel;
