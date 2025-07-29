import React, { useState, useEffect, useMemo, useRef, useCallback, Suspense, lazy } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Badge, Container, Typography, Box, Grid, Button, Collapse, Fade } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import Card from "./Components/comp";
import { data } from "./Products/Cards";


const CartPage = lazy(() => import("./Components/cartpage"));
const Carousel = lazy(() => import("./Components/carousel"));
const SignIn = lazy(() => import("./Components/SignIn"));
const SignUp = lazy(() => import("./Components/SignUp"));
const PrivateRoute = lazy(() => import("./Components/PrivateRoute"));
const MarqueeBanner = lazy(() => import("./Components/marquee"));
const ProductSectionedGrid = lazy(() => import("./Components/ProductSectionedGrid"));

const App = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedProduct, setSelectedProduct] = useState(null); // Initialize selectedProduct
  const searchInputRef = useRef();
  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);
  // Splash screen effect
  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1700);
    return () => clearTimeout(timer);
  }, []);
  // Get unique superCategories for filter bar
  const categories = useMemo(() => {
    const cats = data.map((item) => item.superCategory || "Other");
    return ["All", ...Array.from(new Set(cats))];
  }, []);

  // Filter data by selected category, search, or selected product
  const filteredData = useMemo(() => {
    if (selectedProduct) {
      return data.filter((item) => item._id === selectedProduct._id);
    }
    let filtered = data;
    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.superCategory === selectedCategory);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(s) ||
        (item.category && item.category.toLowerCase().includes(s)) ||
        (item.superCategory && item.superCategory.toLowerCase().includes(s))
      );
    }
    return filtered;
  }, [selectedCategory, search, selectedProduct]);

  // Search suggestions (top 5 matches by name)
  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const s = search.trim().toLowerCase();
    return data.filter((item) =>
      item.name.toLowerCase().includes(s)
    ).slice(0, 5);
  }, [search]);

  // Keyboard navigation for suggestions
  const handleSearchKeyDown = useCallback((e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        setSearch(suggestions[highlightedIndex].name);
        setSelectedProduct(suggestions[highlightedIndex]); // Set selected product on Enter
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        searchInputRef.current && searchInputRef.current.blur();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  }, [showSuggestions, suggestions, highlightedIndex]);
  // If user edits search, clear selectedProduct
  useEffect(() => {
    setSelectedProduct(null);
  }, [search]);
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
  <Box sx={{ width: '100%', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
    {/* Splash Screen */}
    {showSplash && (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'linear-gradient(120deg, #195046 0%, #2c355b 100%)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          transition: 'opacity 0.7s',
          opacity: showSplash ? 1 : 0,
        }}
      >
        <Box
          component="img"
          src="/Playful 3D Logo with Red, Orange, and Yellow.png"
          alt="JNV Supermart Logo Splash"
          sx={{
            height: { xs: 110, sm: 150 },
            width: 'auto',
            mb: 2,
            borderRadius: 2,
            boxShadow: '0 8px 32px 0 rgba(44,53,91,0.25)',
            animation: 'splashLogoPop 1.1s cubic-bezier(0.4,0,0.2,1)',
            '@keyframes splashLogoPop': {
              '0%': { opacity: 0, transform: 'scale(0.7) rotate(-10deg)' },
              '60%': { opacity: 1, transform: 'scale(1.08) rotate(3deg)' },
              '100%': { opacity: 1, transform: 'scale(1) rotate(0)' }
            }
          }}
        />
        <Typography
          variant="h3"
          sx={{
            color: 'whitesmoke',
            fontWeight: 900,
            fontSize: { xs: '2rem', sm: '2.7rem' },
            letterSpacing: 2,
            textShadow: '0 4px 16px #19504699, 0 2px 0 #fff',
            background: 'linear-gradient(90deg, #ffe082 10%, #ff7043 60%, #2c355bff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'splashTextPop 1.2s 0.15s cubic-bezier(0.4,0,0.2,1) both',
            '@keyframes splashTextPop': {
              '0%': { opacity: 0, transform: 'translateY(-40px) scale(0.8)' },
              '60%': { opacity: 1, transform: 'translateY(8px) scale(1.06)' },
              '100%': { opacity: 1, transform: 'translateY(0) scale(1)' }
            }
          }}
        >
          JNV Super Mart
        </Typography>
      </Box>
    )}
    {/* Main App Content */}
    <Box sx={{ opacity: showSplash ? 0 : 1, transition: 'opacity 0.7s', pointerEvents: showSplash ? 'none' : 'auto' }}>
      {!hideAppBar && (
        <AppBar
          position="fixed"
          sx={{
            background: "linear-gradient(to right, #195046ff, #2c355bff)",
            color: "#fff",
            boxShadow: 2,
            zIndex: 1201
          }}
        >
          <Toolbar sx={{ px: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Box
                component="img"
                src="/Playful 3D Logo with Red, Orange, and Yellow.png"
                alt="JNV Supermart Logo"
                sx={{
                  height: { xs: 36, sm: 44 },
                  width: 'auto',
                  mr: 1,
                  borderRadius: 1,
                  boxShadow: '0 4px 16px 0 rgba(44,53,91,0.18)',
                  background: 'linear-gradient(135deg, #ffe082 0%, #ff7043 100%)',
                  animation: 'logoTextPop 1.1s cubic-bezier(0.4,0,0.2,1)',
                  '@keyframes logoTextPop': {
                    '0%': { opacity: 0, transform: 'translateX(-40px) scale(0.7)' },
                    '60%': { opacity: 1, transform: 'translateX(8px) scale(1.08)' },
                    '100%': { opacity: 1, transform: 'translateX(0) scale(1)' }
                  }
                }}
              />
              <Box
                sx={{
                  display: 'inline-block',
                  ml: 0.5,
                  animation: 'logoTextPopText 1.2s 0.15s cubic-bezier(0.4,0,0.2,1) both',
                  '@keyframes logoTextPopText': {
                    '0%': { opacity: 0, transform: 'translateY(-30px) scale(0.8)' },
                    '60%': { opacity: 1, transform: 'translateY(6px) scale(1.06)' },
                    '100%': { opacity: 1, transform: 'translateY(0) scale(1)' }
                  }
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: 'whitesmoke',
                    fontWeight: 900,
                    fontSize: { xs: '1.3rem', sm: '1.7rem' },
                    letterSpacing: 1,
                    textShadow: '0 2px 8px #19504699, 0 1px 0 #fff',
                    background: 'linear-gradient(90deg, #ffe082 10%, #ff7043 60%, #2c355bff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    transition: 'color 0.3s',
                  }}
                  tabIndex={0}
                  aria-label="JNV Super Mart Home"
                >
                  JNV Super Mart
                </Typography>
              </Box>
            </Box>
            {/* Search Icon and Animated Search Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: { xs: 'center', sm: 'flex-end' }, minWidth: 0, mx: 2 }}>
              <Fade in={!showSearchBar} unmountOnExit>
                <IconButton
                  color="inherit"
                  aria-label="Open search"
                  onClick={() => { setShowSearchBar(true); setTimeout(() => searchInputRef.current && searchInputRef.current.focus(), 200); }}
                  sx={{ ml: 1 }}
                >
                  <SearchIcon sx={{ fontSize: 26, color: '#fff' }} />
                </IconButton>
              </Fade>
              <Collapse in={showSearchBar} orientation="horizontal" sx={{ width: showSearchBar ? { xs: 1, sm: 320, md: 400 } : 0, minWidth: 0, transition: 'width 300ms cubic-bezier(0.4,0,0.2,1)' }}>
                <Box sx={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value);
                      setShowSuggestions(true);
                      setHighlightedIndex(-1);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search products..."
                    aria-label="Search products"
                    aria-autocomplete="list"
                    aria-controls="search-suggestion-list"
                    aria-activedescendant={highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined}
                    style={{
                      width: '100%',
                      padding: '8px 36px 8px 14px',
                      borderRadius: 20,
                      border: '1.5px solid #195046',
                      fontSize: 15,
                      outline: 'none',
                      boxShadow: '0 1px 4px rgba(25,80,70,0.07)',
                      marginBottom: 0,
                      background: '#fff'
                    }}
                  />
                  {/* Clear button and close search */}
                  {(search || showSearchBar) && (
                    <>
                      {search && (
                        <button
                          aria-label="Clear search"
                          onClick={() => { setSearch(''); setShowSuggestions(false); setHighlightedIndex(-1); setSelectedProduct(null); searchInputRef.current && searchInputRef.current.focus(); }}
                          style={{
                            position: 'absolute',
                            right: 32,
                            top: 8,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 16,
                            color: '#888'
                          }}
                          tabIndex={0}
                          type="button"
                        >
                          ×
                        </button>
                      )}
                      <IconButton
                        aria-label="Close search"
                        onClick={() => setShowSearchBar(false)}
                        sx={{ position: 'absolute', right: 0, top: 0, color: '#888', p: '6px' }}
                        size="small"
                      >
                        <SearchIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </>
                  )}
                  {showSuggestions && suggestions.length > 0 && (
                    <Box
                      id="search-suggestion-list"
                      sx={{
                        position: 'absolute',
                        top: 38,
                        left: 0,
                        width: '100%',
                        bgcolor: '#fff',
                        border: '1px solid #eee',
                        borderRadius: 2,
                        boxShadow: 3,
                        zIndex: 10,
                        maxHeight: 220,
                        overflowY: 'auto'
                      }}
                      role="listbox"
                      aria-label="Search suggestions"
                    >
                      {suggestions.map((item, idx) => {
                        // Highlight match
                        const s = search.trim().toLowerCase();
                        const name = item.name;
                        const matchIdx = name.toLowerCase().indexOf(s);
                        let before = name, match = "", after = "";
                        if (matchIdx !== -1) {
                          before = name.slice(0, matchIdx);
                          match = name.slice(matchIdx, matchIdx + s.length);
                          after = name.slice(matchIdx + s.length);
                        }
                        return (
                          <Box
                            key={item._id}
                            id={`suggestion-${idx}`}
                            sx={{
                              px: 2,
                              py: 1,
                              cursor: 'pointer',
                              bgcolor: highlightedIndex === idx ? '#e3f2fd' : undefined,
                              fontSize: 15,
                              fontWeight: highlightedIndex === idx ? 600 : 400,
                              '&:hover': { bgcolor: '#f5f5f5' }
                            }}
                            tabIndex={0}
                            role="option"
                            aria-selected={highlightedIndex === idx}
                            onMouseDown={() => {
                              setSearch(item.name);
                              setSelectedProduct(item);
                              setShowSuggestions(false);
                              setHighlightedIndex(-1);
                              searchInputRef.current && searchInputRef.current.blur();
                            }}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                          >
                            {before}
                            <span style={{ background: '#ffe082', color: '#195046', borderRadius: 2 }}>{match}</span>
                            {after}
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </Collapse>
            </Box>
            {isAuthenticated && location.pathname !== "/cart" && (
              <IconButton color="inherit" onClick={() => navigate("/cart")}
                aria-label="View cart"
                sx={{ ml: 1 }}
              >
                <Badge badgeContent={cart.length} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 12, minWidth: 18, height: 18 } }}>
                  <ShoppingCartIcon sx={{ fontSize: 24, color: "#fff" }} />
                </Badge>
              </IconButton>
            )}
            {isAuthenticated && (
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ ml: 2, color: "#fff", fontWeight: 600, fontSize: { xs: 12, sm: 16 } }}
                aria-label="Logout"
              >
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      )}

      <Container maxWidth={false} disableGutters sx={{ mt: hideAppBar ? 0 : { xs: 7, sm: 8 }, px: { xs: 0.5, sm: 2 }, width: '100%', maxWidth: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
       <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Redirect to signup if not authenticated */}
          <Route path="/" element={!isAuthenticated && !hasSignedUp ? <SignUp onSignUpSuccess={handleSignUpSuccess} /> : <Navigate to="/productPage" />} />

          {/* SignIn Route */}
          <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/productPage" element={
              <>
                <Box sx={{ width: "100%", mb: { xs: 1, sm: 2 } }}>
                  <MarqueeBanner />
                </Box>
                <Box sx={{ width: "100%", mb: { xs: 1, sm: 2 } }}>
                  <Carousel />
                </Box>

                {/* Advertising Banner */}
                <Box
                  sx={{
                    width: '100%',
                    mb: { xs: 2, sm: 3 },
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      px: { xs: 2, sm: 5 },
                      py: { xs: 2, sm: 3 },
                      borderRadius: 4,
                      boxShadow: 4,
                      background: 'linear-gradient(90deg, #ffe082 0%, #ff7043 60%, #2c355bff 100%)',
                      color: '#2c355b',
                      fontWeight: 700,
                      fontSize: { xs: 18, sm: 24 },
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      animation: 'adBannerPop 1.2s cubic-bezier(0.4,0,0.2,1)',
                      '@keyframes adBannerPop': {
                        '0%': { opacity: 0, transform: 'scale(0.8) translateY(-40px)' },
                        '60%': { opacity: 1, transform: 'scale(1.05) translateY(8px)' },
                        '100%': { opacity: 1, transform: 'scale(1) translateY(0)' }
                      }
                    }}
                  >
                    <span role="img" aria-label="fireworks" style={{ fontSize: 28, marginRight: 8 }}>🎆</span>
                    <span style={{ color: '#195046', fontWeight: 900 }}>Independence Sale</span> is coming! <span style={{ color: '#fff', background: '#195046', borderRadius: 6, padding: '2px 10px', margin: '0 8px', fontWeight: 700 }}>UP TO 70% OFF</span> on all categories!
                    <span role="img" aria-label="flag" style={{ fontSize: 24, marginLeft: 8 }}>🇮🇳</span>
                    <Box sx={{ fontSize: 15, fontWeight: 500, mt: 1, color: '#2c355b' }}>
                      Plus: <span style={{ color: '#ff7043', fontWeight: 700 }}>Flash Deals</span>, <span style={{ color: '#195046', fontWeight: 700 }}>Buy 1 Get 1</span>, and more surprises!
                    </Box>
                  </Box>
                </Box>
{/* Cookie Consent Bar */}
<CookieConsentBar />
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mb: { xs: 1, sm: 2 },
                    justifyContent: "center",
                  }}
                  aria-label="Category filter bar"
                >
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "contained" : "outlined"}
                      color="black"
                      size="small"
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        textTransform: "none",
                        px: 2,
                        minWidth: 80,
                        background: selectedCategory === cat ? "linear-gradient(to right,  #2c355bff ,  #195046ff)" : undefined,
                        color: selectedCategory === cat ? "whitesmoke" : undefined,
                        borderColor: "black",
                        boxShadow: selectedCategory === cat ? 2 : 0,
                        '&:hover': { background: "#174e45ff", color: "#fff" },
                      }}
                      aria-pressed={selectedCategory === cat}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </Box>
                <ProductSectionedGrid data={filteredData} addToCart={addToCart} />
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
        </Suspense>

      </Container>
    </Box>
  </Box>
  );
};

export default App;

// Cookie Consent Bar Component
function CookieConsentBar() {
  const [show, setShow] = React.useState(() => !localStorage.getItem('cookieConsent'));
  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShow(false);
  };
  if (!show) return null;
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100vw',
        bgcolor: 'rgba(25,80,70,0.98)',
        color: '#fff',
        px: 2,
        py: 1.5,
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
        boxShadow: 4,
        transition: 'bottom 0.4s',
      }}
    >
      <span style={{ marginRight: 12 }}>We use cookies to improve your experience and show relevant offers. By using this site, you accept our cookie policy.</span>
      <Button
        variant="contained"
        size="small"
        sx={{ ml: 2, fontWeight: 700, borderRadius: 2, background: 'linear-gradient(90deg, #ff7043 40%, #195046 100%)', color: '#fff', boxShadow: 2, '&:hover': { background: '#2c355b' } }}
        onClick={handleAccept}
      >
        Accept
      </Button>
    </Box>
  );
}
