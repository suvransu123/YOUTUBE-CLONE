import { useForm } from "react-hook-form";
import { useState } from "react";
import './App.css';
import Dashboard from "./components/Dashboard";

type FormData = {
  user_name: string;
  email: string;
  password: string;
  phone: string;
};

function App() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>();

  const [message, setMessage] = useState<string>("");
  const [showDashboard, setShowDashboard] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        setMessage("User registered successfully");
        reset();
        setShowDashboard(true);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("Server error");
    }
  };
  if (showDashboard) {
  return <Dashboard />;
}
return(
  <div className="container">
    <div className="form-card">
      <h2>User Registration</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <input
            placeholder="Username"
            {...register("user_name", { required: "Username is required" })}
          />
          {errors.user_name && (
            <p className="error">{errors.user_name.message}</p>
          )}
        </div>

        <div className="form-group">
          <input
            placeholder="Email"
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="error">{errors.email.message}</p>
          )}
        </div>

        <div className="form-group">
          <input
            placeholder="Password"
            type="password"
            {...register("password", {
              required: "Password required",
              minLength: { value: 6, message: "Min 6 characters" }
            })}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>

        <div className="form-group">
          <input
            placeholder="Phone"
            {...register("phone", { required: "Phone required" })}
          />
          {errors.phone && (
            <p className="error">{errors.phone.message}</p>
          )}
        </div>

        <button type="submit">Register</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  </div>
);
}
export default App;