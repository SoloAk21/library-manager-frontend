import React, { useState, useEffect } from "react";
import Dialog from "../../common/Dialog";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { useDispatch } from "react-redux";
import { updateStaff } from "../../../redux/staff/staffSlice";
import toast from "react-hot-toast";

const EditStaffDialog = ({ isOpen, onClose, staff, isLoading }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "librarian",
    isActive: true,
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        username: staff.username,
        email: staff.email,
        phone: staff.phone || "",
        role: staff.role,
        isActive: staff.isActive,
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleActive = () => {
    setFormData((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateStaff({ staffId: staff.id, staffData: formData })
      ).unwrap();
      toast.success("Staff updated successfully!");
      onClose();
    } catch (error) {
      toast.error(error || "Failed to update staff");
    }
  };

  if (!staff) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Staff"
      description="Update the staff member information below."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="username"
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="Enter username"
        />
        <Input
          id="email"
          name="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange}
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
          type="tel"
          placeholder="Enter phone number"
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
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={handleToggleActive}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isActive" className="text-sm font-medium">
            Active Status
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Update Staff
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default EditStaffDialog;
