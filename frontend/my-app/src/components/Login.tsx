import { useForm } from "react-hook-form";
import { useState } from "react";
// import "./App.css";
import Dashboard from "./Dashboard";

type LoginFormData = {
  email: string;
  password: string;
};

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>();

  const [message, setMessage] = useState<string>("");
  const [showDashboard, setShowDashboard] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch("/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage(result.message || "Login failed");
        return;
      }

      if (result.success) {
        setMessage("Login successful");
        
        // Optional: store token if backend sends it
        if (result.token) {
          localStorage.setItem("token", result.token);
        }

        setShowDashboard(true);
      } else {
        setMessage(result.message || "Invalid credentials");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  };

  if (showDashboard) {
    return <Dashboard />;
  }

  return (
    <div className="container">
      <div className="form-card">
        <h2>User Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required"
              })}
            />
            {errors.email && (
              <p className="error">{errors.email.message}</p>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required"
              })}
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;