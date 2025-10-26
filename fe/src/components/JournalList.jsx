import React, { useState } from "react";
import "./JournalList.css";

const JournalList = ({ entries, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMood, setFilterMood] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [expanded, setExpanded] = useState(null);

  const moods = ["All", "Happy", "Neutral", "Sad", "Angry", "Anxious"];

  // Filter + Sort entries
  const filteredEntries = entries
    .filter(
      (entry) =>
        (filterMood === "All" || entry.mood === filterMood) &&
        entry.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

  const toggleExpand = (index) =>
    setExpanded(expanded === index ? null : index);

  return (
    <div className="journal-list">
      <h2 className="list-title">🗂️ My Journal Entries</h2>

      {/* Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="🔍 Search your thoughts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={filterMood} onChange={(e) => setFilterMood(e.target.value)}>
          {moods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Entries */}
      {filteredEntries.length === 0 ? (
        <p className="no-entry">No entries found. Try writing one today ✍️</p>
      ) : (
        <div className="entries-container">
          {filteredEntries.map((entry, index) => (
            <div className="journal-card" key={index}>
              <div className="entry-header">
                <div>
                  <span className="entry-date">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                  <span
                    className={`entry-mood ${entry.mood.toLowerCase()}`}
                    title={`Mood: ${entry.mood}`}
                  >
                    {entry.mood === "Happy" && "😊"}
                    {entry.mood === "Neutral" && "😐"}
                    {entry.mood === "Sad" && "😢"}
                    {entry.mood === "Angry" && "😠"}
                    {entry.mood === "Anxious" && "😰"} {entry.mood}
                  </span>
                </div>

                <div className="entry-actions">
                  <button className="edit-btn" onClick={() => onEdit(entry)}>
                    ✏️
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(entry)}>
                    🗑️
                  </button>
                </div>
              </div>

              <div
                className="entry-body"
                onClick={() => toggleExpand(index)}
              >
                {expanded === index ? (
                  <p>{entry.text}</p>
                ) : (
                  <p>
                    {entry.text.length > 120
                      ? entry.text.slice(0, 120) + "..."
                      : entry.text}
                    {entry.text.length > 120 && (
                      <span className="expand-text"> Read more ↓</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalList;
