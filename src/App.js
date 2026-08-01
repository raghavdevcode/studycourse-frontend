import axios from "axios";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import SiteRoutes from "./Components/SiteRoutes";

import { ToastContainer } from "react-toastify";

import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { useDispatch } from "react-redux";

import { login, logout } from "./reducers/userReducer";

axios.defaults.withCredentials = true;

function AppContent() {

  const location = useLocation();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  // check authentication
  useEffect(() => {

    async function checkAuth() {

      try {

        const res = await axios.get(
          `${process.env.REACT_APP_APIURL}/api/auth/getuser`,
          { withCredentials: true }
        );

        if (res.data.code === 1) {

          dispatch(login(res.data.udata));

        } else {

          dispatch(logout());

        }

      } catch (err) {

        dispatch(logout());

      } finally {

        setLoading(false);

      }
    }

    checkAuth();

  }, [dispatch]);

    // wake up backend (optional, extra safety)
  useEffect(() => {
    fetch(`${process.env.REACT_APP_APIURL}/health`)
      .then(() => console.log("Backend awake ho gaya!"))
      .catch((err) => console.log("Waking up backend...", err));
  }, []);

  if (loading) {

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const hideLayoutRoutes =
    location.pathname.startsWith("/adminlayout") ||
    location.pathname.startsWith("/studentdashboard");

  return (
    <>
      <ToastContainer theme="colored" />

      {!hideLayoutRoutes && <Header />}

      <SiteRoutes />

      {!hideLayoutRoutes && <Footer />}
    </>
  );
}

function App() {

  return <AppContent />;

}

export default App;
