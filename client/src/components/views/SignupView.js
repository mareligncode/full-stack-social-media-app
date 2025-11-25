import React, { useState } from "react";
import { signup } from "../../api/users";
import { loginUser } from "../../helpers/authHelper";
import { useNavigate, Link } from "react-router-dom";
import Copyright from "../Copyright";
import ErrorAlert from "../ErrorAlert";
import { isLength, isEmail, contains } from "validator";

const SignupView = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length !== 0) return;

    const data = await signup(formData);

    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  const validate = () => {
    const errors = {};

    if (!isLength(formData.username, { min: 6, max: 30 })) {
      errors.username = "Must be between 6 and 30 characters long";
    }

    if (contains(formData.username, " ")) {
      errors.username = "Must contain only valid characters";
    }

    if (!isLength(formData.password, { min: 8 })) {
      errors.password = "Must be at least 8 characters long";
    }

    if (!isEmail(formData.email)) {
      errors.email = "Must be a valid email address";
    }

    setErrors(errors);

    return errors;
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row w-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-4 mx-auto">
          {/* Card Layout */}
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-4 p-md-5">
              
              {/* Header */}
              <div className="text-center mb-4">
                <h1 className="display-5 fw-bold text-primary mb-3">
                  <Link to="/" className="text-decoration-none text-reset">
                    PostIt
                  </Link>
                </h1>
                <h2 className="h4 mb-2">Join Our Community</h2>
                <p className="text-muted">
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none fw-semibold">
                    Sign In
                  </Link>
                </p>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-semibold">
                    Username
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className={`form-control ${errors.username ? "is-invalid" : ""}`}
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      autoFocus
                      placeholder="Choose a username"
                    />
                  </div>
                  {errors.username && (
                    <div className="invalid-feedback d-block">{errors.username}</div>
                  )}
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <div className="invalid-feedback d-block">{errors.email}</div>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Create a secure password"
                    />
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback d-block">{errors.password}</div>
                  )}
                  <div className="form-text">
                    <i className="bi bi-info-circle me-1"></i>
                    Must be at least 8 characters long
                  </div>
                </div>

                {/* Server Error Alert */}
                {serverError && (
                  <div className="mb-3">
                    <ErrorAlert error={serverError} />
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2 mb-3 fw-semibold"
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Create Account
                </button>

                {/* Terms */}
                <div className="text-center">
                  <small className="text-muted">
                    By signing up, you agree to our{" "}
                    <a href="#" className="text-decoration-none">Terms</a> and{" "}
                    <a href="#" className="text-decoration-none">Privacy Policy</a>
                  </small>
                </div>
              </form>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-4">
            <Copyright />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupView;