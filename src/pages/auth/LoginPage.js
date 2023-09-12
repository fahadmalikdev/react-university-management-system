import React, { useState } from "react";
import { Link, useHistory, useNavigate } from "react-router-dom";
import "../../assets/css/login.css";
import authLayout from "../../hoc/authLayout";
import Swal from "sweetalert2";
import { post } from "../../services/httpService";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      userType: "",
      emailError: false,
      passwordError: false,
    };
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = this.state;

    if (!email || !password) {
      this.setState({
        emailError: !email,
        passwordError: !password,
      });
      return;
    }

    try {
      this.setState({ emailError: false, passwordError: false });
      const response = await post("/api/v1/login", { email, password });

      if (response.statusCode === 200) {
        this.setState({
          userType: response.user.role,
          emailError: false,
          passwordError: false,
        });
        localStorage.setItem("token", response.token);
        localStorage.setItem("userDetail", JSON.stringify(response.user));

        // Swal.fire({
        //   icon: "success",
        //   title: "Login Successfull",
        //   text: "",
        //   position: "top-end",
        //   showConfirmButton: false,
        //   timer: 2000,
        // });

        // Update Below Code:
        // const navigate = useNavigate();
        // navigate("/dashboard", { replace: true });
        
        // Remove/Update Below Code:
        window.location.href = "/dashboard";
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: errorData.message || "An error occurred during login.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "An error occurred during login.",
      });
    }
  };

  render() {
    const { email, password, userType, emailError, passwordError } = this.state;

    return (
      <>
        <form className="login-form" onSubmit={this.handleSubmit}>
          <div className="d-flex align-items-center my-4">
            <h1 className="text-center fw-normal mb-0 me-3">
              University Portal
            </h1>
          </div>
          <div className="d-flex align-items-center my-4">
            <h2 className="text-center fw-normal mb-0 me-3">
              Welcome Back! Sign in to continue
            </h2>
          </div>
          {/* <!-- Email input --> */}
          <div className="form-outline mb-4">
            <label className="form-label" htmlFor="form3Example3">
              Email address
            </label>
            <input
              type="email"
              id="form3Example3"
              className={`form-control form-control-lg ${
                // eslint-disable-next-line no-undef
                emailError ? "is-invalid" : ""
              }`}
              placeholder="Enter a valid email address"
              name="email"
              value={email}
              onChange={this.handleInputChange}
            />
          </div>

          {/* <!-- Password input --> */}
          <div className="form-outline mb-3">
            <label className="form-label" htmlFor="form3Example4">
              Password
            </label>
            <input
              type="password"
              id="form3Example4"
              className={`form-control form-control-lg ${
                // eslint-disable-next-line no-undef
                passwordError ? "is-invalid" : ""
              }`}
              placeholder="Enter password"
              name="password"
              value={password}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center">
            {/* <!-- Checkbox --> */}
            <div className="form-check mb-0">
              <input
                className="form-check-input me-2"
                type="checkbox"
                value=""
                id="form2Example3"
              />
              <label className="form-check-label" htmlFor="form2Example3">
                Remember me
              </label>
            </div>
            {/* <Link to="/reset-password" className="text-body">
              Forgot password?
            </Link> */}
          </div>

          <div className="text-center text-lg-start mt-4 pt-2">
            {/* <Link
              to="/dashboard"
              type="button"
              className="btn btn-primary btn-lg"
            >
              Login
            </Link> */}
            <button type="submit" className="btn btn-primary btn-lg">
              Login
            </button>
            <p className="small fw-bold mt-2 pt-1 mb-0">
              Don't have an account? Ask Adminstrator{" "}
              {/* <a href="#!" className="link-danger">
                Register
              </a> */}
            </p>
          </div>
        </form>
      </>
    );
  }
}

export default authLayout(LoginPage);
