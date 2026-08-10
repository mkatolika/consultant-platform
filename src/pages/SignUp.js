import { API_BASE_URL } from "../config/api";
import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  InputGroup
} from "react-bootstrap";

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
  `${API_BASE_URL}/api/Auth/register`,
  {
    username: formData.email,   // use email as username
    password: formData.password,
    fullName: formData.firstName,
    role: "User"                // automatically assign User role
  }
);
      

      // ✅ Show server success message if available
      setSuccess(response.data?.message || "Account created successfully 🎉");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch (err) {
      if (!err.response) {
        setError("Server not reachable. Please check your connection.");
      } else {
        const responseData = err.response.data;
        let message;

        if (Array.isArray(responseData)) {
          message = responseData
            .map((item) => item.description || item.message)
            .filter(Boolean)
            .join(" ");
        } else if (responseData?.errors) {
          message = Object.values(responseData.errors).flat().join(" ");
        } else if (typeof responseData === "string") {
          message = responseData;
        } else {
          message = responseData?.message || responseData?.error;
        }

        setError(message || "Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="bg-light min-vh-100 d-flex align-items-center">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4">
              <h3 className="text-center fw-bold mb-4">Create Account</h3>

              {/* ✅ Show server messages */}
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 fw-semibold py-2"
                  variant="dark"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" /> Creating...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>

                <div className="text-center mt-3">
                  <small>
                    Already have an account?{" "}
                    <a href="/login" className="text-decoration-none">
                      Login
                    </a>
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;  