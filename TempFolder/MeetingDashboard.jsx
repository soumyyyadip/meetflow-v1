import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const INITIAL_MEETINGS = [
    {
        id: 1,
        title: "Q2 Product Roadmap Review",
        date: "2025-03-20",
        time: "10:00 AM",
        status: "completed",
        participants: [
            { id: 1, name: "Aryan Mehta", role: "facilitator", initials: "AM", color: "#2D6A4F" },
            { id: 2, name: "Priya Sharma", role: "attendee", initials: "PS", color: "#1B4332" },
            { id: 3, name: "Rohit Das", role: "attendee", initials: "RD", color: "#40916C" },
        ],
        minutes: "Reviewed Q2 goals across product verticals. Team aligned on prioritising the search overhaul and mobile parity features. Budget allocation confirmed at ₹18L for tooling.",
        decisions: [
            "Freeze feature requests after April 15th",
            "Launch beta to 500 users by May 1st",
        ],
        actionItems: [
            { id: 1, text: "Create detailed spec for search overhaul", assignee: "Priya Sharma", due: "2025-03-27", status: "done" },
            { id: 2, text: "Set up beta user waiting list", assignee: "Rohit Das", due: "2025-03-28", status: "in-progress" },
            { id: 3, text: "Review tooling budget with finance", assignee: "Aryan Mehta", due: "2025-03-25", status: "done" },
        ],
    },
    {
        id: 2,
        title: "Engineering Sprint Planning — Sprint 14",
        date: "2025-03-22",
        time: "2:00 PM",
        status: "completed",
        participants: [
            { id: 4, name: "Kavya Nair", role: "facilitator", initials: "KN", color: "#9B2226" },
            { id: 5, name: "Dev Anand", role: "attendee", initials: "DA", color: "#AE2012" },
            { id: 6, name: "Simran Kaur", role: "attendee", initials: "SK", color: "#CA6702" },
            { id: 7, name: "Rohit Das", role: "attendee", initials: "RD", color: "#40916C" },
        ],
        minutes: "Sprint 14 scope finalised. 23 story points committed. Focus on API rate limiting, auth token refresh flow, and resolving the payment webhook backlog. CI pipeline improvements deferred to Sprint 15.",
        decisions: [
            "Rate limiting will be implemented at the gateway level",
            "Payment webhook backlog must be cleared before any new features",
        ],
        actionItems: [
            { id: 4, text: "Implement rate limiting middleware", assignee: "Dev Anand", due: "2025-03-29", status: "in-progress" },
            { id: 5, text: "Fix auth token refresh bug #4421", assignee: "Simran Kaur", due: "2025-03-26", status: "done" },
            { id: 6, text: "Clear payment webhook backlog", assignee: "Rohit Das", due: "2025-03-28", status: "open" },
        ],
    },
    {
        id: 3,
        title: "Design System Alignment",
        date: "2025-03-24",
        time: "11:30 AM",
        status: "upcoming",
        participants: [
            { id: 8, name: "Mira Joshi", role: "facilitator", initials: "MJ", color: "#5C4033" },
            { id: 2, name: "Priya Sharma", role: "attendee", initials: "PS", color: "#1B4332" },
        ],
        minutes: "",
        decisions: [],
        actionItems: [
            { id: 7, text: "Prepare component audit doc", assignee: "Mira Joshi", due: "2025-03-24", status: "open" },
        ],
    },
];

const STATUS_BADGE = {
    completed: { bg: "#D8F3DC", color: "#1B4332", label: "Completed" },
    upcoming: { bg: "#FFF3CD", color: "#7D4E00", label: "Upcoming" },
    "in-progress": { bg: "#D0EBFF", color: "#1864AB", label: "In Progress" },
};

const TASK_STATUS = {
    open: { bg: "#F1F3F5", color: "#495057", label: "Open" },
    "in-progress": { bg: "#D0EBFF", color: "#1864AB", label: "In Progress" },
    done: { bg: "#D8F3DC", color: "#1B4332", label: "Done" },
};

