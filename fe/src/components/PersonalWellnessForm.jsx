// PersonalWellnessForm.jsx
import React, { useEffect, useState, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "./PersonalWellnessForm.css";

/* ========================
   API helper (same as yours)
   ======================== */
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

/* ========================
   Constants
   ======================== */
const HOBBIES = [
  "Reading","Music","Sports","Art","Gaming","Travel","Cooking","Yoga"
];
const MOODS = [
  { name: "Happy", icon: "😊" },
  { name: "Calm", icon: "😌" },
  { name: "Anxious", icon: "😰" },
  { name: "Sad", icon: "😢" },
  { name: "Excited", icon: "🤩" },
  { name: "Tired", icon: "😴" }
];
const DEFAULT = {
  name: "",
  email: "",
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
  quickSearch: ""
};
const DRAFT_KEY = "wellness_pro_form_v1";

/* ========================
   Small presentational primitives
   ======================== */
const FloatingInput = ({ label, value, onChange, type="text", name, placeholder, icon }) => (
  <div className="floating">
    {icon && <span className="floating-icon">{icon}</span>}
    <input id={name} name={name} value={value} onChange={(e)=>onChange(e.target.value)} placeholder=" " type={type} />
    <label htmlFor={name}>{label}</label>
  </div>
);

const RoundedSearch = ({ value, onChange, onClear }) => (
  <div className="search-box">
    <input value={value} onChange={(e)=>onChange(e.target.value)} placeholder="Quick search habits or notes..." />
    <button type="button" className="icon-btn" onClick={onClear} aria-label="clear search">✖</button>
  </div>
);

const IconButton = ({ icon, title, onClick }) => (
  <button type="button" className="icon-action" onClick={onClick} title={title}>{icon}</button>
);

/* ========================
   Multi-step progress component
   ======================== */
const MultiStep = ({ steps, current, onChange }) => (
  <div className="multi-step">
    <div className="multi-track">
      {steps.map((s, i) => {
        const pct = Math.round(((i+1)/steps.length) * 100);
        return (
          <div key={s} className={`step ${i <= current ? "done" : ""}`} onClick={()=>onChange(i)}>
            <div className="dot">{i+1}</div>
            <div className="label">{s}</div>
          </div>
        );
      })}
    </div>
    <div className="progress-mini" aria-hidden>
      <div className="progress-fill" style={{ width: `${Math.round(((current+1)/steps.length)*100)}%` }} />
    </div>
  </div>
);

/* ========================
   Autosuggest (simple)
   ======================== */
const Autosuggest = ({ value, onChange, suggestions }) => {
  const [list, setList] = useState([]);
  useEffect(()=> setList(suggestions.slice(0,5)), [suggestions]);
  useEffect(()=> setList(suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())).slice(0,6)), [value]);
  return (
    <div className="autosuggest">
      <input value={value} onChange={(e)=>onChange(e.target.value)} placeholder="Try 'sleep' or 'water'..." />
      {value && list.length > 0 && (
        <ul className="suggest-list">
          {list.map(s => <li key={s} onClick={()=>onChange(s)}>{s}</li>)}
        </ul>
      )}
    </div>
  );
};

/* ========================
   Main Component
   ======================== */
const PersonalWellnessForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState(0);
  const autoRef = useRef(null);

  // suggestions example
  const suggestions = [
    "Get 7–8 hours of sleep","Drink 2L water","Walk 15 minutes",
    "Do breathing exercise","Read 10 pages","Stretch for 5 minutes"
  ];

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try { setForm(p => ({ ...p, ...JSON.parse(draft) })); } catch {}
    }
    fetchFromServer();
    autoRef.current = setInterval(()=> localStorage.setItem(DRAFT_KEY, JSON.stringify(form)), 8000);
    return ()=> clearInterval(autoRef.current);
    // eslint-disable-next-line
  }, []);

  useEffect(()=> {
    // keep draft fresh on every change
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form]);

  const fetchFromServer = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/wellness");
      if (!res || !res.ok) return;
      const data = await res.json();
      setForm(p => ({ ...p, ...data }));
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  };

  const update = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setSaved(false);
  };

  const toggleHobby = (h) => update("hobbies", form.hobbies.includes(h) ? form.hobbies.filter(x => x !== h) : [...form.hobbies, h]);

  const submit = async (e) => {
    e.preventDefault();
    const res = await apiFetch("/wellness", "POST", form);
    if (!res || !res.ok) return alert("Failed to save");
    localStorage.removeItem(DRAFT_KEY);
    setSaved(true);
    setTimeout(()=> setSaved(false), 1800);
  };

  /* Score compute (polished) */
  const computeScore = () => {
    const s = Math.min((form.sleepHours/8)*25, 25);
    const ex = Math.min((form.exerciseMinutes/30)*20, 20);
    const w = Math.min((form.waterIntake/3)*20, 20);
    const med = form.meditation ? 10 : 0;
    const mood = (form.mood === "Happy"||form.mood==="Excited")?15: form.mood==="Calm"?10:5;
    const base = s + ex + w + med + mood;
    return Math.max(0, Math.min(100, Math.round(base)));
  };

  const score = computeScore();
  const cups = 8;
  const filled = Math.round((form.waterIntake/2.5) * cups);

  const steps = ["Routine","Habits","Wellness Log","Review"];

  return (
    <>
      <Navbar />
      <div className="pw-container modern">
        <header className="pw-header">
          <h1>🌿 Personal Wellness</h1>
          <div className="header-actions">
            <RoundedSearch value={form.quickSearch} onChange={(v)=> update("quickSearch", v)} onClear={()=> update("quickSearch","")} />
            <IconButton icon="💾" title="Save draft" onClick={()=> { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)); alert("Draft saved locally"); }} />
          </div>
        </header>

        <MultiStep steps={steps} current={step} onChange={setStep} />

        <div className="pw-grid modern-grid">
          <form className="pw-form modern" onSubmit={submit}>

            {step === 0 && (
              <>
                <div className="card">
                  <h2>Profile</h2>
                  <div className="row-grid">
                    <FloatingInput name="name" label="Full name" value={form.name} onChange={(v)=> update("name", v)} icon="👤" />
                    <FloatingInput name="email" label="Email (optional)" value={form.email} onChange={(v)=> update("email", v)} type="email" icon="✉️" />
                  </div>
                </div>

                <div className="card">
                  <h2>Daily Routine</h2>
                  <Slider label={`Sleep (hours)`} value={form.sleepHours} min={2} max={12} step={0.5} onChange={(v)=> update("sleepHours", v)} />
                  <Slider label={`Study (hours)`} value={form.studyHours} min={0} max={12} step={0.5} onChange={(v)=> update("studyHours", v)} />
                  <Slider label={`Exercise (min)`} value={form.exerciseMinutes} min={0} max={120} step={5} onChange={(v)=> update("exerciseMinutes", v)} />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="card">
                  <h2>Habits & Hobbies</h2>
                  <div className="chip-grid">
                    {HOBBIES.map(h => <button key={h} type="button" className={`chip ${form.hobbies.includes(h) ? "active":""}`} onClick={()=> toggleHobby(h)}>{h}</button>)}
                  </div>
                  <div className="form-row">
                    <Switch label="Meditation" checked={form.meditation} onChange={(v)=> update("meditation", v)} />
                    <Switch label="Reading" checked={form.reading} onChange={(v)=> update("reading", v)} />
                    <Switch label="Hydration 2L+" checked={form.hydration} onChange={(v)=> update("hydration", v)} />
                  </div>
                </div>

                <div className="card">
                  <h2>Mood</h2>
                  <div className="mood-row">
                    {MOODS.map(m => (
                      <label key={m.name} className={`mood-btn ${form.mood === m.name ? "active":""}`}>
                        <input type="radio" name="mood" checked={form.mood===m.name} onChange={()=> update("mood", m.name)} />
                        <span className="emoji">{m.icon}</span>
                        <span className="mood-name">{m.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="card">
                  <h2>Wellness Log</h2>
                  <Slider label={`Stress Level`} value={form.stressLevel} min={1} max={10} step={1} onChange={(v)=> update("stressLevel", v)} />
                  <Slider label={`Energy Level`} value={form.energyLevel} min={1} max={10} step={1} onChange={(v)=> update("energyLevel", v)} />
                  <Slider label={`Water Intake (L)`} value={form.waterIntake} min={0} max={4} step={0.1} onChange={(v)=> update("waterIntake", v)} />
                </div>

                <div className="card">
                  <h2>Reminders</h2>
                  <div className="row-grid">
                    <div>
                      <label className="small">Set a reminder</label>
                      <input type="date" value={form.reminderDate} onChange={(e)=> update("reminderDate", e.target.value)} />
                    </div>
                    <div>
                      <label className="small">Quick suggestions</label>
                      <Autosuggest value={form.quickSearch} onChange={(v)=> update("quickSearch", v)} suggestions={suggestions} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="card">
                  <h2>Review & Save</h2>
                  <div className="review-list">
                    <div><strong>Name</strong> {form.name || "—"}</div>
                    <div><strong>Mood</strong> {form.mood}</div>
                    <div><strong>Sleep</strong> {form.sleepHours} hrs</div>
                    <div><strong>Exercise</strong> {form.exerciseMinutes} min</div>
                    <div><strong>Water</strong> {form.waterIntake} L</div>
                    <div><strong>Hobbies</strong> {(form.hobbies.length? form.hobbies.join(", "): "—")}</div>
                  </div>
                </div>
              </>
            )}

            <div className="actions bottom-actions">
              <div className="step-controls">
                <button type="button" className="btn ghost" onClick={()=> setStep(s => Math.max(0, s-1))} disabled={step===0}>Back</button>
                {step < steps.length-1 ? (
                  <button type="button" className="btn primary" onClick={()=> setStep(s => Math.min(steps.length-1, s+1))}>Next</button>
                ) : (
                  <button className="btn success" type="submit">{saved ? "Saved ✓" : "Save & Done"}</button>
                )}
              </div>

              <div>
                <button type="button" className="btn neutral" onClick={() => { localStorage.removeItem(DRAFT_KEY); setForm(DEFAULT); }}>Reset All</button>
              </div>
            </div>
          </form>

          <aside className="pw-aside modern-aside">
            <div className="score-card">
              <h3>Daily Wellness Score</h3>
              <div className="score-big">{score}%</div>
              <div className="progress-outer"><div className="progress-inner" style={{ width: `${score}%` }} /></div>
              <p className="muted">Higher scores reflect healthier routines</p>
            </div>

            <div className="tips-card">
              <h3>Quick Health Tips</h3>
              <ul>
                {form.sleepHours < 6 && <li>Try for 6–8 hours sleep tonight.</li>}
                {form.waterIntake < 2 && <li>Drink an extra glass of water now.</li>}
                {form.exerciseMinutes < 20 && <li>Take a brisk 15 minute walk.</li>}
                <li>Small habits compound: pick one tiny thing to improve tonight.</li>
              </ul>
            </div>

            <div className="water-card">
              <h3>Water Tracker</h3>
              <div className="cups-row">
                {Array.from({ length: cups }).map((_, i) => <div key={i} className={`cup ${i < filled ? "filled":""}`} />)}
              </div>
              <div className="water-read">{form.waterIntake} L today</div>
            </div>

            {form.stressLevel >= 8 && (
              <div className="breathe-card">
                <h3>Feeling stressed?</h3>
                <p>Try 4-4-4 breathing for one minute</p>
                <div className="breath-visual" />
                <button className="btn ghost" onClick={() => alert("Breathe: in 4s, hold 4s, out 4s. Repeat 5x.")}>Start quick breathing</button>
              </div>
            )}
            <div className="draft-note">Draft saved locally every 8s.</div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default memo(PersonalWellnessForm);

/* ========================
   Reused small components (put after default export or above)
   - Slider, Switch implemented inline for readability
   ======================== */

function Switch({ label, checked, onChange }) {
  return (
    <label className="switch-inline">
      <input type="checkbox" checked={checked} onChange={(e)=> onChange(e.target.checked)} />
      <span className="toggle" />
      <span className="switch-label">{label}</span>
    </label>
  );
}

function Slider({ label, value, min, max, step, onChange }) {
  return (
    <div className="slider-block">
      <label className="range-label">{label}: <strong>{value}</strong></label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e)=> onChange(Number(e.target.value))} />
    </div>
  );
}
