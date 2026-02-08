import React, { useState } from "react";
import { X, Search, ScanLine, Plus, Loader2, FileText } from "lucide-react";
import pb from "../pocketbase";
import BulkImportModal from "./BulkImportModal";

export default function DiscoveryModal({ activeLib, onClose, onAdded }) {
  const [searchType, setSearchType] = useState("all"); // 'all', 'title', 'author', 'isbn'
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBulk, setShowBulk] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);

    // 1. Get your key from environment variables
    const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY;

    // 2. Build the specific query
    let q = query;
    if (searchType === "title") q = `intitle:${query}`;
    if (searchType === "author") q = `inauthor:${query}`;
    if (searchType === "isbn") q = `isbn:${query.replace(/-/g, "")}`;

    try {
      // 3. Append &key= to the URL
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=6&key=${API_KEY}`;
      const res = await fetch(url);

      if (res.status === 429) {
        alert(
          "Rate limit reached. Please wait a minute or check your Google Cloud Console quota.",
        );
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResults(
        data.items?.map((i) => ({
          title: i.volumeInfo.title,
          author: i.volumeInfo.authors?.[0] || "Unknown",
          thumbnail: i.volumeInfo.imageLinks?.thumbnail?.replace(
            "http:",
            "https:",
          ),
          category: i.volumeInfo.categories?.[0] || "General",
          isbn:
            i.volumeInfo.industryIdentifiers?.find((id) =>
              id.type.includes("ISBN"),
            )?.identifier || "",
        })) || [],
      );
    } catch (err) {
      console.error("Search failed:", err);
    }
    setLoading(false);
  };

  const addBook = async (book) => {
    await pb
      .collection("books")
      .create({ ...book, library: activeLib.id, readers: [] });
    onAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-black">Find New Books</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
          {/* Search Controls */}
          <div className="space-y-4 mb-8">
            <div className="flex gap-2">
              {["all", "title", "author", "isbn"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSearchType(t)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${searchType === t ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}
                >
                  {t}
                </button>
              ))}
              <button
                onClick={() => setShowBulk(true)}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest"
              >
                <FileText size={14} /> Bulk Import
              </button>

              {showBulk && (
                <BulkImportModal
                  activeLib={activeLib}
                  onClose={() => setShowBulk(false)}
                  onComplete={onAdded}
                />
              )}
            </div>

            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-slate-100 rounded-2xl px-5 py-4 gap-3 focus-within:ring-2 ring-indigo-100 transition-all">
                <Search className="text-slate-400" size={18} />
                <input
                  className="bg-transparent outline-none w-full font-bold text-sm"
                  placeholder={`Search by ${searchType}...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-slate-900 text-white px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Search"}
              </button>
            </div>
          </div>

          {/* Results List */}
          <div className="grid grid-cols-1 gap-3">
            {results.map((b, i) => (
              <div
                key={i}
                onClick={() => addBook(b)}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 cursor-pointer rounded-2xl border border-slate-100 transition-all group"
              >
                <img
                  src={b.thumbnail}
                  className="w-12 h-16 object-cover rounded-lg shadow-sm bg-slate-200"
                />
                <div className="flex-1">
                  <p className="font-bold text-sm leading-tight">{b.title}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase mt-1">
                    {b.author}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 p-2 rounded-xl">
                  <Plus size={20} className="text-indigo-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
