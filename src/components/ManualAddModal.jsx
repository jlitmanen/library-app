import { useState } from "react";
import { X, Save } from "lucide-react";

export default function ManualAddModal({ onSave, onClose }) {
  const [book, setBook] = useState({
    title: "",
    author: "",
    category: "General",
    thumbnail: "",
    isbn: "",
  });

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black tracking-tight">
              Add Book Details
            </h3>
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Book Title
              </label>
              <input
                autoFocus
                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                value={book.title}
                onChange={(e) => setBook({ ...book, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Author
              </label>
              <input
                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                value={book.author}
                onChange={(e) => setBook({ ...book, author: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Category
                </label>
                <input
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                  value={book.category}
                  onChange={(e) =>
                    setBook({ ...book, category: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  ISBN (Optional)
                </label>
                <input
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                  value={book.isbn}
                  onChange={(e) => setBook({ ...book, isbn: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            disabled={!book.title}
            onClick={() => onSave(book)}
            className="w-full mt-8 bg-indigo-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} /> Save to Library
          </button>
        </div>
      </div>
    </div>
  );
}
