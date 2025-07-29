import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CartPage = ({ cart, updateQuantity, removeItem }) => {
  const overallTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box sx={{ my: 8, px: { xs: 2, sm: 4 }, backgroundColor: "#f4f4f4" }}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button variant="outlined" sx={{ my: 2, }}>
          ⬅ Back To Home
        </Button>
      </Link>

      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      {cart.length === 0 ? (
        <Typography variant="h6">Your cart is empty.</Typography>
      ) : (
        <>
          {isMobile ? (
            // Mobile view: Card layout
            <Grid container spacing={2}>
              {cart.map((item) => (
                <Grid item xs={12} key={item._id}>
                  <Card>
                    <Grid container>
                      <Grid item xs={4}>
                        <CardMedia
                          component="img"
                          image={item.mobileImage}
                          alt={item.name}
                          sx={{ height: "100%", objectFit: "cover" }}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <CardContent>
                          <Typography variant="subtitle1">{item.name}</Typography>
                          <Typography variant="body2">
                            Price: ${item.price.toFixed(2)}
                          </Typography>
                          <Typography variant="body2">
                            Total: ${(item.price * item.quantity).toFixed(2)}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 1,
                              gap: 1,
                            }}
                          >
                            <Button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              variant="contained"
                              size="small"
                            >
                              -
                            </Button>
                            <Typography>{item.quantity}</Typography>
                            <Button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              variant="contained"
                              size="small"
                            >
                              +
                            </Button>
                            <IconButton
                              onClick={() => removeItem(item._id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            // Desktop/tablet view: Table layout
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table aria-label="cart table">
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <img
                          src={item.mobileImage}
                          alt={item.name}
                          style={{ width: "80px", height: "auto" }}
                        />
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            variant="contained"
                          >
                            -
                          </Button>
                          <Typography>{item.quantity}</Typography>
                          <Button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            variant="contained"
                          >
                            +
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => removeItem(item._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Overall total */}
      {cart.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">
            Overall Total: ${overallTotal.toFixed(2)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CartPage;
