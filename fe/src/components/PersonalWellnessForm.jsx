// PersonalWellnessForm.jsx
import React, { useEffect, useState, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "./PersonalWellnessForm.css";

/* --------------------------------------------
   API Helper
-------------------------------------------- */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiFetch = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  return res;
};

/* --------------------------------------------
   CONSTANTS
-------------------------------------------- */
const HOBBIES = ["Reading", "Music", "Sports", "Art", "Gaming", "Travel", "Cooking", "Yoga"];

const MOODS = [
  { name: "Happy", icon: "😊" },
  { name: "Calm", icon: "😌" },
  { name: "Anxious", icon: "😰" },
  { name: "Sad", icon: "😢" },
  { name: "Excited", icon: "🤩" },
  { name: "Tired", icon: "😴" }
];

// Removed name & email completely
const DEFAULT = {
  hobbies: [],
  sleepHours: 7,
  studyHours: 2,
  exerciseMinutes: 20,
  meditation: false,
  reading: false,
  hydration: false,
  mood: "Calm",
  stressLevel: 3,
  energyLevel: 6,
  waterIntake: 2,
  reminderDate: "",
  quickSearch: "",
};

const DRAFT_KEY = "wellness_pro_form_v1";

/* --------------------------------------------
   UI COMPONENTS
-------------------------------------------- */

const RoundedSearch = memo(({ value, onChange, onClear }) => (
  <div className="search-box">
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Quick search habits..." />
    {value && <button type="button" className="icon-btn" onClick={onClear}>✖</button>}
  </div>
));

const MultiStep = memo(({ steps, current, onChange }) => (
  <div className="multi-step">
    <div className="multi-track">
      {steps.map((s, i) => (
        <div key={s} className={`step ${i <= current ? "done" : ""}`} onClick={() => onChange(i)}>
          <div className="dot">{i + 1}</div>
          <div className="label">{s}</div>
        </div>
      ))}
    </div>
    <div className="progress-mini">
      <div className="progress-fill" style={{ width: `${((current + 1) / steps.length) * 100}%` }} />
    </div>
  </div>
));

const Autosuggest = memo(({ value, onChange, suggestions }) => {
  const filtered = suggestions.filter(s =>
    s.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 6);

  return (
    <div className="autosuggest">
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Try 'sleep' or 'water'..." />
      {value && filtered.length > 0 && (
        <ul className="suggest-list">
          {filtered.map(s => <li key={s} onClick={() => onChange(s)}>{s}</li>)}
        </ul>
      )}
    </div>
  );
});

const Switch = ({ label, checked, onChange }) => (
  <label className="switch-inline">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className="toggle" />
    <span className="switch-label">{label}</span>
  </label>
);

const Slider = ({ label, value, min, max, step, onChange }) => (
  <div className="slider-block">
    <label className="range-label">{label}: <strong>{value}</strong></label>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))} />
  </div>
);

