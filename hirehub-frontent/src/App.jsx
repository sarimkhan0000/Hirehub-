import React, { useState, useEffect } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const [showPostModal, setShowPostModal] = useState(false);
  const [applyingJob, setApplyingJob] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-Time",
    salary: "",
    description: "",
  });

  const [candidateData, setCandidateData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "Fresher",
    resume: null,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://hirehub-backend-sarim.onrender.com/api/jobs");
      if (res.ok) setJobs((await res.json()).slice().reverse());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch("https://hirehub-backend-sarim.onrender.com/api/applications");
      if (res.ok) setApplications((await res.json()).slice().reverse());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://hirehub-backend-sarim.onrender.com/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ title: "", company: "", location: "", type: "Full-Time", salary: "", description: "" });
        setShowPostModal(false);
        fetchJobs();
        showToast("Job posted successfully.");
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteJob = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      const res = await fetch(`https://hirehub-backend-sarim.onrender.com/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) { fetchJobs(); showToast("Job removed."); }
    } catch (e) { console.error(e); }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyingJob) return;

    const data = new FormData();
    data.append("jobId", applyingJob.id);
    data.append("jobTitle", applyingJob.title);
    data.append("companyName", applyingJob.company);
    data.append("fullName", candidateData.fullName);
    data.append("email", candidateData.email);
    data.append("phone", candidateData.phone);
    data.append("experience", candidateData.experience);
    if (candidateData.resume) data.append("resume", candidateData.resume);

    try {
      const res = await fetch("https://hirehub-backend-sarim.onrender.com/api/applications", { method: "POST", body: data });
      if (res.ok) {
        fetchApplications();
        showToast(`Application submitted successfully for ${applyingJob.title}!`);
        setApplyingJob(null);
        setCandidateData({ fullName: "", email: "", phone: "", experience: "Fresher", resume: null });
      }
    } catch (e) { console.error(e); }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await fetch(`https://hirehub-backend-sarim.onrender.com/api/applications/${appId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) { fetchApplications(); showToast(`Candidate status updated to ${newStatus}`); }
    } catch (e) { console.error(e); }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchRole = job.title?.toLowerCase().includes(searchQuery.toLowerCase()) || job.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLoc = !locationQuery || job.location?.toLowerCase().includes(locationQuery.toLowerCase());
    const matchType = selectedType === "All" || job.type === selectedType;
    return matchRole && matchLoc && matchType;
  });

  const hasApplied = (jobId) => applications.some((app) => Number(app.jobId) === Number(jobId));

  // True Pitch-Black Dark Mode Theme
  const theme = {
    bg: darkMode ? "#000000" : "#F3F4F6",          // Ekdum pitch black background
    cardBg: darkMode ? "#121212" : "#FFFFFF",       // Deep dark cards
    text: darkMode ? "#F8FAFC" : "#111827",
    subText: darkMode ? "#94A3B8" : "#6B7280",
    border: darkMode ? "#27272A" : "#E5E7EB",       // Subtle dark borders
    inputBg: darkMode ? "#18181B" : "#FFFFFF",      // Dark input fields
    inputBorder: darkMode ? "#3F3F46" : "#D1D5DB",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: theme.bg, color: theme.text, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .toast-banner { position: fixed; bottom: 24px; right: 24px; background: #1E293B; color: #FFFFFF; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; box-shadow: 0 10px 25px rgba(0,0,0,0.3); z-index: 1000; border-left: 4px solid #2563EB; }
        .navbar { background: ${theme.cardBg}; border-bottom: 1px solid ${theme.border}; position: sticky; top: 0; z-index: 40; transition: background 0.3s; }
        .nav-inner { max-width: 1180px; margin: 0 auto; height: 64px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; }
        .brand-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .brand-box { width: 34px; height: 34px; background: #1D4ED8; color: #FFFFFF; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; }
        .brand-name { font-size: 20px; font-weight: 700; color: ${theme.text}; }
        .brand-name span { color: #3B82F6; }
        .nav-tabs { display: flex; gap: 8px; }
        .nav-tab-btn { background: transparent; border: none; padding: 8px 14px; border-radius: 6px; font-size: 13.5px; font-weight: 600; color: ${theme.subText}; cursor: pointer; display: flex; align-items: center; gap: 6px; }
        .nav-tab-btn.active { background: ${darkMode ? "#27272A" : "#EFF6FF"}; color: #3B82F6; }
        .tab-counter { background: ${darkMode ? "#3F3F46" : "#DBEAFE"}; color: ${darkMode ? "#F8FAFC" : "#1E40AF"}; padding: 1px 7px; border-radius: 999px; font-size: 11.5px; font-weight: 700; }
        .btn-theme { background: ${darkMode ? "#27272A" : "#F1F5F9"}; color: ${theme.text}; border: 1px solid ${theme.border}; padding: 7px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .btn-recruiter { background: #2563EB; color: #FFFFFF; border: none; padding: 9px 16px; border-radius: 6px; font-size: 13.5px; font-weight: 600; cursor: pointer; }
        .btn-recruiter:hover { background: #1D4ED8; }
        .search-strip { background: ${theme.cardBg}; border-bottom: 1px solid ${theme.border}; padding: 24px 20px; transition: background 0.3s; }
        .search-container { max-width: 1180px; margin: 0 auto; }
        .search-heading { font-size: 20px; font-weight: 700; color: ${theme.text}; margin-bottom: 4px; }
        .search-subheading { font-size: 13.5px; color: ${theme.subText}; margin-bottom: 16px; }
        .search-box-grid { display: grid; grid-template-columns: 1.5fr 1fr auto; gap: 12px; background: ${darkMode ? "#000000" : "#F9FAFB"}; padding: 8px; border: 1px solid ${theme.border}; border-radius: 8px; }
        .search-input-field { display: flex; align-items: center; background: ${theme.inputBg}; border: 1px solid ${theme.inputBorder}; border-radius: 6px; padding: 0 12px; }
        .search-input-field span { color: ${theme.subText}; font-size: 13px; font-weight: 600; margin-right: 8px; white-space: nowrap; }
        .search-input-field input { width: 100%; border: none; outline: none; padding: 10px 4px; font-size: 14px; color: ${theme.text}; background: transparent; }
        .btn-clear { background: ${theme.cardBg}; border: 1px solid ${theme.border}; color: ${theme.text}; padding: 0 18px; border-radius: 6px; font-size: 13.5px; font-weight: 600; cursor: pointer; }
        .main-layout { max-width: 1180px; width: 100%; margin: 24px auto; padding: 0 20px; display: grid; grid-template-columns: 260px 1fr; gap: 24px; align-items: start; }
        .ats-container { max-width: 1180px; width: 100%; margin: 24px auto; padding: 0 20px; }
        .sidebar-card { background: ${theme.cardBg}; border: 1px solid ${theme.border}; border-radius: 8px; padding: 20px; transition: background 0.3s; }
        .sidebar-title { font-size: 14px; font-weight: 700; color: ${theme.text}; text-transform: uppercase; letter-spacing: 0.4px; padding-bottom: 12px; border-bottom: 1px solid ${theme.border}; margin-bottom: 14px; }
        .filter-group-label { font-size: 13px; font-weight: 600; color: ${theme.subText}; margin-bottom: 10px; display: block; }
        .filter-list { display: flex; flex-direction: column; gap: 8px; }
        .filter-radio { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 6px; cursor: pointer; font-size: 13.5px; color: ${theme.text}; font-weight: 500; }
        .filter-radio.selected { background: ${darkMode ? "#27272A" : "#EFF6FF"}; color: #3B82F6; font-weight: 600; }
        .sidebar-divider { height: 1px; background: ${theme.border}; margin: 18px 0; }
        .recruiter-box { background: ${darkMode ? "#000000" : "#F8FAFC"}; border: 1px solid ${theme.border}; border-radius: 6px; padding: 14px; }
        .recruiter-box h4 { font-size: 13.5px; color: ${theme.text}; margin-bottom: 4px; }
        .recruiter-box p { font-size: 12.5px; color: ${theme.subText}; line-height: 1.4; margin-bottom: 10px; }
        .feed-top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .feed-count { font-size: 15px; font-weight: 600; color: ${theme.text}; }
        .feed-count span { color: #3B82F6; font-weight: 700; }
        .job-list { display: flex; flex-direction: column; gap: 12px; }
        .job-item { background: ${theme.cardBg}; border: 1px solid ${theme.border}; border-radius: 8px; padding: 20px 22px; transition: background 0.3s; }
        .job-row-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
        .job-main-info { display: flex; gap: 14px; align-items: flex-start; }
        .company-initial { width: 44px; height: 44px; border-radius: 6px; background: ${darkMode ? "#27272A" : "#F3F4F6"}; border: 1px solid ${theme.border}; color: ${theme.text}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 17px; flex-shrink: 0; }
        .job-title { font-size: 17px; font-weight: 700; color: ${theme.text}; margin-bottom: 3px; }
        .job-company-name { font-size: 14px; font-weight: 500; color: ${theme.subText}; }
        .job-meta-row { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 14px; padding-top: 12px; border-top: 1px solid ${theme.border}; font-size: 13.5px; color: ${theme.text}; }
        .meta-label { color: ${theme.subText}; font-weight: 500; }
        .meta-val { font-weight: 600; color: ${theme.text}; }
        .type-badge { background: ${darkMode ? "#27272A" : "#EFF6FF"}; color: #3B82F6; border: 1px solid ${theme.border}; padding: 3px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; }
        .job-description { margin-top: 12px; font-size: 13.5px; color: ${theme.subText}; line-height: 1.55; white-space: pre-line; }
        .job-footer { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; }
        .job-id-text { font-size: 12px; color: ${theme.subText}; }
        .footer-btns { display: flex; gap: 10px; align-items: center; }
        .btn-delete { background: ${theme.cardBg}; color: #EF4444; border: 1px solid ${theme.border}; padding: 7px 12px; border-radius: 6px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
        .btn-apply { background: #2563EB; color: #FFFFFF; border: none; padding: 8px 18px; border-radius: 6px; font-size: 13.5px; font-weight: 600; cursor: pointer; }
        .btn-applied { background: ${darkMode ? "#064E3B" : "#ECFDF5"}; color: #10B981; border: 1px solid ${theme.border}; padding: 8px 16px; border-radius: 6px; font-size: 13.5px; font-weight: 600; }
        .ats-card { background: ${theme.cardBg}; border: 1px solid ${theme.border}; border-radius: 8px; padding: 20px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap; }
        .status-pill { padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
        .status-Pending { background: #FEF3C7; color: #92400E; }
        .status-Shortlisted { background: #DCFCE7; color: #166534; }
        .status-Rejected { background: #FEE2E2; color: #991B1B; }
        .empty-state { background: ${theme.cardBg}; border: 1px solid ${theme.border}; border-radius: 8px; padding: 48px 20px; text-align: center; }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 100; }
        .modal-box { background: ${theme.cardBg}; color: ${theme.text}; width: 100%; max-width: 520px; border-radius: 8px; border: 1px solid ${theme.border}; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); overflow: hidden; }
        .modal-header { padding: 16px 22px; border-bottom: 1px solid ${theme.border}; display: flex; justify-content: space-between; align-items: center; background: ${darkMode ? "#000000" : "#F9FAFB"}; }
        .modal-header h3 { font-size: 16px; font-weight: 700; color: ${theme.text}; }
        .modal-close { background: none; border: none; font-size: 18px; color: ${theme.subText}; cursor: pointer; }
        .modal-body { padding: 22px; display: flex; flex-direction: column; gap: 14px; max-height: 80vh; overflow-y: auto; }
        .form-group { display: flex; flex-direction: column; gap: 5px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-label { font-size: 13px; font-weight: 600; color: ${theme.text}; }
        .form-control { padding: 9px 12px; border: 1px solid ${theme.inputBorder}; background: ${theme.inputBg}; color: ${theme.text}; border-radius: 6px; font-size: 13.5px; outline: none; font-family: inherit; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; padding-top: 14px; border-top: 1px solid ${theme.border}; }
        .btn-cancel { background: ${theme.cardBg}; border: 1px solid ${theme.border}; color: ${theme.text}; padding: 9px 16px; border-radius: 6px; font-size: 13.5px; font-weight: 600; cursor: pointer; }
        .resume-link { display: inline-flex; align-items: center; gap: 6px; color: #3B82F6; font-weight: 600; text-decoration: none; background: ${darkMode ? "#1E293B" : "#EFF6FF"}; padding: 4px 10px; border-radius: 6px; font-size: 13px; border: 1px solid ${theme.border}; }
      `}</style>

      {toastMessage && <div className="toast-banner">{toastMessage}</div>}

      <header className="navbar">
        <div className="nav-inner">
          <div className="brand-logo" onClick={() => setActiveTab("jobs")}>
            <div className="brand-box">H</div>
            <div className="brand-name">
              Hire<span>Hub</span>
            </div>
          </div>

          <div className="nav-tabs">
            <button className={`nav-tab-btn ${activeTab === "jobs" ? "active" : ""}`} onClick={() => setActiveTab("jobs")}>
              Browse Jobs <span className="tab-counter">{jobs.length}</span>
            </button>
            <button className={`nav-tab-btn ${activeTab === "applications" ? "active" : ""}`} onClick={() => setActiveTab("applications")}>
              Recruiter ATS <span className="tab-counter">{applications.length}</span>
            </button>
          </div>

          <div className="nav-right" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button className="btn-theme" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button className="btn-recruiter" onClick={() => setShowPostModal(true)}>
              + Post a Job
            </button>
          </div>
        </div>
      </header>

      {activeTab === "jobs" && (
        <>
          <section className="search-strip">
            <div className="search-container">
              <h1 className="search-heading">Find Your Next Career Opportunity</h1>
              <p className="search-subheading">Browse verified openings, apply with your resume, and track applications</p>

              <div className="search-box-grid">
                <div className="search-input-field">
                  <span>Role / Company:</span>
                  <input type="text" placeholder="e.g. Java, React..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="search-input-field">
                  <span>Location:</span>
                  <input type="text" placeholder="e.g. Noida, Remote..." value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} />
                </div>
                {(searchQuery || locationQuery || selectedType !== "All") && (
                  <button className="btn-clear" onClick={() => { setSearchQuery(""); setLocationQuery(""); setSelectedType("All"); }}>Reset</button>
                )}
              </div>
            </div>
          </section>

          <main className="main-layout">
            <aside className="sidebar-card">
              <div className="sidebar-title">Filter Openings</div>
              <span className="filter-group-label">Employment Type</span>
              <div className="filter-list">
                {["All", "Full-Time", "Remote", "Internship", "Part-Time"].map((type) => (
                  <div key={type} onClick={() => setSelectedType(type)} className={`filter-radio ${selectedType === type ? "selected" : ""}`}>
                    <span>{type === "All" ? "All Job Types" : type}</span>
                    <span>{selectedType === type ? "●" : "○"}</span>
                  </div>
                ))}
              </div>
              <div className="sidebar-divider"></div>
              <div className="recruiter-box">
                <h4>Hiring for your team?</h4>
                <p>Post open roles and review resumes in the ATS dashboard.</p>
                <button className="btn-recruiter" style={{ width: "100%" }} onClick={() => setShowPostModal(true)}>Post a Job Opening</button>
              </div>
            </aside>

            <section>
              <div className="feed-top-bar">
                <div className="feed-count">Showing <span>{filteredJobs.length}</span> Job Openings</div>
              </div>

              {loading ? (
                <div className="empty-state"><p>Loading open positions...</p></div>
              ) : filteredJobs.length === 0 ? (
                <div className="empty-state">
                  <h3>No matching job openings found</h3>
                  <p style={{ color: theme.subText, fontSize: "13.5px", marginTop: "4px" }}>Try adjusting your filters or post a new job.</p>
                </div>
              ) : (
                <div className="job-list">
                  {filteredJobs.map((job) => {
                    const isApplied = hasApplied(job.id);
                    return (
                      <div key={job.id} className="job-item">
                        <div className="job-row-top">
                          <div className="job-main-info">
                            <div className="company-initial">{(job.company || "C").charAt(0).toUpperCase()}</div>
                            <div>
                              <h2 className="job-title">{job.title}</h2>
                              <p className="job-company-name">{job.company}</p>
                            </div>
                          </div>
                          <span className="type-badge">{job.type || "Full-Time"}</span>
                        </div>

                        <div className="job-meta-row">
                          <div className="meta-tag"><span className="meta-label">Location:</span> <span className="meta-val">{job.location || "Remote / India"}</span></div>
                          <div className="meta-tag"><span className="meta-label">Package:</span> <span className="meta-val">{job.salary || "Not Disclosed"}</span></div>
                        </div>

                        {job.description && <p className="job-description">{job.description}</p>}

                        <div className="job-footer">
                          <span className="job-id-text">Job ID: #HH-{job.id}</span>
                          <div className="footer-btns">
                            <button className="btn-delete" onClick={() => handleDeleteJob(job.id, job.title)}>Delete</button>
                            {isApplied ? (
                              <button className="btn-applied" disabled>✓ Applied</button>
                            ) : (
                              <button className="btn-apply" onClick={() => setApplyingJob(job)}>Apply Now</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </main>
        </>
      )}

      {activeTab === "applications" && (
        <main className="ats-container">
          <div className="feed-top-bar" style={{ marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 700 }}>Candidate Applications (ATS)</h2>
              <p style={{ fontSize: "13.5px", color: theme.subText, marginTop: "2px" }}>Review resumes and manage candidate hiring stages</p>
            </div>
            <span className="feed-count">Total: <span>{applications.length}</span></span>
          </div>

          {applications.length === 0 ? (
            <div className="empty-state">
              <h3>No candidate applications yet</h3>
              <p style={{ color: theme.subText, fontSize: "13.5px", marginTop: "4px" }}>Applications will appear here when candidates apply.</p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="ats-card">
                <div style={{ flex: 1, minWidth: "280px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <h3 style={{ fontSize: "16.5px", fontWeight: 700 }}>{app.fullName}</h3>
                    <span className={`status-pill status-${app.status || "Pending"}`}>{app.status || "Pending"}</span>
                  </div>
                  <p style={{ fontSize: "13.5px", color: "#3B82F6", fontWeight: 600, marginBottom: "8px" }}>Applied for: {app.jobTitle} ({app.companyName})</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "13px", color: theme.subText, marginBottom: "12px" }}>
                    <span>📧 {app.email}</span>
                    <span>📞 {app.phone}</span>
                    <span>💼 Exp: <strong style={{ color: theme.text }}>{app.experience}</strong></span>
                  </div>
                  {app.resumePath ? (
                    <a href={`https://hirehub-backend-sarim.onrender.com/uploads/${app.resumePath}`} target="_blank" rel="noopener noreferrer" className="resume-link">
                      📄 View / Download Resume
                    </a>
                  ) : (
                    <span style={{ fontSize: "12.5px", color: theme.subText }}>No resume uploaded</span>
                  )}
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button onClick={() => handleStatusChange(app.id, "Shortlisted")} style={{ background: darkMode ? "#064E3B" : "#ECFDF5", color: "#10B981", border: "1px solid " + theme.border, padding: "7px 12px", borderRadius: "6px", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}>
                    ✓ Shortlist
                  </button>
                  <button onClick={() => handleStatusChange(app.id, "Rejected")} style={{ background: darkMode ? "#7F1D1D" : "#FEF2F2", color: "#EF4444", border: "1px solid " + theme.border, padding: "7px 12px", borderRadius: "6px", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}>
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </main>
      )}

      {applyingJob && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <div>
                <h3>Apply for {applyingJob.title}</h3>
                <p style={{ fontSize: "12.5px", color: theme.subText, marginTop: "2px" }}>{applyingJob.company} • {applyingJob.location || "Remote"}</p>
              </div>
              <button className="modal-close" onClick={() => setApplyingJob(null)}>✕</button>
            </div>

            <form onSubmit={handleApplySubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" required placeholder="Enter your full name" className="form-control" value={candidateData.fullName} onChange={(e) => setCandidateData({ ...candidateData, fullName: e.target.value })} />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input type="email" required placeholder="you@example.com" className="form-control" value={candidateData.email} onChange={(e) => setCandidateData({ ...candidateData, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input type="tel" required placeholder="+91 98765 43210" className="form-control" value={candidateData.phone} onChange={(e) => setCandidateData({ ...candidateData, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Total Experience</label>
                <select className="form-control" value={candidateData.experience} onChange={(e) => setCandidateData({ ...candidateData, experience: e.target.value })}>
                  <option value="Fresher" style={{ background: theme.cardBg }}>Fresher (0 Years)</option>
                  <option value="1-2 Years" style={{ background: theme.cardBg }}>1 - 2 Years</option>
                  <option value="3-5 Years" style={{ background: theme.cardBg }}>3 - 5 Years</option>
                  <option value="5+ Years" style={{ background: theme.cardBg }}>5+ Years</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Upload Resume (PDF / DOCX) *</label>
                <input type="file" required accept=".pdf,.doc,.docx" className="form-control" onChange={(e) => setCandidateData({ ...candidateData, resume: e.target.files[0] })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setApplyingJob(null)}>Cancel</button>
                <button type="submit" className="btn-apply">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPostModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Post a New Job Opening</h3>
              <button className="modal-close" onClick={() => setShowPostModal(false)}>✕</button>
            </div>

            <form onSubmit={handlePostJob} className="modal-body">
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input type="text" required placeholder="e.g. Java Full Stack Developer" className="form-control" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input type="text" required placeholder="e.g. TechCorp" className="form-control" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input type="text" placeholder="e.g. Noida / Remote" className="form-control" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Employment Type</label>
                  <select className="form-control" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="Full-Time" style={{ background: theme.cardBg }}>Full-Time</option>
                    <option value="Remote" style={{ background: theme.cardBg }}>Remote</option>
                    <option value="Internship" style={{ background: theme.cardBg }}>Internship</option>
                    <option value="Part-Time" style={{ background: theme.cardBg }}>Part-Time</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Annual Salary (CTC)</label>
                <input type="text" placeholder="e.g. ₹6 LPA - ₹10 LPA" className="form-control" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Job Description</label>
                <textarea rows="4" placeholder="Describe role responsibilities..." className="form-control" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowPostModal(false)}>Cancel</button>
                <button type="submit" className="btn-recruiter">Publish Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;