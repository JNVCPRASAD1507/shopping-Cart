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
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const ProductCard = ({ data, addToCart }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(0);
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

  return (
    <Card
      sx={{
        width: { xs: 180, sm: 220, md: 230, lg: 240 },
      
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "#fff",
        boxShadow: 3,
        borderRadius: 3,
        m: 1,
        transition: "box-shadow 0.2s",
        '&:hover': { boxShadow: 6 },
      }}
    >
      <CardMedia
        component="img"
        image={data.mobileImage || placeholderImage}
        alt={data.name || "Product image"}
        sx={{
          height: 130,
          width: "100%",
          objectFit: "contain",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          backgroundColor: "#f5f5f5",
          // p: 1,
        }}
      />

      <CardContent
        sx={{
          px: 1,
          pb: 1,
          pt: 0.5,
          width: "100%",
          textAlign: "center",
          flexGrow: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "15px",
            fontWeight: 600,
            mb: 0.5,
            color: "text.primary",
          }}
        >
          {data.name}
        </Typography>
        <Typography
          color="text.secondary"
          fontSize="14px"
          fontWeight={500}
          mb={1}
        >
          ₹{data.price}
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={1}
          gap={1}
        >
          <IconButton
            onClick={handleDecrement}
            color="primary"
            size="small"
            aria-label="Decrease quantity"
            disabled={quantity === 0}
            sx={{
              bgcolor: "grey.100",
              '&:disabled': {
                opacity: 0.4,
                cursor: "not-allowed",
              },
            }}
          >
            <Remove fontSize="small" />
          </IconButton>
          <Typography fontSize="15px" fontWeight={600}>
            {quantity}
          </Typography>
          <IconButton
            onClick={handleIncrement}
            color="primary"
            size="small"
            aria-label="Increase quantity"
            sx={{ bgcolor: "grey.100" }}
          >
            <Add fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddToCart}
        sx={{
          fontSize: "14px",
          py: 1,
          width: "90%",
          mb: 1.5,
          borderRadius: 2,
          boxShadow: 1,
        }}
        disabled={quantity === 0}
        aria-label="Add to Cart"
      >
        Add to Cart
      </Button>
    </Card>
  );
};

export default ProductCard;
