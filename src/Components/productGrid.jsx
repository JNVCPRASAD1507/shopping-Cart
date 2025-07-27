import React, { useState } from "react";
import { Grid2 } from "@mui/material";
import ProductCard from "./ProductCard"; // Adjust path as needed
import { data } from "./Products/Cards"; // Your actual products array

const ProductGrid = () => {
  const [products, setProducts] = useState(data);

  const addToCart = (item) => {
    console.log("Added to cart:", item);
    // Add to cart logic here (store in state or context)
  };

  return (
    <Grid2 container spacing={3}>
      {products.map((product, index) => (
        <Grid2 item xs={4} sm={3} md={3} lg={2} key={index}>
          <ProductCard data={product} addToCart={addToCart} />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default ProductGrid;
