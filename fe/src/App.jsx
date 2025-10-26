import React, { Component } from "react";
import LoginPage from "./components/LoginPage";
import JournalForm from "./components/JournalForm";
import ReportFilter from "./components/ReportFilter";
import JournalList from "./components/JournalList";
import Calendar from "./components/Calendar";
import "./styles.css";

class App extends Component {
  state = {
    page: "login", // login | journal | report
    user: null,
    journals: {}, // Changed from array to object: { "2025-01-15": [{entry, mood, date}] }
    selectedDate: new Date().toISOString().split('T')[0], // Currently selected date
    moodData: {}, // Stores mood for each date: { "2025-01-15": "happy" }
    loading: false,
    error: null,
  };

  // ✅ Removed auto-login from localStorage
  componentDidMount() {
    console.log("App loaded. Opening login page first.");
  }

  // ✅ Handle login
  handleLogin = (user) => {
    localStorage.setItem("reflectUser", JSON.stringify(user));
    this.setState({ user, page: "journal" });
  };

  // ✅ Handle logout
  handleLogout = () => {
    localStorage.removeItem("reflectUser");
    this.setState({ 
      user: null, 
      page: "login",
      journals: {},
      moodData: {},
      selectedDate: new Date().toISOString().split('T')[0]
    });
  };

  // ✅ Handle date selection from calendar
  handleDateSelect = (dateKey) => {
    console.log("Date selected:", dateKey);
    this.setState({ selectedDate: dateKey });
  };

  // ✅ Add journal entry for the selected date
  addJournal = async (entryData) => {
    const { selectedDate } = this.state;
    
    console.log("Adding journal entry:", entryData, "for date:", selectedDate);
    
    // Create journal entry with date and timestamp
    const journalEntry = {
      entry: entryData.entry,
      mood: entryData.mood,
      date: selectedDate,
      timestamp: new Date().toISOString()
    };

    this.setState((prev) => {
      // Get existing entries for this date or empty array
      const dateEntries = prev.journals[selectedDate] || [];
      
      const newState = {
        journals: {
          ...prev.journals,
          [selectedDate]: [...dateEntries, journalEntry],
        },
        // Update mood for this date (last mood entered)
        moodData: {
          ...prev.moodData,
          [selectedDate]: entryData.mood,
        },
      };
      
      console.log("New state after adding entry:", newState);
      return newState;
    });
  };

  // Placeholder methods (you can implement these later)
  fetchJournals = async () => {
    // TODO: Fetch journals from backend
  };

  handleFilter = async (filters) => {
    // TODO: Filter journals based on date range, mood, etc.
  };

  goToReport = () => this.setState({ page: "report" });
  goToJournal = () => this.setState({ page: "journal" });

  render() {
    const { page, user, journals, selectedDate, moodData, loading, error } = this.state;
    
    // Get entries for the currently selected date
    const currentEntries = journals[selectedDate] || [];

    console.log("Current moodData:", moodData);
    console.log("Selected date:", selectedDate);

    return (
      <div className="app-container">
        {/* <h1 className="app-title">🧠 Reflect — Daily Journal</h1>
        <p className="app-welcome-quote">Welcome to Reflect</p> */}

        {error && <div className="error-banner">{error}</div>}

        {/* ✅ Always open Login first */}
        {page === "login" && <LoginPage onLogin={this.handleLogin} />}

        {/* ✅ Journal Page with Calendar */}
        {page === "journal" && user && (
          <>
            <p className="welcome-text">Hello, {user.username}!</p>
            
            {/* ✅ NEW: Side by Side Layout */}
            <div className="journal-layout">
              {/* ✅ Calendar Component */}
              <div className="calendar-section">
                <Calendar 
                  moodData={moodData}
                  onDateSelect={this.handleDateSelect}
                  selectedDate={selectedDate}
                />
              </div>

              {/* ✅ Journal Form Section */}
              <div className="form-section">
                <JournalForm 
                  onSubmit={this.addJournal} 
                  selectedDate={selectedDate}
                />
              </div>
            </div>

            {/* ✅ Journal List below both */}
            {loading ? (
              <p className="loading">Loading journals...</p>
            ) : (
              <JournalList entries={currentEntries} />
            )}

            <button onClick={this.goToReport} className="nav-btn">
              View Reports
            </button>
            <button onClick={this.handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}

        {/* ✅ Report Page */}
        {page === "report" && user && (
          <>
            <ReportFilter onFilter={this.handleFilter} />
            {loading ? (
              <p className="loading">Loading filtered results...</p>
            ) : (
              <JournalList entries={currentEntries} />
            )}
            <button onClick={this.goToJournal} className="nav-btn">
              Back to Journal
            </button>
          </>
        )}

        <footer>
          Reflect © {new Date().getFullYear()} — All rights reserved.
        </footer>
      </div>
    );
  }
}

export default App;