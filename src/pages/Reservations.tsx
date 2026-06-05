import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Check, XCircle, Trash2, Search, Filter, Mail, Users, Calendar } from "lucide-react";
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

export const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL, PENDING, CONFIRMED, CANCELLED

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await api.get("/reservations");
      setReservations(response.data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
      toast.error("Failed to load reservations list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/reservations/${id}/status`, { status: newStatus });
      toast.success(`Reservation status updated to ${newStatus}`);
      // Optimistic state update or full refresh
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update reservation status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this reservation? This cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/reservations/${id}`);
      toast.success("Reservation deleted successfully");
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Failed to delete reservation:", error);
      toast.error("Failed to delete reservation");
    }
  };

  // Search & Filter Logic
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl glass-card p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guest name or email..."
            className="w-full rounded-xl border border-white/5 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:border-gold/30"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <div className="flex rounded-lg bg-black/35 p-1">
            {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  filter === status
                    ? "bg-gradient-to-br from-gold to-ember text-bg-dark shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {status.slice(0, 4)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="overflow-hidden rounded-[2rem] glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/10 text-gray-500 text-xs uppercase tracking-widest font-medium">
                <th className="px-6 py-4">Guest Info</th>
                <th className="px-6 py-4">Booking Details</th>
                <th className="px-6 py-4 text-center">Party Size</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No reservations found matching your search.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => (
                  <tr key={res.id} className="group hover:bg-white/[0.01] transition-colors">
                    {/* Guest info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{res.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                        <Mail className="h-3.5 w-3.5" />
                        {res.email}
                      </div>
                    </td>

                    {/* Booking Date & Submission date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-300 font-medium">
                        <Calendar className="h-4 w-4 text-gold" />
                        {res.date}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        Received: {new Date(res.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Guests count */}
                    <td className="px-6 py-4 text-center whitespace-nowrap font-medium text-gray-200">
                      <div className="flex items-center justify-center gap-1.5">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{res.guests}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold ${
                          res.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                            : res.status === "CANCELLED"
                              ? "bg-red-500/10 text-red-400 border border-red-500/10"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {res.status !== "CONFIRMED" && (
                          <button
                            onClick={() => handleUpdateStatus(res.id, "CONFIRMED")}
                            title="Confirm Booking"
                            className="rounded-lg p-1.5 hover:bg-emerald-950/20 text-gray-500 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/20"
                          >
                            <Check className="h-4.5 w-4.5" />
                          </button>
                        )}
                        {res.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleUpdateStatus(res.id, "CANCELLED")}
                            title="Cancel Booking"
                            className="rounded-lg p-1.5 hover:bg-red-950/20 text-gray-500 hover:text-red-400/80 transition-all border border-transparent hover:border-red-500/20"
                          >
                            <XCircle className="h-4.5 w-4.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(res.id)}
                          title="Delete Reservation"
                          className="rounded-lg p-1.5 hover:bg-red-950/30 text-gray-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/40"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
