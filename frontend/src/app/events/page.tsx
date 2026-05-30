"use client";

import React from "react";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { useAuthStore } from "@/lib/store";
import { useState } from "react";
import { cn, formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { Button, Input, Card, Badge, Modal } from "@/components/ui";
import {
  Plus,
  Calendar,
  Users,
  Share2,
  QrCode,
  Link2,
  DollarSign,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";

// Mock data
const mockEvents = [
  {
    id: "1",
    userId: "1",
    name: "Goa Trip 2024",
    description: "Annual family trip to Goa",
    budget: 50000,
    currency: "USD",
    startDate: "2024-12-20",
    endDate: "2024-12-27",
    status: "planned",
    totalSpent: 15000,
    participantCount: 5,
    settledCount: 2,
    createdAt: "2024-10-15T00:00:00Z",
  },
  {
    id: "2",
    userId: "1",
    name: "Birthday Party - Rahul",
    description: "Rahul's 10th birthday celebration",
    budget: 20000,
    currency: "USD",
    startDate: "2024-07-15",
    status: "completed",
    totalSpent: 18500,
    participantCount: 25,
    settledCount: 25,
    createdAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "3",
    userId: "1",
    name: "Home Renovation",
    description: "Kitchen and bathroom renovation",
    budget: 150000,
    currency: "USD",
    startDate: "2024-08-01",
    status: "ongoing",
    totalSpent: 85000,
    participantCount: 3,
    settledCount: 0,
    createdAt: "2024-07-20T00:00:00Z",
  },
];

const statusStyles: Record<string, string> = {
  planned: "bg-blue-100 text-blue-700",
  ongoing: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
};

const statusIcons: Record<string, React.ReactNode> = {
  planned: <Clock className="w-3 h-3" />,
  ongoing: <DollarSign className="w-3 h-3" />,
  completed: <CheckCircle className="w-3 h-3" />,
  cancelled: null,
};

export default function EventsPage() {
  const { isAuthenticated } = useAuthStore();
  const [events] = useState(mockEvents);
  const [showAddModal, setShowAddModal] = useState(false);

  if (!isAuthenticated) {
    redirect("/auth/login");
  }

  return (
    <DashboardLayout title="Events" activeItem="events">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Expenses</h1>
            <p className="text-gray-500">Manage event budgets and split expenses</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                <p className="text-sm text-gray-500">Total Events</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter((e) => e.status === "completed").length}
                </p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(events.reduce((sum, e) => sum + e.totalSpent, 0))}
                </p>
                <p className="text-sm text-gray-500">Total Spent</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Events List */}
        <div className="grid gap-4">
          {events.map((event) => {
            const budgetUsed = (event.totalSpent / event.budget) * 100;
            
            return (
              <Card key={event.id} hover className="group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{event.name}</h3>
                      <Badge
                        variant={event.status === "completed" ? "success" : event.status === "ongoing" ? "warning" : "info"}
                        size="sm"
                      >
                        {statusIcons[event.status as keyof typeof statusIcons]}
                        <span className="ml-1 capitalize">{event.status}</span>
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Budget Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-medium">
                      {formatCurrency(event.totalSpent)} / {formatCurrency(event.budget)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        budgetUsed > 90 ? "bg-red-500" : budgetUsed > 70 ? "bg-orange-500" : "bg-green-500"
                      )}
                      style={{ width: `${Math.min(100, budgetUsed)}%` }}
                    />
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.startDate)}
                    {event.endDate && ` - ${formatDate(event.endDate)}`}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {event.participantCount} participants
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {event.settledCount}/{event.participantCount} settled
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Participants
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Add Event Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Create Event"
          size="lg"
        >
          <div className="space-y-4">
            <Input label="Event Name" placeholder="e.g., Goa Trip 2024" />
            <Input label="Description (optional)" placeholder="Brief description of the event" />
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" label="Budget" placeholder="50000" />
              <Input type="date" label="Start Date" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input type="date" label="End Date (optional)" />
              <Input type="number" label="Expected Participants" placeholder="5" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button>Create Event</Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
