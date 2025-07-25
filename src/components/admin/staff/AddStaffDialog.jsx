import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "../../common/Dialog";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import {
  signup as createUser,
  clearMessages,
} from "../../../redux/auth/authSlice";
import { useToast } from "../../../context/ToastContext";

const AddStaffDialog = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const initialFormState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "librarian",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
      setErrors({});
      dispatch(clearMessages());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (error) {
      showToast(error, "error", "Staff Creation Failed");
      dispatch(clearMessages());
    }

    if (successMessage) {
      showToast(successMessage, "success", "Staff Member Added");
      dispatch(clearMessages());
      onSuccess();
      setTimeout(() => onClose(), 1500);
    }
  }, [error, successMessage, dispatch, onClose, showToast, onSuccess]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (
      !formData.confirmPassword ||
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { confirmPassword, ...userData } = formData;
      await dispatch(createUser(userData)).unwrap();
    } catch (err) {
      // Error is handled by the useEffect
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Staff Member"
      description="Enter the details for the new staff member."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.values(errors).some(Boolean) && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">
              Please fix the errors in the form.
            </p>
          </div>
        )}

        <Input
          id="username"
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
          placeholder="Enter username"
        />

        <Input
          id="email"
          name="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          type="email"
          placeholder="Enter email address"
        />

        <Input
          id="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          type="password"
          placeholder="Enter password (min 6 characters)"
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
          type="password"
          placeholder="Confirm your password"
        />

        <Select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          label="Role"
          required
        >
          <option value="librarian">Librarian</option>
          <option value="admin">Admin</option>
        </Select>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Add Staff
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default AddStaffDialog;
