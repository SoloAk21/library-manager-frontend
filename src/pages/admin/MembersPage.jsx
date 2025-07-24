import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMembers,
  clearMessages,
  deleteMember,
} from "../../redux/members/membersSlice";
import toast from "react-hot-toast";
import AddMemberDialog from "../../components/admin/members/AddMemberDialog";
import EditMemberDialog from "../../components/admin/members/EditMemberDialog";
import ViewMemberDialog from "../../components/admin/members/ViewMemberDialog";
import MemberCard from "../../components/admin/members/MemberCard";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { PlusIcon, SearchIcon } from "../../components/ui/icons";
import useForm from "../../hooks/useForm";
import { cn } from "../../utils/cn";
import HistoryDialog from "../../components/admin/members/HistoryDialog";
import DeleteMemberDialog from "../../components/admin/members/DeleteMemberDialog";

// Custom hook for members logic
const useMembers = () => {
  const dispatch = useDispatch();
  const {
    members = [],
    loading: membersLoading,
    error,
    successMessage,
  } = useSelector((state) => state.members || {});
  const { token, user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  React.useEffect(() => {
    if (token) {
      dispatch(fetchMembers());
    }
  }, [dispatch, token]);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
  }, [error, successMessage, dispatch]);

  return { members, membersLoading, token, isAdmin };
};

// Header component
const MembersHeader = ({ onAddMember, isLoading }) => (
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Members</h1>
      <p className="text-gray-600">Manage library members</p>
    </div>
    <Button onClick={onAddMember} disabled={isLoading}>
      <PlusIcon className="mr-2 h-4 w-4" />
      Add Member
    </Button>
  </div>
);

// Search component
const MembersSearch = ({ searchQuery, onChange, isLoading }) => (
  <div className="relative">
    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    <Input
      id="searchQuery"
      name="searchQuery"
      placeholder="Search members by name, email, or phone..."
      value={searchQuery}
      onChange={onChange}
      disabled={isLoading}
      className="pl-10"
    />
  </div>
);

const MembersPage = React.memo(() => {
  const { members, membersLoading, isAdmin } = useMembers();
  const initialData = { searchQuery: "" };
  const validate = () => ({});
  const { formData, handleChange } = useForm(initialData, validate);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [memberToDelete, setMemberToDelete] = React.useState(null);
  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      `${member.name} ${member.email} ${member.phone}`
        .toLowerCase()
        .includes(formData.searchQuery.toLowerCase())
    );
  }, [members, formData.searchQuery]);

  const handleViewMember = React.useCallback((member) => {
    setSelectedMember(member);
    setIsViewDialogOpen(true);
  }, []);

  const handleHistoryMember = React.useCallback((member) => {
    setSelectedMember(member);
    setIsHistoryDialogOpen(true);
  }, []);

  const handleEditMember = React.useCallback((member) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteMember = React.useCallback((member) => {
    setMemberToDelete(member);
    setIsDeleteDialogOpen(true);
  }, []);

  return (
    <main className={cn("flex-1 overflow-auto p-6", isAdmin && "bg-gray-100")}>
      {membersLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      <div className="space-y-6">
        <MembersHeader
          onAddMember={() => setIsAddDialogOpen(true)}
          isLoading={membersLoading}
        />
        <MembersSearch
          searchQuery={formData.searchQuery}
          onChange={handleChange}
          isLoading={membersLoading}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.length === 0 && !membersLoading && (
            <div className="text-center py-8 text-gray-500 col-span-full">
              {members.length === 0
                ? "No members available"
                : "No matching members found"}
            </div>
          )}
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onView={handleViewMember}
              onHistory={handleHistoryMember}
              onEdit={handleEditMember}
              onDelete={handleDeleteMember}
              loading={membersLoading}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </div>
      <AddMemberDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
      <EditMemberDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        member={selectedMember}
      />
      <ViewMemberDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        member={selectedMember}
      />
      <HistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        member={selectedMember}
      />
      <DeleteMemberDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setMemberToDelete(null);
        }}
        member={memberToDelete}
      />
    </main>
  );
});

export default MembersPage;
