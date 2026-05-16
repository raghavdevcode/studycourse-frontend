import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";
import api from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/userReducer";

function Header() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const udata = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  async function handlelogout() {
    try {
      await api.post(`/api/auth/logout`);

      dispatch(logout());
      sessionStorage.clear();
      localStorage.removeItem("uinfo");
      navigate("/"); // homepage
    } catch (err) {
      console.log(err);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchText.trim() !== "") {
      navigate(`/searchresults?s=${searchText.trim()}`);
      setSearchText("");
      // popup band karne ke liye
      window.location.hash = "close";
    }
  }

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;

      const header = document.getElementById("site-header");

      if (header) {
        if (scroll >= 80) {
          header.classList.add("nav-fixed");
        } else {
          header.classList.remove("nav-fixed");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // cleanup (very important)
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

  }, []);

  return (
    <>


      <div className="top-bar">
        <div className="container d-flex justify-content-between align-items-center">


          <div className="top-left d-flex align-items-center gap-2">
            <div className="avatar">
              {udata?.pname?.charAt(0)?.toUpperCase() || "G"}
            </div>
            <div>
              <p className="welcomemsg mb-0">
                {udata?.isLoggedIn ? udata.pname : <span>Guest</span>}
              </p>
              {udata?.email && (
                <small className="text-white-50">{udata.email}</small>
              )}
            </div>
          </div>


          <div className="top-right">
            {!udata?.isLoggedIn  ? (
              <>
                <Link to="/login" className="btn login mr-2">
                  <span className="fa fa-user"></span> Login
                </Link>
                <Link to="/signup" className="btn login mr-2">
                  <span className="fa fa-user"></span> Signup
                </Link>
              </>
            ) : (
              <>
                <i class="fa-solid fa-lock"></i><Link to="/changepassword">Change Password</Link>
                &nbsp;
                <button className="btn btn-primary top-signout-btn" onClick={handlelogout}>
                  <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign out
                </button>
              </>
            )}
          </div>

        </div>
      </div>


      <div id="site-header" className="fixed-top nav-fixed">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-dark stroke">
            <h1>
              <div className="navbar-brand">
                <Link to="/"><span className="fa fa-diamond"></span>Study Course</Link> <span className="logo">Journey to success</span></div>
            </h1>

            <button className="navbar-toggler  collapsed bg-gradient" type="button" data-toggle="collapse"
              data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon fa icon-expand fa-bars"></span>
              <span className="navbar-toggler-icon fa icon-close fa-times"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav mx-lg-auto">
                <li className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
                  <Link className="nav-link" to="/">Home</Link>
                </li>

                <li className={`nav-item ${location.pathname === "/about" ? "active" : ""}`}>
                  <Link className="nav-link" to="/about">About</Link>
                </li>
                <li className={`nav-item ${location.pathname === "/categories" ? "active" : ""}`}>
                  <Link className="nav-link" to="/categories">Courses</Link>
                </li>
                <li className={`nav-item ${location.pathname === "/contact" ? "active" : ""}`}>
                  <Link className="nav-link" to="/contact">Contact</Link>
                </li>
              </ul>

              <div className="search-right">
                <a href="#search" title="search" style={{ marginLeft: "48%" }}><span className="fa fa-search" aria-hidden="true"></span></a>

                <div id="search" className="pop-overlay">
                  <div className="popup">

                    <form onSubmit={handleSearch} className="search-box">
                      <input
                        type="search"
                        placeholder="Search"
                        name="search"
                        required
                        autoFocus=""
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                      <button type="submit" className="btn">
                        <span className="fa fa-search" aria-hidden="true"></span>
                      </button>
                    </form>

                  </div>
                  <a className="close search-close" href="#close">×</a>
                </div>

              </div>

            </div>

            <div className="mobile-position">
              <nav className="navigation">
                <ThemeToggle />
              </nav>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
export default Header;