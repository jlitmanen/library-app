import React, { useState, useEffect } from "react";
import { CheckCircle, Plus, Filter, Edit } from "lucide-react";
import pb from "../pocketbase";
import DiscoveryModal from "./DiscoveryModal";
import EditBookModal from "./EditBookModal";

export default function LibraryManager({ activeLib }) {
  const [books, setBooks] = useState([]);
  const [localQuery, setLocalQuery] = useState(""); // Search OWNED books
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const userId = pb.authStore.model.id;
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'read', 'unread'
  const [activeCategory, setActiveCategory] = useState(null);
  const [editingBook, setEditingBook] = useState(null);

  // 1. Get unique categories from your actual books
  const categories = [...new Set(books.map((b) => b.category))]
    .filter(Boolean)
    .slice(0, 5);

  useEffect(() => {
    fetchBooks();
  }, [activeLib]);

  const fetchBooks = async () => {
    const records = await pb.collection("books").getFullList({
      filter: `library = "${activeLib.id}"`,
      sort: "-created",
    });
    setBooks(records);
  };

  // 2. Refined filtering logic
  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(localQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(localQuery.toLowerCase());

    const isRead = b.readers.includes(userId);
    const matchesStatus =
      activeFilter === "all" || (activeFilter === "read" ? isRead : !isRead);

    const matchesCategory = !activeCategory || b.category === activeCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const toggleRead = async (book) => {
    const isRead = book.readers.includes(userId);
    const data = isRead ? { "readers-": userId } : { "readers+": userId };
    await pb.collection("books").update(book.id, data);
    fetchBooks();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {isDiscoveryOpen && (
        <DiscoveryModal
          activeLib={activeLib}
          onClose={() => setIsDiscoveryOpen(false)}
          onAdded={fetchBooks}
        />
      )}
      <header className="p-6 border-b border-slate-50 flex justify-between items-end bg-white/80 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black tracking-tight">
            {activeLib.name}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {books.length} Books in collection
          </p>
        </div>
        <button
          onClick={() => setIsDiscoveryOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus size={16} strokeWidth={3} /> Add New Book
        </button>
      </header>
      {/* Local Library Search */}
      <div className="px-6 lg:px-10 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3">
          <Filter size={14} className="text-slate-400" />
          <input
            className="bg-transparent outline-none w-full font-bold text-xs placeholder:text-slate-300"
            placeholder="Filter your collection by title or author..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="px-6 lg:px-10 py-4 space-y-4">
        {/* Status Filters */}
        <div className="flex gap-2">
          {["all", "read", "unread"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-400 border border-slate-200"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${!activeCategory ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-400 border-slate-200"}`}
          >
            All Genres
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory(cat === activeCategory ? null : cat)
              }
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === cat ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-400 border-slate-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {filteredBooks.map((book) => {
            const read = book.readers.includes(userId);
            return (
              <div key={book.id} className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-slate-100 border border-slate-200 mb-4 relative shadow-sm group-hover:shadow-xl transition-all duration-300">
                  {/* Main Book Cover */}
                  <img
                    src={book.thumbnail || "/placeholder-book.png"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* EDIT BUTTON: Now correctly positioned relative to the 'group' parent */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBook(book);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-all z-10 text-slate-600 hover:text-indigo-600 shadow-sm"
                  >
                    <Edit size={16} />
                  </button>

                  {/* READ STATUS BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRead(book);
                    }}
                    className={`absolute bottom-3 right-3 p-2.5 rounded-xl shadow-lg transition-all z-10 ${
                      read
                        ? "bg-emerald-500 text-white"
                        : "bg-white/90 text-slate-400"
                    }`}
                  >
                    <CheckCircle size={18} />
                  </button>
                </div>

                {/* Text Details */}
                <h4 className="text-sm font-black truncate px-1">
                  {book.title}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate px-1">
                  {book.author}
                </p>
              </div>
            );
          })}
        </div>

        {/* MODALS: Keep these at the very bottom, outside of the mapping loop */}
        {editingBook && (
          <EditBookModal
            book={editingBook}
            onClose={() => setEditingBook(null)}
            onSave={() => {
              fetchBooks();
              setEditingBook(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
