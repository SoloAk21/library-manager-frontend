import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, clearMessages } from "../../redux/auth/authSlice";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { BookOpenIcon } from "../../components/ui/icons";
import useForm from "../../hooks/useForm";
import { useToast } from "../../context/ToastContext";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { loading, error, successMessage, token } = useSelector(
    (state) => state.auth
  );

  const initialData = { email: "", password: "" };
  const { formData, handleChange } = useForm(initialData);

  useEffect(() => {
    if (token) navigate("/dashboard");
    dispatch(clearMessages());
  }, [token, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      showToast(error, "error", "Login Failed");
      dispatch(clearMessages());
    }
    if (successMessage) {
      showToast(successMessage, "success", "Login Success");
      dispatch(clearMessages());
    }
  }, [error, successMessage, dispatch, showToast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-primary/10 bg-white shadow-sm w-full max-w-md">
        <div className="flex flex-col space-y-1.5 p-6 text-center">
          <div className="flex justify-center mb-4">
            <BookOpenIcon className="h-12 w-12 text-blue-600" />
          </div>
          <div className="tracking-tight text-2xl font-bold">
            Library Manager System
          </div>
          <div className="text-sm text-gray-600">
            Sign in to your account to continue
          </div>
        </div>
        <div className="p-6 pt-0">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
              required
            />
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
            <Button type="submit" className="w-full" isLoading={loading}>
              Sign in
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600 space-y-2">
            <div>
              <Link
                to="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div>
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Create one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
