import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const ProductCard = ({ data, addToCart }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(0);
  const isMobile = useMediaQuery("(max-width:600px)");
  const placeholderImage = "https://via.placeholder.com/150";

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => quantity > 0 && setQuantity(quantity - 1);

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart({ ...data, quantity });
      setQuantity(0);
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [navigate]);

  // For 3 cards per row on mobile, set width to 32% (with gap/margin)
  return (
    <Box
      sx={{
        width: { xs: '32%', sm: 220, md: 230, lg: 240 },
        minWidth: { xs: '100px', sm: 0 },
        maxWidth: { xs: 'none', sm: 220 },
        aspectRatio: '3 / 4',
        mx: { xs: '1%', sm: 1 },
        mb: { xs: 2, sm: 0 },
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      <Card
        tabIndex={0}
        role="region"
        aria-label={`Product card: ${data.name}`}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: "#fff",
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          '&:hover': {
            boxShadow: 6,
          },
          '&:focus-visible': {
            outline: "2px solid #1976d2",
            outlineOffset: 2,
          },
        }}
      >
        <CardMedia
          component="img"
          image={data.mobileImage || placeholderImage}
          alt={data.name || "Product Image"}
          sx={{
            width: '100%',
            height: { xs: 60, sm: 90, md: 110 },
            aspectRatio: '3 / 2',
            objectFit: 'contain',
            backgroundColor: '#f5f5f5',
            mt: { xs: 1, sm: 0 },
          }}
        />

        <CardContent
          sx={{
            px: { xs: 0.5, sm: 2 },
            py: { xs: 1, sm: 1.5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexGrow: 1,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={600}
            fontSize={{ xs: '11px', sm: '13px', md: '14px' }}
            color="text.primary"
            noWrap
            aria-label={`Product Name: ${data.name}`}
          >
            {data.name}
          </Typography>

          <Typography
            variant="body2"
            fontWeight={500}
            fontSize={{ xs: '11px', sm: '13px', md: '14px' }}
            color="text.secondary"
            mt={0.5}
            aria-label={`Price: ₹${data.price}`}
          >
            ₹{data.price}
          </Typography>

          {/* Quantity Controls */}
          <Box
            mt={1.2}
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={0.5}
            role="group"
            aria-label={`Quantity controls for ${data.name}`}
          >
            <IconButton
              onClick={handleDecrement}
              aria-label="Decrease quantity"
              disabled={quantity === 0}
              size="small"
              sx={{
                bgcolor: 'grey.100',
                width: { xs: 22, sm: 28, md: 32 },
                height: { xs: 22, sm: 28, md: 32 },
                '&:disabled': {
                  opacity: 0.4,
                  cursor: 'not-allowed',
                },
              }}
            >
              <Remove fontSize="inherit" />
            </IconButton>

            <Typography
              component="span"
              fontWeight={600}
              fontSize={{ xs: '12px', sm: '14px', md: '15px' }}
              aria-live="polite"
              aria-atomic="true"
              width="22px"
              textAlign="center"
            >
              {quantity}
            </Typography>

            <IconButton
              onClick={handleIncrement}
              aria-label="Increase quantity"
              size="small"
              sx={{
                bgcolor: 'grey.100',
                width: { xs: 22, sm: 28, md: 32 },
                height: { xs: 22, sm: 28, md: 32 },
              }}
            >
              <Add fontSize="inherit" />
            </IconButton>
          </Box>
        </CardContent>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          disabled={quantity === 0}
          sx={{
            width: { xs: '90%', sm: '90%' },
            alignSelf: 'center',
            mb: { xs: 1, sm: 1.2 },
            fontSize: { xs: '11px', sm: '13px', md: '14px' },
            py: { xs: 0.7, sm: 1 },
            borderRadius: 2,
            boxShadow: 2,
            textTransform: 'capitalize',
          }}
          aria-label={`Add ${quantity} ${data.name} to cart`}
        >
          Add
        </Button>
      </Card>
    </Box>
  );
};

export default ProductCard;
