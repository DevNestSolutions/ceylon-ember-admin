import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, X } from "lucide-react";
import { toast } from "sonner";

interface Dish {
  id: string;
  name: string;
  price: string;
  tag: string;
  img: string;
  desc: string;
  isActive: boolean;
}

export const Menu: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [tag, setTag] = useState("Signature");
  const [img, setImg] = useState("");
  const [desc, setDesc] = useState("");

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/dishes/all");
      setDishes(response.data);
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleOpenAdd = () => {
    setEditingDish(null);
    setName("");
    setPrice("");
    setTag("Signature");
    setImg("");
    setDesc("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dish: Dish) => {
    setEditingDish(dish);
    setName(dish.name);
    setPrice(dish.price);
    setTag(dish.tag);
    setImg(dish.img);
    setDesc(dish.desc);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !tag || !img || !desc) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingDish) {
        // Edit Mode
        const response = await api.put(`/dishes/${editingDish.id}`, {
          name,
          price,
          tag,
          img,
          desc,
          isActive: editingDish.isActive,
        });
        toast.success("Dish updated successfully");
        setDishes((prev) =>
          prev.map((d) => (d.id === editingDish.id ? response.data : d))
        );
      } else {
        // Add Mode
        const response = await api.post("/dishes", {
          name,
          price,
          tag,
          img,
          desc,
        });
        toast.success("New dish added successfully");
        setDishes((prev) => [response.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save dish:", error);
      toast.error("Failed to save dish. Please check database configuration.");
    }
  };

  const handleToggleActive = async (dish: Dish) => {
    try {
      const newStatus = !dish.isActive;
      await api.put(`/dishes/${dish.id}`, {
        ...dish,
        isActive: newStatus,
      });
      toast.success(`Dish "${dish.name}" is now ${newStatus ? "Active" : "Hidden"}`);
      setDishes((prev) =>
        prev.map((d) => (d.id === dish.id ? { ...d, isActive: newStatus } : d))
      );
    } catch (error) {
      console.error("Failed to toggle active state:", error);
      toast.error("Failed to update dish status");
    }
  };

  const handleDelete = async (id: string, dishName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${dishName}"?`)) {
      return;
    }

    try {
      await api.delete(`/dishes/${id}`);
      toast.success("Dish deleted successfully");
      setDishes((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Failed to delete dish:", error);
      toast.error("Failed to delete dish");
    }
  };

  const filteredDishes = dishes.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.tag.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Action Header */}
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
            placeholder="Search by dish name or category tag..."
            className="w-full rounded-xl border border-white/5 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-505 focus:border-gold/30"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-gold to-ember px-5 py-2.5 text-sm font-semibold text-bg-dark hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Add Menu Item
        </button>
      </div>

      {/* Dishes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDishes.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-500 glass-card rounded-3xl">
            No dishes found on the menu.
          </div>
        ) : (
          filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className={`relative flex flex-col overflow-hidden rounded-3xl glass-card transition-all border ${
                dish.isActive
                  ? "border-white/5 hover:border-gold/20"
                  : "border-white/5 opacity-55 hover:opacity-80"
              }`}
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                <img
                  src={dish.img}
                  alt={dish.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent p-4 flex items-end justify-between">
                  <span className="rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-gold font-medium">
                    {dish.tag}
                  </span>
                  <span className="rounded-full bg-gradient-to-br from-gold to-ember px-3 py-0.5 text-xs font-semibold text-bg-dark">
                    {dish.price}
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 p-5 flex flex-col">
                <h3 className="text-lg font-light text-white leading-snug">{dish.name}</h3>
                <p className="mt-2 text-xs text-gray-400 line-clamp-2 flex-1">{dish.desc}</p>

                {/* Card actions */}
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500">
                    Status: <span className={dish.isActive ? "text-green-500" : "text-red-500"}>{dish.isActive ? "Visible" : "Hidden"}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Toggle Active status */}
                    <button
                      onClick={() => handleToggleActive(dish)}
                      title={dish.isActive ? "Hide Dish" : "Show Dish"}
                      className="rounded-lg p-1.5 hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                      {dish.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEdit(dish)}
                      title="Edit Item"
                      className="rounded-lg p-1.5 hover:bg-white/5 text-gray-400 hover:text-gold transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(dish.id, dish.name)}
                      title="Delete Item"
                      className="rounded-lg p-1.5 hover:bg-red-950/20 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal Popup Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] glass-card bg-bg-dark p-6 md:p-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 rounded-lg p-1.5 hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-serif text-xl font-light text-white mb-6 pr-8">
              {editingDish ? `Edit: ${editingDish.name}` : "Create New Menu Item"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1.5 text-xs uppercase tracking-wider text-gray-400 font-medium">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wagyu Reserve"
                  className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-gold/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-xs uppercase tracking-wider text-gray-400 font-medium">
                    Price
                  </label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. $148"
                    className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-gold/30"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-xs uppercase tracking-wider text-gray-400 font-medium">
                    Category Tag
                  </label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-gold/30"
                  >
                    <option value="Signature">Signature</option>
                    <option value="Ocean">Ocean</option>
                    <option value="Chef's Special">Chef's Special</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-xs uppercase tracking-wider text-gray-400 font-medium">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-gold/30"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs uppercase tracking-wider text-gray-400 font-medium">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="A5 wagyu, smoked bone marrow, charred shallot jus..."
                  className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-gold/30 resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl bg-white/5 border border-white/5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-br from-gold to-ember py-3 text-sm font-semibold text-bg-dark hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
                >
                  {editingDish ? "Save Changes" : "Create Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
