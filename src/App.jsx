import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Badge, Container, Typography, Box, Grid, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Card from "./Components/comp";
import { data } from "./Products/Cards";
import CartPage from "./Components/cartpage";
import Carousel from "./Components/carousel";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import PrivateRoute from "./Components/PrivateRoute";
import Marquee from "./Components/marquee";

const App = () => {
  const [cart, setCart] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");
  const [hasSignedUp, setHasSignedUp] = useState(localStorage.getItem("hasSignedUp") === "true");
  const navigate = useNavigate();
  const location = useLocation();

  const hideAppBar = location.pathname === "/signin" || location.pathname === "/";

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (id, newQuantity) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      );
    } else {
      setCart([...cart, item]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("cart");
    setIsAuthenticated(false);
    setCart([]);
    navigate("/signin");
  };

  const handleSignUpSuccess = () => {
    setHasSignedUp(true);
    localStorage.setItem("hasSignedUp", "true");
    navigate("/productPage");
  };

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      {!hideAppBar && (
        <AppBar
          position="absolute"
          sx={{
            background: "linear-gradient(to right, #195046ff, #2c355bff)",
            color: "#000", // or "#111" for better contrast
          }}
        >
          <Toolbar>
            <Typography variant="h4" sx={{ flexGrow: 1 , color: "#fff"}}>
              My Cart
            </Typography>
            {isAuthenticated && location.pathname !== "/cart" && (
              <IconButton color="inherit" onClick={() => navigate("/cart")}>
                <Badge badgeContent={cart.length} color="error">
                <ShoppingCartIcon sx={{ fontSize: 25, color: "white" }} />
                </Badge>
              </IconButton>
            )}

            {isAuthenticated && (
              <Button color="inherit" variant="h6" onClick={handleLogout} sx={{ ml: 2 , color: "#fff"}}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      )}

      <Container sx={{ mt: 7, width: "100%" }}>
        <Routes>
          {/* Redirect to signup if not authenticated */}
          <Route path="/" element={!isAuthenticated && !hasSignedUp ? <SignUp onSignUpSuccess={handleSignUpSuccess} /> : <Navigate to="/productPage" />} />

          {/* SignIn Route */}
          <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/productPage" element={
              <>
                <Box sx={{ width: "100%" }}>
                  <Marquee />
                </Box>
                <Box sx={{ width: "100%", mb: { xs: 1, sm: 2, md: 2 } }}>
                  <Carousel />
                </Box>
                <Grid container spacing={{ xs: 1, sm: 1, md: 1, lg: 1 }} justifyContent="center" sx={{ mt: { xs: 0, sm: 0, md: -2 } }}>
                  {data.map((item) => (
                    <Grid item xs={4} sm={4} md={3} lg={3} key={item._id} display="flex" justifyContent="center">
                      <Card data={item} addToCart={addToCart} />
                    </Grid>
                  ))}
                </Grid>
              </>
            } />

            <Route path="/cart" element={
              isAuthenticated ? (
                <CartPage
                  cart={cart}
                  updateQuantity={(id, quantity) => quantity > 0 ? updateQuantity(id, quantity) : removeItem(id)}
                  removeItem={removeItem}
                />
              ) : (
                <Navigate to="/signin" />
              )
            } />
          </Route>

        </Routes>

      </Container>
    </Box>
  );
};

export default App;
