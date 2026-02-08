import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { X } from "lucide-react";

export default function BarcodeScanner({ onScan, onClose }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 150 }, // Aspect ratio for ISBN barcodes
    });

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText) {
      scanner.clear(); // Stop scanning after success
      onScan(decodedText);
    }

    function onScanFailure(error) {
      // Ignore constant scanning failures (standard behavior)
    }

    return () => scanner.clear();
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      <div className="p-4 flex justify-between items-center text-white">
        <h3 className="font-bold uppercase tracking-widest text-xs">
          Scan ISBN Barcode
        </h3>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full">
          <X />
        </button>
      </div>
      <div id="reader" className="flex-1"></div>
      <div className="p-8 text-center text-white/50 text-[10px] font-medium uppercase tracking-widest">
        Position the barcode inside the box
      </div>
    </div>
  );
}
