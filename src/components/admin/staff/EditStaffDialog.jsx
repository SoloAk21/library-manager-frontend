import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "../../common/Dialog";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import { updateStaff, clearMessages } from "../../../redux/staff/staffSlice";
import { useToast } from "../../../context/ToastContext";

const EditStaffDialog = ({ isOpen, onClose, staff }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { loading, error, successMessage } = useSelector(
    (state) => state.staff
  );

  // Static phone numbers based on role
  const PHONE_NUMBERS = {
    librarian: "(555) 987-6543",
    admin: "(555) 123-4567",
  };

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "librarian",
  });

  const [errors, setErrors] = useState({});
  const prevSuccessMessage = useRef(null);
  const prevError = useRef(null);

  const initializeForm = (staffData) => {
    return {
      username: staffData?.username || "",
      email: staffData?.email || "",
      role: staffData?.role || "librarian",
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(
      updateStaff({
        staffId: staff.id,
        staffData: formData,
      })
    );
  };

  useEffect(() => {
    if (staff) {
      setFormData(initializeForm(staff));
    }
  }, [staff]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(clearMessages());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (error && error !== prevError.current) {
      showToast(error, "error", "Update Failed");
      dispatch(clearMessages());
    }

    if (successMessage && successMessage !== prevSuccessMessage.current) {
      showToast(successMessage, "success", "Staff Updated");
      dispatch(clearMessages());
      setTimeout(() => onClose(), 1500);
    }

    prevSuccessMessage.current = successMessage;
    prevError.current = error;
  }, [error, successMessage, dispatch, onClose, showToast]);

  if (!staff) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Staff Member"
      description="Update the staff member information below."
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
          id="phone"
          name="phone"
          label="Phone Number"
          value={PHONE_NUMBERS[formData.role]}
          disabled
          type="tel"
          placeholder="Phone number (auto-generated)"
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
          <Button type="submit" isLoading={loading} disabled={loading}>
            Update Staff
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default EditStaffDialog;