/* --------------------------------------------
   MAIN COMPONENT
-------------------------------------------- */
const PersonalWellnessForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT);
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState(0);
  const autoRef = useRef(null);

  /* -------- LOAD DATA ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try { setForm({ ...DEFAULT, ...JSON.parse(draft) }); } catch {}
    }

    fetchFromServer();

    autoRef.current = setInterval(() => {
      setForm(f => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(f));
        return f;
      });
    }, 8000);

    return () => clearInterval(autoRef.current);
  }, []);

  /* -------- Fetch from DB ---------- */
  const fetchFromServer = async () => {
    const res = await apiFetch("/wellness");
    if (!res || !res.ok) return;

    const data = await res.json();
    if (!data) return;

    // Only import DEFAULT fields
    const clean = {};
    for (const k of Object.keys(DEFAULT)) {
      clean[k] = data[k] !== undefined ? data[k] : DEFAULT[k];
    }

    setForm(clean);
  };

  /* -------- Update Form ---------- */
  const update = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setSaved(false);
  };

  const toggleHobby = (h) =>
    update("hobbies",
      form.hobbies.includes(h)
        ? form.hobbies.filter(x => x !== h)
        : [...form.hobbies, h]
    );

  /* -------- Submit ---------- */
  const submit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    const payload = { ...form, date: today };

    const res = await apiFetch("/wellness", "POST", payload);
    if (!res) return alert("Server offline");

    const result = await res.json();
    if (!res.ok) return alert(result.message || "Failed to save");

    localStorage.removeItem(DRAFT_KEY);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  /* -------- Score ---------- */
  const computeScore = () => {
    const s = Math.min((form.sleepHours / 8) * 25, 25);
    const ex = Math.min((form.exerciseMinutes / 30) * 20, 20);
    const w = Math.min((form.waterIntake / 3) * 20, 20);
    const med = form.meditation ? 10 : 0;
    const mood = ["Happy", "Excited"].includes(form.mood) ? 15 : form.mood === "Calm" ? 10 : 5;
    return Math.min(100, Math.round(s + ex + w + med + mood));
  };

  const score = computeScore();
  const steps = ["Routine", "Habits", "Wellness Log", "Review"];

  /* --------------------------------------------
     RENDER
  -------------------------------------------- */
  return (
    <>
      <Navbar />

      <div className="pw-container modern">
        <header className="pw-header">
          <h1>🌿 Personal Wellness</h1>

          <RoundedSearch
            value={form.quickSearch}
            onChange={(v) => update("quickSearch", v)}
            onClear={() => update("quickSearch", "")}
          />
        </header>

        <MultiStep steps={steps} current={step} onChange={setStep} />

        <div className="pw-grid modern-grid">
          <form className="pw-form modern" onSubmit={submit}>
            
            {/* ------------------ STEP 0 ------------------ */}
            {step === 0 && (
              <div className="card">
                <h2>Daily Routine</h2>
                <Slider label="Sleep (hours)" value={form.sleepHours} min={2} max={12} step={0.5}
                        onChange={(v) => update("sleepHours", v)} />
                <Slider label="Study (hours)" value={form.studyHours} min={0} max={12} step={0.5}
                        onChange={(v) => update("studyHours", v)} />
                <Slider label="Exercise (minutes)" value={form.exerciseMinutes} min={0} max={120} step={5}
                        onChange={(v) => update("exerciseMinutes", v)} />
              </div>
            )}

            {/* ------------------ STEP 1 ------------------ */}
            {step === 1 && (
              <>
                <div className="card">
                  <h2>Habits & Hobbies</h2>
                  <div className="chip-grid">
                    {HOBBIES.map(h => (
                      <button key={h} type="button"
                        className={`chip ${form.hobbies.includes(h) ? "active" : ""}`}
                        onClick={() => toggleHobby(h)}
                      >{h}</button>
                    ))}
                  </div>

                  <div className="form-row">
                    <Switch label="Meditation" checked={form.meditation} onChange={(v)=>update("meditation",v)} />
                    <Switch label="Reading" checked={form.reading} onChange={(v)=>update("reading",v)} />
                    <Switch label="Hydration 2L+" checked={form.hydration} onChange={(v)=>update("hydration",v)} />
                  </div>
                </div>

                <div className="card">
                  <h2>Mood</h2>
                  <div className="mood-row">
                    {MOODS.map(m => (
                      <label key={m.name} className={`mood-btn ${form.mood === m.name ? "active" : ""}`}>
                        <input type="radio" name="mood"
                               checked={form.mood === m.name}
                               onChange={() => update("mood", m.name)} />
                        <span className="emoji">{m.icon}</span>
                        <span>{m.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ------------------ STEP 2 ------------------ */}
            {step === 2 && (
              <>
                <div className="card">
                  <h2>Wellness Log</h2>
                  <Slider label="Stress Level" value={form.stressLevel} min={1} max={10} step={1}
                          onChange={(v)=>update("stressLevel",v)} />
                  <Slider label="Energy Level" value={form.energyLevel} min={1} max={10} step={1}
                          onChange={(v)=>update("energyLevel",v)} />
                  <Slider label="Water Intake (L)" value={form.waterIntake} min={0} max={4} step={0.1}
                          onChange={(v)=>update("waterIntake",v)} />
                </div>

                <div className="card">
                  <h2>Reminders</h2>
                  <input type="date" value={form.reminderDate}
                         onChange={(e) => update("reminderDate", e.target.value)} />

                  <Autosuggest value={form.quickSearch}
                               onChange={(v)=>update("quickSearch",v)}
                               suggestions={[
                                 "Drink 2L water",
                                 "Walk 15 minutes",
                                 "Meditate 5 minutes",
                                 "Read 10 pages",
                                 "Stretch for 3 minutes"
                               ]} />
                </div>
              </>
            )}

            {/* ------------------ STEP 3 ------------------ */}
            {step === 3 && (
              <div className="card">
                <h2>Review & Save</h2>
                <div className="review-list">
                  <div><strong>Mood:</strong> {form.mood}</div>
                  <div><strong>Sleep:</strong> {form.sleepHours} hrs</div>
                  <div><strong>Exercise:</strong> {form.exerciseMinutes} min</div>
                  <div><strong>Water:</strong> {form.waterIntake} L</div>
                  <div><strong>Hobbies:</strong> {form.hobbies.join(", ") || "—"}</div>
                </div>
              </div>
            )}

            {/* -------- BUTTONS -------- */}
            <div className="actions bottom-actions">
              <button type="button" className="btn ghost"
                disabled={step === 0}
                onClick={() => setStep(s => s - 1)}>
                Back
              </button>

              {step < 3 ? (
                <button type="button" className="btn primary"
                  onClick={() => setStep(s => s + 1)}>
                  Next
                </button>
              ) : (
                <button className="btn success" type="submit">
                  {saved ? "Saved ✓" : "Save & Finish"}
                </button>
              )}
            </div>
          </form>

          {/* ---------------- ASIDE ---------------- */}
          <aside className="pw-aside modern-aside">
            <div className="score-card">
              <h3>Daily Wellness Score</h3>
              <div className="score-big">{score}%</div>
              <div className="progress-outer">
                <div className="progress-inner" style={{ width: `${score}%` }} />
              </div>
              <p className="muted">Higher scores reflect healthier routines</p>
            </div>

            <div className="tips-card">
              <h3>Quick Health Tips</h3>
              <ul>
                {form.sleepHours < 6 && <li>Try to get at least 6–8 hours of sleep.</li>}
                {form.waterIntake < 2 && <li>Drink an extra glass of water.</li>}
                {form.exerciseMinutes < 20 && <li>Take a brisk 15-minute walk.</li>}
                <li>Your small habits create long-term wellness.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default memo(PersonalWellnessForm);
