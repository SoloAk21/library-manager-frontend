import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "../../common/Dialog";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import {
  createMember,
  clearMessages,
} from "../../../redux/members/membersSlice";
import { useToast } from "../../../context/ToastContext";

const AddMemberDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { loading, error, successMessage } = useSelector(
    (state) => state.members
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const toastCompletedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", email: "", phone: "" });
      setErrors({});
      dispatch(clearMessages());
      toastCompletedRef.current = false;
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (successMessage && isOpen && !toastCompletedRef.current) {
      showToast(successMessage, "success", "Member Created");
      dispatch(clearMessages());
      toastCompletedRef.current = true;
      setTimeout(() => {
        onClose();
      }, 1500);
    }

    if (error && isOpen && !toastCompletedRef.current) {
      showToast(error, "error", "Member Creation Failed");
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch, isOpen, onClose, showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\(\d{3}\)\s\d{3}-\d{4}$/.test(formData.phone))
      newErrors.phone = "Phone number must be in (XXX) XXX-XXXX format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    toastCompletedRef.current = false;
    dispatch(createMember(formData));
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => {
        if (!loading && !toastCompletedRef.current) {
          onClose();
        }
      }}
      title="Add New Member"
      description="Enter the details for the new member."
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
          id="name"
          name="name"
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="Enter full name"
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
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="secondary"
            onClick={() => {
              if (!loading && !toastCompletedRef.current) {
                onClose();
              }
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={loading} disabled={loading}>
            Create Member
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default AddMemberDialog;
