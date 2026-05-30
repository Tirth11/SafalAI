"use client";

import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { useAuthStore } from "@/lib/store";
import { useState } from "react";
import { cn, formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { Button, Input, Card, Badge, Modal } from "@/components/ui";
import {
  Plus,
  Users,
  UserPlus,
  Settings,
  Mail,
  Phone,
  Shield,
  Eye,
  Edit,
  Trash2,
  Crown,
} from "lucide-react";

// Mock data
const mockFamilyMembers = [
  {
    id: "1",
    userId: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    relationship: "Self",
    role: "admin",
    joinedAt: "2024-01-01T00:00:00Z",
    totalExpenses: 45000,
    expenseCount: 128,
  },
  {
    id: "2",
    userId: "1",
    name: "Jane Doe",
    email: "jane@example.com",
    relationship: "Spouse",
    role: "admin",
    joinedAt: "2024-01-05T00:00:00Z",
    totalExpenses: 32500,
    expenseCount: 95,
  },
  {
    id: "3",
    userId: "1",
    name: "Tom Doe",
    email: "tom@example.com",
    relationship: "Son",
    role: "member",
    joinedAt: "2024-02-10T00:00:00Z",
    totalExpenses: 8500,
    expenseCount: 32,
  },
  {
    id: "4",
    userId: "1",
    name: "Mary Doe",
    email: "mary@example.com",
    relationship: "Mother",
    role: "viewer",
    joinedAt: "2024-03-15T00:00:00Z",
    totalExpenses: 0,
    expenseCount: 0,
  },
];

export default function FamilyPage() {
  const { isAuthenticated } = useAuthStore();
  const [members] = useState(mockFamilyMembers);
  const [showAddModal, setShowAddModal] = useState(false);

  if (!isAuthenticated) {
    redirect("/auth/login");
  }

  const totalFamilyExpenses = members.reduce((sum, m) => sum + m.totalExpenses, 0);
  const roleColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    member: "bg-blue-100 text-blue-700",
    viewer: "bg-gray-100 text-gray-700",
  };

  return (
    <DashboardLayout title="Family" activeItem="family">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Family Management</h1>
            <p className="text-gray-500">Manage family members and track shared expenses</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{members.length}</p>
                <p className="text-sm text-gray-500">Family Members</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {members.filter((m) => m.role === "admin").length}
                </p>
                <p className="text-sm text-gray-500">Admins</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalFamilyExpenses)}</p>
                <p className="text-sm text-gray-500">Total Expenses</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Members List */}
        <div className="grid gap-4">
          {members.map((member) => (
            <Card key={member.id} hover className="group">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-lg font-bold">
                  {getInitials(member.name)}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <Badge
                      variant={member.role === "admin" ? "primary" : member.role === "member" ? "secondary" : "gray"}
                      size="sm"
                    >
                      {member.role === "admin" && <Crown className="w-3 h-3 mr-1" />}
                      {member.role}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {member.relationship}
                    </span>
                    {member.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-gray-900">{formatCurrency(member.totalExpenses)}</p>
                  <p className="text-xs text-gray-500">{member.expenseCount} expenses</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Member Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Family Member"
          size="md"
        >
          <div className="space-y-4">
            <Input label="Name" placeholder="Member name" />
            <Input label="Email (optional)" type="email" placeholder="email@example.com" />
            <Input label="Phone (optional)" type="tel" placeholder="+1 234 567 8900" />
            <Input label="Relationship" placeholder="e.g., Spouse, Child, Parent" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <div className="grid grid-cols-3 gap-2">
                {["admin", "member", "viewer"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    className="p-3 border rounded-lg text-center hover:border-primary-500 hover:bg-primary-50"
                  >
                    <span className="font-medium capitalize">{role}</span>
                    <p className="text-xs text-gray-500 mt-1">
                      {role === "admin" ? "Full access" : role === "member" ? "Add expenses" : "View only"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button>Add Member</Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
