import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Lock, Plus, Trash2, Pencil, X, Check, UtensilsCrossed } from "lucide-react";

const PASSWORD = "kelly";
const STORAGE_KEY = "mealtrain:entries";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function dateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function MealTrain() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const [entries, setEntries] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState(false);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const [editingKey, setEditingKey] = useState(null);
  const [draftMeal, setDraftMeal] = useState("");
  const [draftCook, setDraftCook] = useState("");

  // Load shared data once authed
  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, true);
        if (!cancelled && res && res.value) {
          setEntries(JSON.parse(res.value));
        }
      } catch (e) {
        // key likely doesn't exist yet — start empty, not an error
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [authed]);

  async function persist(next) {
    setEntries(next);
    setSaveError(false);
    try {
      const res = await window.storage.set(STORAGE_KEY, JSON.stringify(next), true);
      if (!res) setSaveError(true);
    } catch (e) {
      setSaveError(true);
    }
  }

  function tryLogin() {
    if (pwInput.trim().toLowerCase() === PASSWORD) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  function openEditor(key) {
    const existing = entries[key];
    setDraftMeal(existing ? existing.meal : "");
    setDraftCook(existing ? existing.cook : "");
    setEditingKey(key);
  }

  function closeEditor() {
    setEditingKey(null);
    setDraftMeal("");
    setDraftCook("");
  }

  function saveEntry() {
    if (!draftMeal.trim() || !draftCook.trim()) return;
    const next = { ...entries, [editingKey]: { meal: draftMeal.trim(), cook: draftCook.trim() } };
    persist(next);
    closeEditor();
  }

  function deleteEntry(key) {
    const next = { ...entries };
    delete next[key];
    persist(next);
    closeEditor();
  }

  function changeMonth(delta) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m);
    setViewYear(y);
  }

  // ---------- Login screen ----------
  if (!authed) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-stone-800 rounded-2xl p-8 border border-stone-700">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center">
              <UtensilsCrossed className="text-orange-400" size={26} />
            </div>
          </div>
          <h1 className="text-xl font-semibold text-stone-100 text-center">Meal Train</h1>
          <p className="text-stone-400 text-sm text-center mt-1 mb-6">Enter the password to view the calendar</p>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
            <input
              type="password"
              value={pwInput}
              autoFocus
              onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={(e) => e.key === "Enter" && tryLogin()}
              placeholder="Password"
              className="w-full bg-stone-900 border border-stone-700 rounded-lg pl-9 pr-3 py-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-orange-500"
            />
          </div>
          {pwError && <p className="text-red-400 text-xs mt-2">Wrong password — try again.</p>}
          <button
            onClick={tryLogin}
            className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg py-2.5 transition-colors"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  // ---------- Calendar ----------
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const editingEntry = editingKey ? entries[editingKey] : null;

  return (
    <div className="min-h-screen bg-stone-900 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
            <UtensilsCrossed className="text-orange-400" size={22} /> Meal Train
          </h1>
        </div>
        <p className="text-stone-400 text-sm mb-5">Tap a day to add who's cooking and what. One meal per day.</p>

        {saveError && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-3 py-2">
            Couldn't save your change. Check your connection and try again.
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-lg hover:bg-stone-800 text-stone-300">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-medium text-stone-100">{MONTHS[viewMonth]} {viewYear}</h2>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-lg hover:bg-stone-800 text-stone-300">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {DOW.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-stone-500 py-1">{d}</div>
          ))}
        </div>

        {loading ? (
          <div className="text-stone-500 text-center py-12">Loading calendar…</div>
        ) : (
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((d, i) => {
              if (d === null) return <div key={`e${i}`} />;
              const key = dateKey(viewYear, viewMonth, d);
              const entry = entries[key];
              const isToday =
                d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
              return (
                <button
                  key={key}
                  onClick={() => openEditor(key)}
                  className={`min-h-[78px] sm:min-h-[92px] rounded-lg p-1.5 text-left flex flex-col border transition-colors ${
                    entry
                      ? "bg-orange-500/15 border-orange-500/40 hover:bg-orange-500/25"
                      : "bg-stone-800 border-stone-700 hover:border-stone-600"
                  }`}
                >
                  <span className={`text-xs font-medium ${isToday ? "text-orange-400" : "text-stone-400"}`}>
                    {d}{isToday && " •"}
                  </span>
                  {entry ? (
                    <span className="mt-0.5 flex-1 overflow-hidden">
                      <span className="block text-[11px] leading-tight text-stone-100 font-medium line-clamp-2">{entry.meal}</span>
                      <span className="block text-[10px] text-orange-300/80 mt-0.5 truncate">{entry.cook}</span>
                    </span>
                  ) : (
                    <span className="mt-auto self-end text-stone-600"><Plus size={14} /></span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Editor modal */}
      {editingKey && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center p-4 z-10" onClick={closeEditor}>
          <div className="w-full max-w-sm bg-stone-800 rounded-2xl p-5 border border-stone-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-stone-100 font-medium">
                {editingEntry ? "Edit meal" : "Add meal"} — {editingKey}
              </h3>
              <button onClick={closeEditor} className="text-stone-400 hover:text-stone-200"><X size={18} /></button>
            </div>

            <label className="block text-xs text-stone-400 mb-1">What's being made</label>
            <input
              value={draftMeal}
              autoFocus
              onChange={(e) => setDraftMeal(e.target.value)}
              placeholder="e.g. Lasagna + salad"
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-orange-500 mb-3"
            />

            <label className="block text-xs text-stone-400 mb-1">Who's making it</label>
            <input
              value={draftCook}
              onChange={(e) => setDraftCook(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveEntry()}
              placeholder="e.g. Aunt Sarah"
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-orange-500 mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={saveEntry}
                disabled={!draftMeal.trim() || !draftCook.trim()}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-stone-700 disabled:text-stone-500 text-white font-medium rounded-lg py-2.5 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Check size={16} /> Save
              </button>
              {editingEntry && (
                <button
                  onClick={() => deleteEntry(editingKey)}
                  className="px-4 bg-red-500/15 hover:bg-red-500/25 text-red-300 rounded-lg flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
