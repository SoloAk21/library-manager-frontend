import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusIcon, SearchIcon } from "../../components/ui/icons";
import StaffCard from "../../components/admin/staff/StaffCard";
import AddStaffDialog from "../../components/admin/staff/AddStaffDialog";
import EditStaffDialog from "../../components/admin/staff/EditStaffDialog";
import ViewStaffDialog from "../../components/admin/staff/ViewStaffDialog";
import DeleteStaffDialog from "../../components/admin/staff/DeleteStaffDialog";
import { fetchUsers } from "../../redux/auth/authSlice";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const StaffManagement = () => {
  const dispatch = useDispatch();
  const { users: usersData, loading } = useSelector((state) => state.auth);
  const { user: currentUser } = useSelector((state) => state.auth);
  const users = usersData?.users || [];

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch, refreshKey]);

  const filteredStaff = users.filter((staffMember) =>
    `${staffMember.username} ${staffMember.email} ${staffMember.role}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setIsViewDialogOpen(true);
  };

  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setIsEditDialogOpen(true);
  };

  const handleDeleteStaff = (staff) => {
    setSelectedStaff(staff);
    setIsDeleteDialogOpen(true);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Staff Management
            </h1>
            <p className="text-gray-600">
              Manage library staff and administrators (Admin Only)
            </p>
          </div>
          {currentUser?.role === "admin" && (
            <Button onClick={() => setIsAddDialogOpen(true)} disabled={loading}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          )}
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search staff by username, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((staffMember) => (
            <StaffCard
              key={staffMember.id}
              staff={staffMember}
              loading={loading}
              onView={handleViewStaff}
              onEdit={currentUser?.role === "admin" ? handleEditStaff : null}
              onDelete={
                currentUser?.role === "admin" ? handleDeleteStaff : null
              }
              isAdmin={currentUser?.role === "admin"}
            />
          ))}
        </div>
      </div>

      <AddStaffDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleRefresh}
      />

      <EditStaffDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        staff={selectedStaff}
        isLoading={loading}
        onSuccess={handleRefresh}
      />

      <ViewStaffDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        staff={selectedStaff}
      />

      <DeleteStaffDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        staff={selectedStaff}
        isLoading={loading}
        onSuccess={handleRefresh}
      />
    </main>
  );
};

export default StaffManagement;
