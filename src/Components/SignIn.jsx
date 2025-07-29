import React from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const SignIn = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const matchedUser = users.find(
      (u) => u.username === values.username && u.password === values.password
    );

    if (matchedUser) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", values.username);
      if (setIsAuthenticated) setIsAuthenticated(true); // for context/global state
      navigate("/productPage");
    } else {
      alert("Invalid username or password.");
    }

    setSubmitting(false);
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          mt: 0,
          p: 3,
          boxShadow: 13,
          borderRadius: 2,
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom sx={{ width: '100%' }}>
          Sign In
        </Typography>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <Field
                as={TextField}
                name="username"
                label="Username"
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />

              <Field
                as={TextField}
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                Sign In
              </Button>
            </Form>
          )}
        </Formik>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt: 2 }}>
          <Typography align="center" sx={{ mb: 1 }}>
            Don't have an account?
          </Typography>
          <Button
            variant="text"
            fullWidth
            onClick={() => navigate("/")}
            sx={{ maxWidth: 200 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
