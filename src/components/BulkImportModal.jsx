import { useState } from "react";
import { X, FileText, Loader2, CheckCircle2 } from "lucide-react";

import pb from "../pocketbase";

export default function BulkImportModal({ activeLib, onClose, onComplete }) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle', 'processing', 'done'
  const [results, setResults] = useState({ success: 0, failed: 0 });

  const processImport = async () => {
    // Split by new lines or commas and clean up
    const isbns = input
      .split(/[\n,]+/)
      .map((s) => s.trim().replace(/-/g, ""))
      .filter((s) => s.length >= 10);

    if (isbns.length === 0)
      return alert("Please enter at least one valid ISBN");

    setStatus("processing");
    let successCount = 0;
    let failCount = 0;

    for (const isbn of isbns) {
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`,
        );
        const data = await res.json();

        if (data.items && data.items.length > 0) {
          const i = data.items[0].volumeInfo;
          await pb.collection("books").create({
            title: i.title,
            author: i.authors?.[0] || "Unknown",
            thumbnail: i.imageLinks?.thumbnail?.replace("http:", "https:"),
            category: i.categories?.[0] || "General",
            isbn: isbn,
            library: activeLib.id,
            readers: [],
          });
          successCount++;
        } else {
          failCount++;
        }
        // Small delay to prevent Google 503 errors
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (err) {
        failCount++;
      }
      setResults({ success: successCount, failed: failCount });
    }

    setStatus("done");
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-110 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black">Bulk ISBN Import</h3>
            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full">
              <X size={20} />
            </button>
          </div>

          {status === "idle" ? (
            <>
              <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                Paste ISBNs (one per line or comma-separated)
              </p>
              <textarea
                className="w-full h-48 bg-slate-50 border-none rounded-2xl p-4 font-mono text-sm focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                placeholder="9780141036144&#10;9780552149518&#10;0593230574"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                onClick={processImport}
                className="w-full mt-6 bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <FileText size={18} /> Start Importing
              </button>
            </>
          ) : (
            <div className="py-10 text-center">
              {status === "processing" ? (
                <Loader2
                  className="animate-spin text-indigo-600 mx-auto mb-4"
                  size={40}
                />
              ) : (
                <CheckCircle2
                  className="text-emerald-500 mx-auto mb-4"
                  size={40}
                />
              )}
              <h4 className="font-black text-lg mb-2">
                {status === "processing" ? "Processing..." : "Import Complete!"}
              </h4>
              <div className="flex justify-center gap-4 text-xs font-bold uppercase tracking-widest">
                <span className="text-emerald-600">
                  {results.success} Added
                </span>
                <span className="text-red-400">{results.failed} Not Found</span>
              </div>
              {status === "done" && (
                <button
                  onClick={onClose}
                  className="mt-8 px-8 py-3 bg-slate-100 rounded-xl font-black text-[10px] uppercase"
                >
                  Close
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
