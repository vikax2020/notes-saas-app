import React, { useEffect, useState } from "react";
import axios from "axios";

function Notes({ user }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [tenant, setTenant] = useState({});
  const [notesCount, setNotesCount] = useState(0);

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [showAll, setShowAll] = useState(false); // Admin toggle

  useEffect(() => {
    getHealthData();
    getNotes();
  }, []);

  const getHealthData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/health`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.success) {
        setTenant(res.data.body.tenant);
      }
    } catch (err) {
      console.log("health error:", err);
    }
  };

  const getNotes = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/notes`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.success) {
        // Convert ObjectId to string for comparison
        const formattedNotes = res.data.body.map((n) => ({
          ...n,
          user: n.user.toString(),
        }));
        setNotes(formattedNotes);

        // Count only current user's notes
        const userNotesCount = formattedNotes.filter((n) => n.user === user._id).length;
        setNotesCount(userNotesCount);
      }
    } catch (err) {
      console.log("notes error:", err);
    }
  };

  const addNote = async () => {
    setError("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (tenant.plan === "free" && notesCount >= 3) {
      setError("Free plan limit reached. Upgrade to Pro.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/notes/create`,
        { title, content },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (res.data.success) {
        const newNote = { ...res.data.body, user: res.data.body.user.toString() };
        setNotes([...notes, newNote]);
        setNotesCount(notesCount + 1);
        setTitle("");
        setContent("");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  const removeNote = async (id) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/notes/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.success) {
        setNotes(notes.filter((n) => n._id !== id));
        if (res.data.body.user === user._id) setNotesCount(notesCount - 1);
      }
    } catch (err) {
      console.log("delete error:", err);
    }
  };

  const startEdit = (note) => {
    setEditingNoteId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditTitle("");
    setEditContent("");
  };

  const updateNote = async (id) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/notes/${id}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (res.data.success) {
        const updatedNote = { ...res.data.body, user: res.data.body.user.toString() };
        setNotes(notes.map((n) => (n._id === id ? updatedNote : n)));
        cancelEdit();
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  const upgradePlan = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/tenant/${user.tenantId}/upgrade`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (res.data.success) {
        setTenant(res.data.body);
        alert("Plan upgraded to Pro!");
      }
    } catch (err) {
      alert("Upgrade failed");
    }
  };

  // Filter notes for display
  const filteredNotes = notes.filter((note) => {
    if (user.role === "Admin" && showAll) return true; // admin toggle
    return note.user === user._id; // member sees only own notes
  });

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2>
        Notes for: <span style={{ color: "green" }}>{tenant.name || user.tenantId}</span>
      </h2>
      <p>
        Plan: <b>{tenant.plan}</b> | Notes: <b>{notesCount}</b>
      </p>

      {/* Add Note */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "5px" }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "5px" }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={addNote} style={{ marginRight: "10px", padding: "8px 12px" }}>
          Add Note
        </button>

        {tenant.plan === "free" && user.role === "Admin" && (
          <button
            onClick={upgradePlan}
            style={{ padding: "8px 12px", backgroundColor: "green", color: "white" }}
          >
            Upgrade to Pro
          </button>
        )}

        {user.role === "Admin" && (
          <button
            onClick={() => setShowAll(!showAll)}
            style={{ marginLeft: "10px", padding: "8px 12px" }}
          >
            {showAll ? "See My Notes" : "See All Tenant Notes"}
          </button>
        )}
      </div>

      {/* Notes List */}
      <div style={{ marginTop: "30px" }}>
        {filteredNotes.length === 0 ? (
          <p>No notes yet.</p>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note._id}
              style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
            >
              {editingNoteId === note._id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ width: "100%", padding: "5px", marginBottom: "5px" }}
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{ width: "100%", padding: "5px", marginBottom: "5px" }}
                  />
                  <button onClick={() => updateNote(note._id)} style={{ marginRight: "5px" }}>
                    Save
                  </button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <h4>{note.title}</h4>
                  <p>{note.content}</p>
                  {(user.role === "Admin" || note.user === user._id) && (
                    <>
                      <button
                        onClick={() => startEdit(note)}
                        style={{
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px 8px",
                          border: "none",
                          cursor: "pointer",
                          marginRight: "5px",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeNote(note._id)}
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          padding: "5px 8px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;
