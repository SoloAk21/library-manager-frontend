import React, { useState, useEffect, useRef } from "react";
import Dialog from "../../common/Dialog";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { useDispatch, useSelector } from "react-redux";
import {
  updateMember,
  fetchMemberById,
  clearMessages,
} from "../../../redux/members/membersSlice";
import toast from "react-hot-toast";

const EditMemberDialog = ({ isOpen, onClose, member }) => {
  const dispatch = useDispatch();
  const { loading, currentMember, error, successMessage } = useSelector(
    (state) => state.members
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const prevSuccessMessage = useRef(null);
  const prevError = useRef(null);

  useEffect(() => {
    if (isOpen && member?.id) {
      dispatch(fetchMemberById(member.id));
    }
  }, [isOpen, member?.id, dispatch]);

  useEffect(() => {
    if (currentMember) {
      setFormData({
        name: currentMember.name || "",
        email: currentMember.email || "",
        phone: currentMember.phone || "",
      });
      setErrors({});
    }
  }, [currentMember]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(clearMessages());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    let toastId = null;

    if (successMessage && successMessage !== prevSuccessMessage.current) {
      toastId = toast.success(successMessage, {
        id: "success",
        data: { title: "Success" },
      });
      dispatch(clearMessages());
      setTimeout(() => {
        onClose();
      }, 1500);
    }

    if (error && error !== prevError.current) {
      toastId = toast.error(error, { id: "error", data: { title: "Error" } });
      dispatch(clearMessages());
    }

    prevSuccessMessage.current = successMessage;
    prevError.current = error;

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [successMessage, error, dispatch, onClose]);

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

    dispatch(updateMember({ memberId: member.id, memberData: formData }));
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Member"
      description="Update the member information below."
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
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading} disabled={loading}>
            Update Member
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default EditMemberDialog;