function Badge({ status, type = "meeting" }) {
    const map = type === "task" ? TASK_STATUS : STATUS_BADGE;
    const s = map[status] || map["open"];
    return (
        <span style={{
            background: s.bg, color: s.color,
            fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
            padding: "3px 9px", borderRadius: 20,
            textTransform: "uppercase", whiteSpace: "nowrap",
        }}>{s.label}</span>
    );
}

function Avatar({ p, size = 32 }) {
    return (
        <div title={p.name} style={{
            width: size, height: size, borderRadius: "50%",
            background: p.color, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.35, fontWeight: 600,
            border: "2px solid #fff", flexShrink: 0,
            fontFamily: "'DM Sans', sans-serif",
        }}>{p.initials}</div>
    );
}

function AvatarStack({ participants }) {
    return (
        <div style={{ display: "flex", marginLeft: 6 }}>
            {participants.slice(0, 4).map((p, i) => (
                <div key={p.id} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: i }}>
                    <Avatar p={p} size={28} />
                </div>
            ))}
            {participants.length > 4 && (
                <div style={{
                    marginLeft: -8, width: 28, height: 28, borderRadius: "50%",
                    background: "#E9ECEF", color: "#495057",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 600, border: "2px solid #fff",
                }}>+{participants.length - 4}</div>
            )}
        </div>
    );
}

function SearchBar({ value, onChange }) {
    return (
        <div style={{ position: "relative", width: "100%" }}>
            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
                value={value} onChange={e => onChange(e.target.value)}
                placeholder="Search meetings, decisions, action items…"
                style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "10px 14px 10px 38px",
                    border: "1.5px solid #E9ECEF", borderRadius: 10,
                    fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                    background: "#FAFAFA", color: "#1a1a1a",
                    outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#2D6A4F"}
                onBlur={e => e.target.style.borderColor = "#E9ECEF"}
            />
        </div>
    );
}

