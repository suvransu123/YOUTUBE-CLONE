import { useForm } from "react-hook-form";
import { useState } from "react";

type FormData = {
  user_name: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
};

function Registration() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>();

  const [message, setMessage] = useState<string>("");
const onSubmit = async (data: FormData) => {
  try {

    const formData = new FormData();
    formData.append("user_name", data.user_name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);
    formData.append("avatar", data.avatar[0]);

    const res = await fetch("/api/v1/register", {
      method: "POST",
      body: formData
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage(result.message || "Registration failed");
      return;
    }

    setMessage("Registration successful! Please login.");
    reset();

  } catch (error) {
    setMessage("Server error. Please try again.");
  }
};

  return (
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
              <div className="form-group">
          <input
            type="file"
            accept="image/*"
            {...register("avatar", { required: "Image is required" })}
          />

          {errors.avatar && (
            <p className="error">{errors.avatar.message}</p>
          )}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Registration;