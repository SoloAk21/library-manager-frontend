import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signup, clearMessages } from "../../redux/auth/authSlice";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { BookOpenIcon } from "../../components/ui/icons";
import useForm from "../../hooks/useForm";
import { cn } from "../../utils/cn";

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  // Form handling
  const initialData = {
    username: "",
    email: "",
    password: "",
    role: "admin",
  };

  const validate = (data) => {
    const errors = {};
    if (!data.username.trim()) errors.username = "Username is required";
    if (!data.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email))
      errors.email = "Invalid email format";
    if (!data.password.trim()) errors.password = "Password is required";
    else if (data.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    return errors;
  };

  const { formData, errors, handleChange, validateForm } = useForm(
    initialData,
    validate
  );

  // Handle messages and navigation
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
    if (successMessage) {
      toast.success(successMessage);
      setTimeout(() => navigate("/login"), 1500);
      dispatch(clearMessages());
    }
  }, [error, successMessage, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(signup(formData));
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      )}
    >
      <div className="rounded-lg border border-primary/10 bg-white shadow-sm w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col space-y-1.5 p-6 text-center">
          <div className="flex justify-center mb-4">
            <BookOpenIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm text-gray-500">Join our library community</p>
        </div>

        {/* Form */}
        <div className="p-6 pt-0">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              id="username"
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="Enter your username"
              disabled={loading}
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
              disabled={loading}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              disabled={loading}
            />

            <Select
              id="role"
              name="role"
              label="Account Type"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="admin">Admin</option>
              <option value="librarian">Librarian</option>
            </Select>

            <Button type="submit" className="w-full" isLoading={loading}>
              Create Account
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
