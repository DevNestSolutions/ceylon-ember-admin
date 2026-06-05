import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Calendar, CheckCircle2, Clock, Utensils, ArrowRight, UserCheck } from "lucide-react";
import { toast } from "sonner";

interface Reservation {
  id: string;
  name: string;
  email: string;
  date: string;
  guests: number;
  status: string;
  createdAt: string;
}

interface Dish {
  id: string;
  name: string;
  isActive: boolean;
}

interface DashboardProps {
  setCurrentPage: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resResponse, dishesResponse] = await Promise.all([
          api.get("/reservations"),
          api.get("/dishes/all"),
        ]);
        setReservations(resResponse.data);
        setDishes(dishesResponse.data);
      } catch (error) {
        console.error("Dashboard data load failed:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalReservations = reservations.length;
  const pendingCount = reservations.filter((r) => r.status === "PENDING").length;
  const confirmedCount = reservations.filter((r) => r.status === "CONFIRMED").length;
  const activeDishesCount = dishes.filter((d) => d.isActive).length;

  const recentReservations = [...reservations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: "Total Bookings",
      value: totalReservations,
      icon: Calendar,
      color: "from-blue-500/10 to-indigo-500/5",
      iconColor: "text-blue-400",
    },
    {
      label: "Pending Approvals",
      value: pendingCount,
      icon: Clock,
      color: "from-amber-500/10 to-orange-500/5",
      iconColor: "text-amber-400",
    },
    {
      label: "Confirmed Seats",
      value: confirmedCount,
      icon: CheckCircle2,
      color: "from-emerald-500/10 to-teal-500/5",
      iconColor: "text-emerald-400",
    },
    {
      label: "Active Menu Items",
      value: activeDishesCount,
      icon: Utensils,
      color: "from-gold/10 to-ember/5",
      iconColor: "text-gold",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[2rem] glass-card p-6 md:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-2xl" />
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-light text-white md:text-3xl">
              Greetings, Administrator
            </h1>
            <p className="mt-1.5 text-sm text-gray-400">
              Here is what's happening at The Ceylon Ember Restaurant today.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentPage("reservations")}
              className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10"
            >
              Manage Bookings <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`relative overflow-hidden rounded-[1.5rem] glass-card p-6 bg-gradient-to-br ${stat.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                  {stat.label}
                </span>
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-light text-white">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Activity & Quick Links */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Reservations Table */}
        <div className="lg:col-span-2 rounded-[2rem] glass-card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-light text-white">Recent Reservation Requests</h2>
            <button
              onClick={() => setCurrentPage("reservations")}
              className="text-xs font-semibold text-gold hover:text-white flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-widest font-medium">
                  <th className="pb-3">Guest</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-center">Party</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {recentReservations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No reservations yet.
                    </td>
                  </tr>
                ) : (
                  recentReservations.map((res) => (
                    <tr key={res.id} className="group hover:bg-white/[0.01]">
                      <td className="py-3.5 pr-3">
                        <div className="font-medium text-white">{res.name}</div>
                        <div className="text-xs text-gray-500">{res.email}</div>
                      </td>
                      <td className="py-3.5 text-gray-400">{res.date}</td>
                      <td className="py-3.5 text-center text-gray-300 font-medium">
                        {res.guests}
                      </td>
                      <td className="py-3.5 text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold ${
                            res.status === "CONFIRMED"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : res.status === "CANCELLED"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operations panel */}
        <div className="rounded-[2rem] glass-card p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-light text-white font-serif">Quick Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => setCurrentPage("menu")}
              className="flex w-full items-center justify-between rounded-2xl bg-white/5 border border-white/5 p-4 text-left transition-all hover:bg-white/10 hover:border-gold/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold group-hover:bg-gold/25 transition-colors">
                  <Utensils className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Add New Dish</h3>
                  <p className="text-xs text-gray-500">Create new items on the menu</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => setCurrentPage("reservations")}
              className="flex w-full items-center justify-between rounded-2xl bg-white/5 border border-white/5 p-4 text-left transition-all hover:bg-white/10 hover:border-gold/30 group"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-400 group-hover:bg-amber-500/25 transition-colors">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Pending Requests</h3>
                  <p className="text-xs text-gray-500">Review {pendingCount} bookings</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
