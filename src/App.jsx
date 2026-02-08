import React, { useState, useEffect } from "react";
import pb from "./pocketbase";
import LibraryManager from "./components/LibraryManager";
import AuthModal from "./components/AuthModal";
import { Library, LogOut, Layout, Settings } from "lucide-react";

export default function App() {
  const [user, setUser] = useState(pb.authStore.model);
  const [libraries, setLibraries] = useState([]);
  const [activeLib, setActiveLib] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!pb.authStore.isValid);

  const fetchLibraries = async () => {
    if (!pb.authStore.isValid) return;
    const records = await pb.collection("libraries").getFullList({
      filter: `readers ~ "${pb.authStore.model.id}"`,
      sort: "-created",
    });
    setLibraries(records);
    if (records.length > 0 && !activeLib) setActiveLib(records[0]);
  };

  useEffect(() => {
    fetchLibraries();
  }, [user]);

  if (isAuthModalOpen)
    return (
      <AuthModal
        onAuth={() => {
          setUser(pb.authStore.model);
          setIsAuthModalOpen(false);
        }}
      />
    );

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-[#F1F3F5] border-r border-slate-200 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <Library className="text-white" size={18} />
          </div>
          <span className="font-black tracking-tight text-lg">BookShelf</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Your Libraries
          </p>
          {libraries.map((lib) => (
            <button
              key={lib.id}
              onClick={() => setActiveLib(lib)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeLib?.id === lib.id ? "bg-white shadow-sm text-indigo-600 border border-slate-200" : "text-slate-500 hover:bg-slate-200"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${activeLib?.id === lib.id ? "bg-indigo-600" : "bg-slate-300"}`}
              />
              <span className="text-sm font-bold truncate">{lib.name}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-200 space-y-2">
          <button
            onClick={() => {
              pb.authStore.clear();
              window.location.reload();
            }}
            className="w-full flex items-center gap-2 p-3 text-slate-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white relative overflow-hidden">
        {activeLib ? (
          <LibraryManager activeLib={activeLib} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-200 p-10 text-center">
            <Library size={80} strokeWidth={0.5} />
            <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">
              Create a Library in PocketBase to start
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
