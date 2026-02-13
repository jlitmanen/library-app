import { useState, useEffect } from "react";
import {
  CheckCircle,
  Plus,
  Filter,
  Edit,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import DiscoveryModal from "./DiscoveryModal";
import EditBookModal from "./EditBookModal";

import pb from "../pocketbase";

export default function LibraryManager({ activeLib }) {
  const [books, setBooks] = useState([]);
  const [localQuery, setLocalQuery] = useState("");
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10; // Adjust this number as needed

  const userId = pb.authStore.model.id;
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState(null);
  const [editingBook, setEditingBook] = useState(null);

  // Categories still derived from the current page of books
  const categories = [...new Set(books.map((b) => b.category))]
    .filter(Boolean)
    .slice(0, 5);

  useEffect(() => {
    fetchBooks();
  }, [activeLib, currentPage, activeFilter, activeCategory, localQuery]);

  const fetchBooks = async () => {
    // Build PocketBase filter string
    let filterString = `library = "${activeLib.id}"`;

    if (activeFilter === "read") filterString += ` && readers ~ "${userId}"`;
    if (activeFilter === "unread") filterString += ` && readers !~ "${userId}"`;
    if (activeCategory) filterString += ` && category = "${activeCategory}"`;
    if (localQuery)
      filterString += ` && (title ~ "${localQuery}" || author ~ "${localQuery}")`;

    try {
      const resultList = await pb
        .collection("books")
        .getList(currentPage, itemsPerPage, {
          filter: filterString,
          sort: "title, author",
        });

      setBooks(resultList.items);
      setTotalPages(resultList.totalPages);
      setTotalItems(resultList.totalItems);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

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
            {totalItems} Books Total
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-indigo-600" : "text-slate-400"}`}
            >
              <List size={18} />
            </button>
          </div>
          <button
            onClick={() => setIsDiscoveryOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100"
          >
            <Plus size={16} strokeWidth={3} /> Add New
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="px-6 lg:px-10 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-4">
        <Filter size={14} className="text-slate-400" />
        <input
          className="bg-transparent outline-none w-full font-bold text-xs"
          placeholder="Search owned books..."
          value={localQuery}
          onChange={(e) => {
            setLocalQuery(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar">
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8"
              : "flex flex-col gap-3"
          }
        >
          {books.map((book) => {
            const read = book.readers.includes(userId);
            if (viewMode === "grid") {
              return (
                <div key={book.id} className="group cursor-pointer">
                  <div className="aspect-3/4 rounded-1.5rem overflow-hidden bg-slate-100 border border-slate-200 mb-4 relative shadow-sm group-hover:shadow-xl transition-all">
                    <img
                      src={book.thumbnail || "/placeholder-book.png"}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBook(book);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 text-slate-600 hover:text-indigo-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRead(book);
                      }}
                      className={`absolute bottom-3 right-3 p-2.5 rounded-xl shadow-lg ${read ? "bg-emerald-500 text-white" : "bg-white/90 text-slate-400"}`}
                    >
                      <CheckCircle size={18} />
                    </button>
                  </div>
                  <h4 className="text-sm font-black truncate">{book.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    {book.author}
                  </p>
                </div>
              );
            }
            return (
              <div
                key={book.id}
                className="group flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-2xl"
              >
                <img
                  src={book.thumbnail || "/placeholder-book.png"}
                  className="w-12 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black truncate">{book.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    {book.author}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingBook(book)}
                    className="p-2 text-slate-400 hover:text-indigo-600"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => toggleRead(book)}
                    className={`p-2 ${read ? "text-emerald-500" : "text-slate-200"}`}
                  >
                    <CheckCircle
                      size={22}
                      fill={read ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex justify-center items-center gap-6 bg-white">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

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
  );
}
