import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { data } from "../Products/Cards";
import ProductCard from "./comp";

// Group products by superCategory
const groupByCategory = (products) => {
  return products.reduce((acc, item) => {
    const cat = item.superCategory || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
};

const ProductSectionedGrid = ({ data = [], addToCart, selectedProduct }) => {
  let grouped = groupByCategory(data);
  // If a product is selected, only show its category and itself
  if (selectedProduct) {
    const cat = selectedProduct.superCategory || "Other";
    grouped = {
      [cat]: data.filter((item) => item._id === selectedProduct._id)
    };
  }
  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {Object.entries(grouped).map(([category, items]) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#1976d2" }}>
            {category}
          </Typography>
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid item xs={4} sm={3} md={2} key={item._id} display="flex" justifyContent="center">
                <ProductCard data={item} addToCart={addToCart} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default ProductSectionedGrid;
