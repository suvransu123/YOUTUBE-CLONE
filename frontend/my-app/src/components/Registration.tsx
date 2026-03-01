import { useForm } from "react-hook-form";
import { useState } from "react";
import Login from "./Login"; 

type FormData = {
  user_name: string;
  email: string;
  password: string;
  phone: string;
};

function Registration() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>();

  const [message, setMessage] = useState<string>("");
  const [showLogin, setShowLogin] = useState(false);

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

    if (!res.ok) {
      // backend already sends a message field on error
      setMessage(result.message || "Registration failed");
      return;
    }

    // either the backend sent success:true or simply a message
    setMessage(result.message || "User registered successfully");
    reset();
    setShowLogin(true);
  } catch (error) {
    setMessage("Server error. Please try again.");
  }
};
  if (showLogin) {
  return <Login />;
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
export default Registration;