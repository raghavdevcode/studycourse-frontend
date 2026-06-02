import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import ThemeToggle from "./ThemeToggle";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/userReducer";
import { toast } from "react-toastify";

const menuItems = [
  { icon: "🏠", label: "Dashboard", path: "/adminlayout" },
  { icon: "🔍", label: "Search User", path: "/adminlayout/searchuser", section: "Management" },
  { icon: "👥", label: "List of Members", path: "/adminlayout/getallmembers" },
  { icon: "🛡️", label: "Create Admin", path: "/adminlayout/createadmin" },
  { icon: "📁", label: "Manage Category", path: "/adminlayout/managecategory", section: "Content" },
  { icon: "🗂️", label: "Manage Sub Category", path: "/adminlayout/managesubcategory" },
  { icon: "📚", label: "Manage Lesson", path: "/adminlayout/managelesson" },
];




function AdminLayout() {
  const udata = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalSubCategories, setTotalSubCategories] = useState(0);
  const [totalEnrollments, setTotalEnrollments] = useState(0);

 const getDashboardStats = async () => {
    try {
      const [usersRes, catRes, subcatRes, enrollRes] = await Promise.all([
        api.get("/api/auth/allusers", { skipErrorToast: true }),          
        api.get("/api/category/getall", { skipErrorToast: true }),     
        api.get("/api/subcategory/getall", { skipErrorToast: true }), 
        api.get("/api/enrollment/count", { skipErrorToast: true })     
      ]);

      if (usersRes?.data?.code === 1)
        setTotalUsers(usersRes.data.udata.length);

      if (catRes?.data?.code === 1)
        setTotalCategories(catRes.data.cdata.length);

      if (subcatRes?.data?.code === 1)
        setTotalSubCategories(subcatRes.data.scdata.length);

      if (enrollRes?.data?.code === 1)
        setTotalEnrollments(enrollRes.data.count);
 
    } catch (err) {
      console.error("Dashboard API Error:", err);
    }
};


  useEffect(() => {
    document.title = "Admin Layout - Study Course";
  }, []);

  useEffect(() => {
    getDashboardStats();
  }, []);


  const stats = [
    { label: "Total Users", value: totalUsers, color: "#4D9FFF" },
    { label: "Enrollments", value: totalEnrollments, color: "#FF8A65" },
    { label: "Categories", value: totalCategories, color: "#00E5A0" },
    { label: "Sub Categories", value: totalSubCategories, color: "#A78BFA" },

  ];

  const currentPath = location.pathname;

  const sidebarClass = [
    "adm-sidebar",
    collapsed ? "adm-collapsed" : "",
    mobileOpen ? "adm-mobile-open" : "",
  ].filter(Boolean).join(" ");


async function handlelogout() {
  try {
    await api.post("/api/auth/logout", {}, {
      skipErrorToast: true
    });

    dispatch(logout());

    sessionStorage.clear();
    localStorage.clear();

    toast.success("Logged out successfully");

    navigate("/homepage");

  } catch (e) {
    console.error(e);
    toast.error("Logout failed");
  }
}


  const renderNav = () => {
    let lastSection = "__none__";
    return menuItems.map((item) => {
      const showSection = item.section && item.section !== lastSection;
      if (item.section) lastSection = item.section;
      const isActive = currentPath === item.path;
      return (
        <div key={item.label}>
          {showSection && <div className="adm-nav-section">{item.section}</div>}
          <li>
            <Link
              to={item.path}
              className={`adm-nav-link${isActive ? " adm-active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="adm-nav-icon">{item.icon}</span>
              <span className="adm-nav-label">{item.label}</span>
              {item.badge && (
                <span className={`adm-nav-badge${item.badge === "New" ? " adm-badge-new" : ""}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        </div>
      );
    });
  };

  return (
    <div className="adm-wrapper">

      {/*SIDE-MENU-BAR*/}
      <aside className={sidebarClass}>
        <div className="adm-sidebar-logo" style={{cursor:"context-menu"}}>
          <div className="adm-logo-icon"><img src="/images/favicon.png" height="25" alt="logoicon" /></div>
          <div className="adm-logo-text">
            <strong>Admin Panel</strong>
            <small>Study Course</small>
          </div>
        </div>

        <ul className="adm-nav">{renderNav()}</ul>

        <div className="adm-sidebar-user">
          <div className="adm-user-card">
            <div className="adm-user-avatar">
              {udata?.pname ? udata.pname.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="adm-user-info">
              <div className="adm-user-name">{udata?.pname || "Admin"}</div>
              <div className="adm-user-email">{udata?.uname || ""}</div>
            </div>

          </div>

        </div>

        <button className="adm-btn adm-btn-ghost" onClick={handlelogout} title="Logout">
          <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
        </button>
        <br />
      </aside>

      {mobileOpen && (
        <div
          className="adm-sidebar-overlay"
          style={{ display: "block" }}
          onClick={() => setMobileOpen(false)}
        />
      )}


      <div className="adm-main">

        {/* ── Header ── */}
        <header className="adm-header">
          <button
            className="adm-toggle-btn"
            onClick={() =>
              window.innerWidth < 992
                ? setMobileOpen(!mobileOpen)
                : setCollapsed(!collapsed)
            }
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          <div className="adm-header-right">

            <div className="mobile-position">
              <nav className="navigation">
                <ThemeToggle />
              </nav>
            </div>


          </div>
        </header>

        {/*Content*/}
        <main className="adm-content">
          {location.pathname === "/adminlayout" ? (
            <>
              {/* Dashboard UI */}
              <div className="adm-page-title">
                <h1>Dashboard</h1>
              </div>

              <div className="adm-stats-grid">
                {stats.map((s) => (
                  <div key={s.label} className="adm-stat-card">
                    <div>{s.label}</div>
                    <div>{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="adm-stats-grid" style={{ marginBottom: "28px" }}> {menuItems.slice(1).map((item) => (<Link key={item.label} to={item.path} style={{ textDecoration: "none" }}> <div className="adm-stat-card" style={{ cursor: "pointer", transition: "transform 0.2s", "--adm-stat-color": "#4D9FFF" }} onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")} >
                <div style={{ fontSize: "26px", marginBottom: "10px" }}>{item.icon}</div>
                <div className="adm-stat-label" style={{ fontSize: "13px", fontWeight: 600, color: "#B0B8C8" }}> {item.label} </div> <div style={{ fontSize: "11px", color: "#4D9FFF", marginTop: "6px" }}> Click to open → </div> </div> </Link>))} </div>
            </>

          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;