function MeetingCard({ meeting, onClick, isActive }) {
    return (
        <div onClick={() => onClick(meeting)} style={{
            background: isActive ? "#F0FDF4" : "#fff",
            border: `1.5px solid ${isActive ? "#2D6A4F" : "#F1F3F5"}`,
            borderRadius: 14, padding: "16px 18px",
            cursor: "pointer", transition: "all 0.18s ease",
            marginBottom: 10,
        }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = "#B7E4C7"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = "#F1F3F5"; }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <p style={{ margin: 0, fontFamily: "'DM Serif Display', serif", fontSize: 15, color: "#1a1a1a", lineHeight: 1.3, maxWidth: "70%" }}>{meeting.title}</p>
                <Badge status={meeting.status} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#868E96", fontFamily: "'DM Sans', sans-serif" }}>
                    {new Date(meeting.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {meeting.time}
                </span>
                <AvatarStack participants={meeting.participants} />
            </div>
            {meeting.actionItems.filter(a => a.status !== "done").length > 0 && (
                <div style={{ marginTop: 8, fontSize: 12, color: "#CA6702", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                    {meeting.actionItems.filter(a => a.status !== "done").length} open task{meeting.actionItems.filter(a => a.status !== "done").length > 1 ? "s" : ""}
                </div>
            )}
        </div>
    );
}

function MeetingDetail({ meeting, onUpdate, onClose }) {
    const [activeTab, setActiveTab] = useState("minutes");
    const [editingMinutes, setEditingMinutes] = useState(false);
    const [minutes, setMinutes] = useState(meeting.minutes);
    const [newDecision, setNewDecision] = useState("");
    const [newTask, setNewTask] = useState({ text: "", assignee: "", due: "" });
    const [showTaskForm, setShowTaskForm] = useState(false);

    const tabs = ["minutes", "decisions", "tasks", "participants"];

    function saveMinutes() {
        onUpdate({ ...meeting, minutes });
        setEditingMinutes(false);
    }

    function addDecision() {
        if (!newDecision.trim()) return;
        onUpdate({ ...meeting, decisions: [...meeting.decisions, newDecision.trim()] });
        setNewDecision("");
    }

    function addTask() {
        if (!newTask.text.trim()) return;
        const task = { id: Date.now(), text: newTask.text, assignee: newTask.assignee, due: newTask.due, status: "open" };
        onUpdate({ ...meeting, actionItems: [...meeting.actionItems, task] });
        setNewTask({ text: "", assignee: "", due: "" });
        setShowTaskForm(false);
    }

    function toggleTask(taskId) {
        const updated = meeting.actionItems.map(t =>
            t.id === taskId ? { ...t, status: t.status === "done" ? "open" : "done" } : t
        );
        onUpdate({ ...meeting, actionItems: updated });
    }

    function cycleTaskStatus(taskId) {
        const cycle = { open: "in-progress", "in-progress": "done", done: "open" };
        const updated = meeting.actionItems.map(t =>
            t.id === taskId ? { ...t, status: cycle[t.status] } : t
        );
        onUpdate({ ...meeting, actionItems: updated });
    }

    const inputStyle = {
        width: "100%", boxSizing: "border-box",
        padding: "9px 12px", border: "1.5px solid #E9ECEF",
        borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
        color: "#1a1a1a", background: "#FAFAFA", outline: "none",
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ padding: "24px 28px 0", borderBottom: "1px solid #F1F3F5" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <h2 style={{ margin: 0, fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#1a1a1a", lineHeight: 1.25, maxWidth: "80%" }}>{meeting.title}</h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#ADB5BD", padding: 0 }}>×</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <Badge status={meeting.status} />
                    <span style={{ fontSize: 13, color: "#868E96", fontFamily: "'DM Sans', sans-serif" }}>
                        {new Date(meeting.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {meeting.time}
                    </span>
                </div>
                {/* Tabs */}
                <div style={{ display: "flex", gap: 0 }}>
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            background: "none", border: "none", cursor: "pointer",
                            padding: "8px 16px", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                            fontWeight: activeTab === tab ? 600 : 400,
                            color: activeTab === tab ? "#2D6A4F" : "#868E96",
                            borderBottom: `2px solid ${activeTab === tab ? "#2D6A4F" : "transparent"}`,
                            textTransform: "capitalize", transition: "all 0.15s",
                        }}>{tab}</button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>

                {/* MINUTES */}
                {activeTab === "minutes" && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#868E96", letterSpacing: "0.08em", textTransform: "uppercase" }}>Meeting Notes</p>
                            {!editingMinutes
                                ? <button onClick={() => setEditingMinutes(true)} style={{ fontSize: 12, color: "#2D6A4F", background: "none", border: "1px solid #2D6A4F", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
                                : <div style={{ display: "flex", gap: 6 }}>
                                    <button onClick={saveMinutes} style={{ fontSize: 12, color: "#fff", background: "#2D6A4F", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Save</button>
                                    <button onClick={() => { setEditingMinutes(false); setMinutes(meeting.minutes); }} style={{ fontSize: 12, color: "#868E96", background: "none", border: "1px solid #E9ECEF", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                                </div>
                            }
                        </div>
                        {editingMinutes ? (
                            <textarea value={minutes} onChange={e => setMinutes(e.target.value)}
                                style={{ ...inputStyle, minHeight: 160, resize: "vertical", lineHeight: 1.7 }} />
                        ) : (
                            <p style={{ fontSize: 14, color: minutes ? "#1a1a1a" : "#ADB5BD", lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif", fontStyle: minutes ? "normal" : "italic" }}>
                                {minutes || "No minutes recorded yet. Click Edit to add notes."}
                            </p>
                        )}
                    </div>
                )}

                {/* DECISIONS */}
                {activeTab === "decisions" && (
                    <div>
                        <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 600, color: "#868E96", letterSpacing: "0.08em", textTransform: "uppercase" }}>Decisions Taken</p>
                        {meeting.decisions.length === 0 && (
                            <p style={{ color: "#ADB5BD", fontSize: 13, fontStyle: "italic", fontFamily: "'DM Sans', sans-serif" }}>No decisions recorded yet.</p>
                        )}
                        {meeting.decisions.map((d, i) => (
                            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", background: "#F8FFF9", border: "1px solid #D8F3DC", borderRadius: 8, marginBottom: 8 }}>
                                <span style={{ color: "#2D6A4F", fontSize: 16, lineHeight: 1.4, flexShrink: 0 }}>✓</span>
                                <p style={{ margin: 0, fontSize: 14, color: "#1a1a1a", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{d}</p>
                            </div>
                        ))}
                        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                            <input value={newDecision} onChange={e => setNewDecision(e.target.value)}
                                placeholder="Record a decision…"
                                onKeyDown={e => e.key === "Enter" && addDecision()}
                                style={{ ...inputStyle, flex: 1 }} />
                            <button onClick={addDecision} style={{ padding: "9px 16px", background: "#2D6A4F", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, whiteSpace: "nowrap" }}>Add</button>
                        </div>
                    </div>
                )}

                {/* TASKS */}
                {activeTab === "tasks" && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#868E96", letterSpacing: "0.08em", textTransform: "uppercase" }}>Action Items</p>
                            <button onClick={() => setShowTaskForm(!showTaskForm)} style={{ fontSize: 12, color: "#2D6A4F", background: "none", border: "1px solid #2D6A4F", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>+ New Task</button>
                        </div>

                        {showTaskForm && (
                            <div style={{ background: "#F8FFF9", border: "1px solid #D8F3DC", borderRadius: 10, padding: 14, marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                                <input value={newTask.text} onChange={e => setNewTask({ ...newTask, text: e.target.value })} placeholder="Task description" style={inputStyle} />
                                <div style={{ display: "flex", gap: 8 }}>
                                    <input value={newTask.assignee} onChange={e => setNewTask({ ...newTask, assignee: e.target.value })} placeholder="Assignee name" style={{ ...inputStyle, flex: 1 }} />
                                    <input type="date" value={newTask.due} onChange={e => setNewTask({ ...newTask, due: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button onClick={addTask} style={{ padding: "8px 16px", background: "#2D6A4F", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Add Task</button>
                                    <button onClick={() => setShowTaskForm(false)} style={{ padding: "8px 14px", background: "none", color: "#868E96", border: "1px solid #E9ECEF", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                                </div>
                            </div>
                        )}

                        {meeting.actionItems.length === 0 && (
                            <p style={{ color: "#ADB5BD", fontSize: 13, fontStyle: "italic", fontFamily: "'DM Sans', sans-serif" }}>No tasks assigned yet.</p>
                        )}
                        {meeting.actionItems.map(task => (
                            <div key={task.id} style={{
                                display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px",
                                background: task.status === "done" ? "#F8F9FA" : "#fff",
                                border: "1px solid #F1F3F5", borderRadius: 10, marginBottom: 8,
                                opacity: task.status === "done" ? 0.7 : 1,
                            }}>
                                <button onClick={() => toggleTask(task.id)} style={{
                                    width: 18, height: 18, borderRadius: 5, border: `2px solid ${task.status === "done" ? "#2D6A4F" : "#CED4DA"}`,
                                    background: task.status === "done" ? "#2D6A4F" : "transparent",
                                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0, marginTop: 1,
                                }}>
                                    {task.status === "done" && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                                </button>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ margin: "0 0 4px", fontSize: 14, color: "#1a1a1a", fontFamily: "'DM Sans', sans-serif", textDecoration: task.status === "done" ? "line-through" : "none", lineHeight: 1.4 }}>{task.text}</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                        {task.assignee && <span style={{ fontSize: 12, color: "#868E96", fontFamily: "'DM Sans', sans-serif" }}>→ {task.assignee}</span>}
                                        {task.due && <span style={{ fontSize: 12, color: "#868E96", fontFamily: "'DM Sans', sans-serif" }}>Due {new Date(task.due).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>}
                                    </div>
                                </div>
                                <button onClick={() => cycleTaskStatus(task.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
                                    <Badge status={task.status} type="task" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* PARTICIPANTS */}
                {activeTab === "participants" && (
                    <div>
                        <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 600, color: "#868E96", letterSpacing: "0.08em", textTransform: "uppercase" }}>Participants</p>
                        {meeting.participants.map(p => (
                            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: "1px solid #F1F3F5", borderRadius: 10, marginBottom: 8, background: "#fff" }}>
                                <Avatar p={p} size={38} />
                                <div>
                                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#1a1a1a", fontFamily: "'DM Sans', sans-serif" }}>{p.name}</p>
                                    <p style={{ margin: 0, fontSize: 12, color: "#868E96", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>{p.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function App() {
    const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
    const [selected, setSelected] = useState(INITIAL_MEETINGS[0]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showNewMeeting, setShowNewMeeting] = useState(false);
    const [newMeeting, setNewMeeting] = useState({ title: "", date: "", time: "", participantName: "" });

    function updateMeeting(updated) {
        setMeetings(ms => ms.map(m => m.id === updated.id ? updated : m));
        setSelected(updated);
    }

    function createMeeting() {
        if (!newMeeting.title.trim()) return;
        const m = {
            id: Date.now(),
            title: newMeeting.title,
            date: newMeeting.date || new Date().toISOString().split("T")[0],
            time: newMeeting.time || "10:00 AM",
            status: "upcoming",
            participants: newMeeting.participantName
                ? [{ id: Date.now(), name: newMeeting.participantName, role: "facilitator", initials: newMeeting.participantName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2), color: "#2D6A4F" }]
                : [],
            minutes: "",
            decisions: [],
            actionItems: [],
        };
        setMeetings(ms => [m, ...ms]);
        setSelected(m);
        setShowNewMeeting(false);
        setNewMeeting({ title: "", date: "", time: "", participantName: "" });
    }

    const filtered = meetings.filter(m => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            m.title.toLowerCase().includes(q) ||
            m.minutes.toLowerCase().includes(q) ||
            m.decisions.some(d => d.toLowerCase().includes(q)) ||
            m.actionItems.some(a => a.text.toLowerCase().includes(q)) ||
            m.participants.some(p => p.name.toLowerCase().includes(q));
        const matchFilter = filterStatus === "all" || m.status === filterStatus;
        return matchSearch && matchFilter;
    });

    const allOpenTasks = meetings.flatMap(m =>
        m.actionItems.filter(a => a.status !== "done").map(a => ({ ...a, meetingTitle: m.title }))
    );

    const inputStyle = {
        width: "100%", boxSizing: "border-box",
        padding: "9px 12px", border: "1.5px solid #E9ECEF",
        borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
        color: "#1a1a1a", background: "#FAFAFA", outline: "none",
    };

    return (
        <>
            <style>{FONTS}{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #F4F6F4; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D8F3DC; border-radius: 4px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.25s ease both; }
      `}</style>

            <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#F4F6F4" }}>

                {/* SIDEBAR */}
                <div style={{ width: 300, minWidth: 300, background: "#fff", borderRight: "1px solid #F1F3F5", display: "flex", flexDirection: "column", height: "100vh" }}>
                    {/* Logo */}
                    <div style={{ padding: "22px 20px 14px", borderBottom: "1px solid #F1F3F5" }}>
                        <h1 style={{ margin: 0, fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#1a1a1a", letterSpacing: "-0.01em" }}>
                            <span style={{ color: "#2D6A4F" }}>Minutes</span> — </h1>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#ADB5BD" }}>Meeting records & action items</p>
                    </div>

                    {/* Stats row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "12px 16px" }}>
                        {[
                            { label: "Meetings", value: meetings.length },
                            { label: "Open tasks", value: allOpenTasks.length, warn: allOpenTasks.length > 0 },
                            { label: "This month", value: meetings.filter(m => m.date.startsWith("2025-03")).length },
                        ].map(s => (
                            <div key={s.label} style={{ background: "#F8FFF9", border: "1px solid #D8F3DC", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                                <div style={{ fontSize: 18, fontWeight: 600, color: s.warn ? "#CA6702" : "#2D6A4F" }}>{s.value}</div>
                                <div style={{ fontSize: 10, color: "#868E96", marginTop: 1 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Search */}
                    <div style={{ padding: "0 14px 10px" }}>
                        <SearchBar value={search} onChange={setSearch} />
                    </div>

                    {/* Filter */}
                    <div style={{ display: "flex", gap: 6, padding: "0 14px 10px" }}>
                        {["all", "completed", "upcoming"].map(f => (
                            <button key={f} onClick={() => setFilterStatus(f)} style={{
                                flex: 1, padding: "5px 0", fontSize: 11, fontWeight: filterStatus === f ? 600 : 400,
                                textTransform: "capitalize", background: filterStatus === f ? "#2D6A4F" : "transparent",
                                color: filterStatus === f ? "#fff" : "#868E96",
                                border: `1px solid ${filterStatus === f ? "#2D6A4F" : "#E9ECEF"}`,
                                borderRadius: 6, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                            }}>{f}</button>
                        ))}
                    </div>

                    {/* Meeting list */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}>
                        {filtered.length === 0 && (
                            <p style={{ textAlign: "center", color: "#ADB5BD", fontSize: 13, fontStyle: "italic", marginTop: 24 }}>No meetings found.</p>
                        )}
                        {filtered.map(m => (
                            <MeetingCard key={m.id} meeting={m} onClick={setSelected} isActive={selected?.id === m.id} />
                        ))}
                    </div>

                    {/* New meeting button */}
                    <div style={{ padding: "12px 14px", borderTop: "1px solid #F1F3F5" }}>
                        <button onClick={() => setShowNewMeeting(true)} style={{
                            width: "100%", padding: "11px", background: "#2D6A4F", color: "#fff",
                            border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14,
                            fontFamily: "'DM Serif Display', serif", letterSpacing: "0.01em",
                            transition: "background 0.15s",
                        }}
                            onMouseEnter={e => e.target.style.background = "#1B4332"}
                            onMouseLeave={e => e.target.style.background = "#2D6A4F"}
                        >+ New Meeting</button>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    {showNewMeeting ? (
                        <div className="fade-in" style={{ maxWidth: 520, margin: "48px auto", background: "#fff", borderRadius: 16, border: "1px solid #F1F3F5", padding: "32px 36px" }}>
                            <h2 style={{ margin: "0 0 4px", fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#1a1a1a" }}>New Meeting</h2>
                            <p style={{ margin: "0 0 24px", color: "#868E96", fontSize: 13 }}>Fill in the details to create a new meeting record.</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <input value={newMeeting.title} onChange={e => setNewMeeting({ ...newMeeting, title: e.target.value })}
                                    placeholder="Meeting title *" style={{ ...inputStyle, fontSize: 15, padding: "11px 14px" }} />
                                <div style={{ display: "flex", gap: 10 }}>
                                    <input type="date" value={newMeeting.date} onChange={e => setNewMeeting({ ...newMeeting, date: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                                    <input value={newMeeting.time} onChange={e => setNewMeeting({ ...newMeeting, time: e.target.value })}
                                        placeholder="e.g. 2:00 PM" style={{ ...inputStyle, flex: 1 }} />
                                </div>
                                <input value={newMeeting.participantName} onChange={e => setNewMeeting({ ...newMeeting, participantName: e.target.value })}
                                    placeholder="Facilitator name (optional)" style={inputStyle} />
                                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                    <button onClick={createMeeting} style={{ flex: 1, padding: "11px", background: "#2D6A4F", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontFamily: "'DM Serif Display', serif" }}>Create Meeting</button>
                                    <button onClick={() => setShowNewMeeting(false)} style={{ padding: "11px 18px", background: "none", color: "#868E96", border: "1px solid #E9ECEF", borderRadius: 10, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    ) : selected ? (
                        <div className="fade-in" style={{ height: "100%", overflowY: "auto" }}>
                            <MeetingDetail meeting={selected} onUpdate={updateMeeting} onClose={() => setSelected(null)} />
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#ADB5BD" }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#495057" }}>Select a meeting to view details</p>
                            <p style={{ fontSize: 13 }}>or create a new one to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
