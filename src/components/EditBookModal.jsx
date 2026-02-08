import React, { useState } from "react";
import { X, Save, Upload, Image as ImageIcon } from "lucide-react";
import pb from "../pocketbase";

export default function EditBookModal({ book, onSave, onClose }) {
  const [formData, setFormData] = useState({ ...book });
  const [uploadFile, setUploadFile] = useState(null);

  const handleSubmit = async () => {
    const data = new FormData();
    // Add text fields
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("category", formData.category);
    data.append("thumbnail", formData.thumbnail); // The URL

    // Add the actual file if user uploaded one
    if (uploadFile) {
      data.append("image", uploadFile);
    }

    try {
      const record = await pb.collection("books").update(book.id, data);
      onSave(record);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-black italic tracking-tight">
            Edit Book
          </h3>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
          {/* Cover Image Section */}
          <div className="flex gap-6 items-start">
            <div className="w-24 h-32 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
              {uploadFile || formData.thumbnail ? (
                <img
                  src={
                    uploadFile
                      ? URL.createObjectURL(uploadFile)
                      : formData.thumbnail
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Cover Image
              </label>
              <input
                className="w-full bg-slate-50 rounded-xl p-3 text-xs font-bold outline-none"
                placeholder="Image URL..."
                value={formData.thumbnail}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
              />
              <label className="flex items-center justify-center gap-2 w-full p-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase cursor-pointer hover:bg-indigo-100 transition-colors">
                <Upload size={14} />{" "}
                {uploadFile ? "Change File" : "Upload File"}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Title
              </label>
              <input
                className="w-full bg-slate-50 rounded-2xl p-4 font-bold text-sm outline-none focus:ring-2 ring-indigo-50"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Author
              </label>
              <input
                className="w-full bg-slate-50 rounded-2xl p-4 font-bold text-sm outline-none focus:ring-2 ring-indigo-50"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Category
              </label>
              <input
                className="w-full bg-slate-50 rounded-2xl p-4 font-bold text-sm outline-none focus:ring-2 ring-indigo-50"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-4 bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95"
          >
            Update Book Details
          </button>
        </div>
      </div>
    </div>
  );
}
