import React, { useState } from "react";
import Dialog from "../../common/Dialog";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { signup as createUser } from "../../../redux/auth/authSlice";
import toast from "react-hot-toast";

const AddStaffDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "librarian",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\(\d{3}\)\s\d{3}-\d{4}$/.test(formData.phone))
      newErrors.phone = "Phone number must be in (XXX) XXX-XXXX format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Remove confirmPassword from the data sent to the server
      const { confirmPassword, ...userData } = formData;
      await dispatch(createUser(userData)).unwrap();
      toast.success("Staff member added successfully!");
      onClose();
      setFormData({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "librarian",
      });
    } catch (error) {
      console.log(error);

      toast.error(error || "Failed to add staff member");
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Staff"
      description="Enter the details for the new staff member."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.values(errors).some((error) => error) && (
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
          id="phone"
          name="phone"
          label="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          required
          type="tel"
          placeholder="Enter phone number (e.g., (555) 123-4567)"
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
        <div className="grid gap-2">
          <label className="text-sm font-medium">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="librarian">Librarian</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading} disabled={loading}>
            Add Staff
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default AddStaffDialog;
