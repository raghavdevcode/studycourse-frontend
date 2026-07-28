import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import STUChangePassword from "./STUChangePassword";

function Profile() {
  const udata = useSelector((state) => state.auth);
  const [showChangePassword, setShowChangePassword] = useState(false);
      useEffect(() => {
          document.title = "Profile - Study Course";
      }, []);

  if (!udata) {
    return (
      <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-secondary, #888)", fontSize: 16 }}>Loading profile...</p>
      </section>
    );
  }

  const initials = udata.pname
    ? udata.pname.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "SC";

  const fields = [
    { label: "Full Name", value: udata.pname },
    { label: "Email (Username)", value: udata.uname },
    { label: "Phone Number", value: udata.phone },
    { label: "Account Type", value: udata.utype },
    { label: "Account ID", value: udata.uid },
  ];

  return (
    <section style={{ padding: "48px 0 64px" }}>
      <div className="container">
        <div style={{ maxWidth: 560, margin: "0 auto" }}>

          {/* Avatar + name header */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg, #4f63ff, #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 700, color: "#fff", flexShrink: 0,
              boxShadow: "0 4px 18px rgba(79,99,255,0.3)", cursor:"context-menu"
            }}>
              {initials}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, cursor:"context-menu" }}>{udata.pname}</h2>
              <p style={{ margin: "4px 0 8px", fontSize: 13, color: "#888", cursor:"pointer"}}>{udata.uname}</p>
              <span style={{
                display: "inline-block",
                padding: "3px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                background: udata.usertype === "admin" ? "#ffe0e0" : "#e0edff",
                color: udata.usertype === "admin" ? "#c0392b" : "#1a5fc8",
                cursor:"context-menu"
              }}>
                {udata.usertype === "admin" ? "Admin" : "Student"}
              </span>
            </div>
          </div>

          {/* Info Card */}
          <div style={{
            background: "var(--card-bg, #fff)",
            border: "1px solid var(--card-border, #e8e8e8)",
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 20,
          }}>
            {fields.map(({ label, value }, i) => (
              <div key={label} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 20px",
                cursor:"context-menu",
                borderBottom: i < fields.length - 1 ? "1px solid var(--card-border, #f0f0f0)" : "none",
              }}>
                <span style={{ fontSize: 13, color: "#888", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {label}
                </span>
                <span style={{ fontSize: 14, color: "var(--text-primary, #222)", wordBreak: "break-all", textAlign: "right", maxWidth: "60%" }}>
                  {value || "—"}
                </span>
              </div>
            ))}
          </div>

          {/* Change Password Button */}
      <button
            onClick={() => setShowChangePassword(true)}
            className="btn btn-primary btn-style"
            style={{ display: "block", width: "100%", textAlign: "center", padding: "12px 0", borderRadius: 10, fontSize: 15, border: "none", cursor: "pointer" }}
          >
            🔒 Change Password
          </button>

          {/* Inline Change Password Section */}
          {showChangePassword && (
            <div style={{ marginTop: 24 }}>
              <STUChangePassword />
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

export default Profile;