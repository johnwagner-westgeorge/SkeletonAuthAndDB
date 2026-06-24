/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Save, CheckCircle2, Database, Lock, History, Trash2 } from "lucide-react";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSavedText, setLastSavedText] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("skeleton_saved_items");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedItems(parsed);
          if (parsed.length > 0) {
            setLastSavedText(parsed[0]);
          }
        }
      } catch (e) {
        console.error("Failed to parse saved items", e);
      }
    }
  }, []);

  // Save text to list
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const updated = [trimmed, ...savedItems].slice(0, 50); // Keep up to 50 items
    setSavedItems(updated);
    setLastSavedText(trimmed);
    localStorage.setItem("skeleton_saved_items", JSON.stringify(updated));
    setInputText("");
    
    // Trigger temporary success state
    setShowSuccess(true);
    const timer = setTimeout(() => setShowSuccess(false), 3000);
    return () => clearTimeout(timer);
  };

  // Clear history
  const handleClear = () => {
    setSavedItems([]);
    setLastSavedText("");
    localStorage.removeItem("skeleton_saved_items");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-x-hidden selection:bg-slate-200">
      {/* Navigation / Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-6 bg-white border-b border-slate-200 w-full shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm italic">S</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">SkeletonAuthAndDB</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5 animate-pulse"></span>
            Development Mode
          </span>
          <button className="text-sm text-slate-400 cursor-not-allowed hover:text-slate-500 transition-colors" disabled title="Authentication not enabled yet">
            Login
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-10 py-12 w-full max-w-7xl mx-auto">
        <div className="w-full max-w-xl space-y-8">
          
          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl flex gap-4 text-left">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="text-sm text-blue-700 leading-relaxed">
              This is a skeletal structure for learning. Currently, data is handled locally. 
              Authentication and SQL storage layers will be added in upcoming steps.
            </p>
          </div>

          {/* Input Section / Card */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200 p-8 md:p-10">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label htmlFor="string-input" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Storage Payload
                </label>
                <input
                  id="string-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to store..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-4 text-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                  maxLength={200}
                />
              </div>

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-full bg-slate-900 text-white font-medium py-4 rounded-xl hover:bg-slate-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 cursor-pointer"
              >
                <span>Save to Database</span>
                <Save className="w-4 h-4" />
              </button>
            </form>

            {/* Success Indicator */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-800 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    Saved locally: <strong className="font-medium">"{lastSavedText}"</strong>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Last Saved Preview */}
            {lastSavedText && !showSuccess && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Last Saved Value
                </span>
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-700 text-sm font-mono truncate">
                  "{lastSavedText}"
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity / History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Recent Local Saves {savedItems.length > 0 ? `(${savedItems.length})` : ""}
              </h3>
              {savedItems.length > 0 && (
                <button
                  onClick={handleClear}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  title="Clear all saved history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {savedItems.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 font-mono">
                No items saved yet. Enter a string above.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {savedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white border border-slate-200 px-4 py-3 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <span className="text-sm text-slate-600 font-mono truncate mr-4">"{item}"</span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {index === 0 ? "Just now" : `Entry #${savedItems.length - index}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Context */}
      <footer className="py-8 px-6 md:px-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center bg-white gap-4 w-full shrink-0">
        <div className="text-[11px] text-slate-400 font-mono">
          ROOT: /index.html | STATUS: UNPROTECTED
        </div>
        <div className="flex gap-6">
          <span className="text-[11px] text-slate-900 font-bold uppercase tracking-tighter">
            Step 1: Setup Layout
          </span>
          <span className="text-[11px] text-slate-300 font-bold uppercase tracking-tighter" title="Future step">
            Step 2: Add Auth
          </span>
          <span className="text-[11px] text-slate-300 font-bold uppercase tracking-tighter" title="Future step">
            Step 3: Connect SQL
          </span>
        </div>
      </footer>
    </div>
  );
}
