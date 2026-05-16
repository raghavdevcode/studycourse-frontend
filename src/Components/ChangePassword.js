import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/userReducer";

// constant outside component (BEST PRACTICE)
const passwordRegex =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}/;

function ChangePassword() {
  const udata = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [currpass, setcurrpass] = useState("");
  const [newpass, setnewpass] = useState("");
  const [cnewpass, setcnewpass] = useState("");

  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCNew, setShowCNew] = useState(false);

  const [verrors, setverrors] = useState({});

  useEffect(() => {
    document.title = "Change Password - Study Course";
  }, []);

  // validation (clean + stable)
  const validateForm = useCallback(() => {
    const errors = {};

    if (!currpass?.trim()) {
      errors.currpass = "Current password is required";
    }

    if (!newpass?.trim()) {
      errors.newpass = "New password is required";
    } else if (!passwordRegex.test(newpass)) {
      errors.newpass =
        "Password must contain uppercase, lowercase, number, special character & min 6 chars";
    }

    if (!cnewpass?.trim()) {
      errors.cnewpass = "Please confirm your new password";
    } else if (newpass !== cnewpass) {
      errors.cnewpass = "Passwords do not match";
    }

    setverrors(errors);
    return Object.keys(errors).length === 0;
  }, [currpass, newpass, cnewpass]);

  async function handlesubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    if (!udata?.uname) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const apiresp = await api.post("/api/auth/changepassword", {
        oldpass: currpass, 
        newpass,
      });

      const code = apiresp?.data?.code;

      if (code === 1) {
        toast.success("Password changed successfully");

        dispatch(logout());
        sessionStorage.clear();
        localStorage.clear();

        navigate("/login");
      } else if (code === -1) {
        setverrors({ currpass: "Current password is incorrect" });
      } else {
        toast.error(apiresp?.data?.message || "Error while changing password");
      }
    } catch (err) {
      toast.error(err.customMessage || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="w3l-breadcrumb">
        <div className="breadcrumb-bg breadcrumb-bg-about py-2">
           <div className="container pt-3 pb-5 p-lg-4 pt-lg-5">
            <h2 className="title mt-5 pt-lg-5 pt-sm-3">Change Password</h2>

            <ul className="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
              <Link to="/" className="breadcrumb-homelink">
                Home
              </Link>
              <li className="active"> / Change Password </li>
            </ul>
          </div>
        </div>

        <div className="waveWrapper waveAnimation">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none">
            <path
              d="M-5.07,73.52 C149.99,150.00 299.66,-102.13 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
              style={{ stroke: "none" }}
            />
          </svg>
        </div>
      </section>

      <section className="w3l-loginblock pb-5" id="contact">
        <div className="contacts-9 pb-lg-5 pb-md-4">
          <div className="container">
            <div className="top-map">
              <div className="row map-content-9">
                <div className="col-lg-6 pr-lg-5">
                  <form name="form1" onSubmit={handlesubmit}>

                    {/* Current Password */}
                    <div className="input-field">
                      <label>Current Password *</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showCurr ? "text" : "password"}
                          placeholder="Current Password"
                          value={currpass}
                          onChange={(e) => {
                            setcurrpass(e.target.value);
                            if (e.target.value.trim() !== "")
                              setverrors(old => ({ ...old, currpass: undefined }));
                          }}
                        />
                        <i
                          className={`fa ${showCurr ? "fa-eye-slash toggle-icon-change-password" : "fa-eye toggle-icon-change-password"}`}
                          onClick={() => setShowCurr(!showCurr)}
                        ></i>
                      </div>
                      {verrors.currpass ? <span className="text-danger">{verrors.currpass}</span> : null}
                    </div>
                    <br />

                    {/* New Password */}
                    <div className="input-field">
                      <label>New Password *</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showNew ? "text" : "password"}
                          placeholder="New Password"
                          value={newpass}
                          onChange={(e) => {
                            setnewpass(e.target.value);
                            if (passwordRegex.test(e.target.value))
                              setverrors(old => ({ ...old, newpass: undefined }));
                            if (e.target.value === cnewpass)
                              setverrors(old => ({ ...old, cnewpass: undefined }));
                          }}
                          style={{ width: "100%", padding: "10px 40px 10px 10px" }}
                        />
                        <i
                          className={`fa ${showNew ? "fa-eye-slash toggle-icon-change-password" : "fa-eye toggle-icon-change-password"}`}
                          onClick={() => setShowNew(!showNew)}
                        ></i>
                      </div>
                      {verrors.newpass ? <span className="text-danger">{verrors.newpass}</span> : null}
                    </div>
                    <br />

                    {/* Confirm New Password */}
                    <div className="input-field">
                      <label>Confirm New Password *</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showCNew ? "text" : "password"}
                          placeholder="Confirm New Password"
                          value={cnewpass}
                          onChange={(e) => {
                            setcnewpass(e.target.value);
                            if (e.target.value === newpass)
                              setverrors(old => ({ ...old, cnewpass: undefined }));
                          }}
                          style={{ width: "100%", padding: "10px 40px 10px 10px" }}
                        />
                        <i
                          className={`fa ${showCNew ? "fa-eye-slash toggle-icon-change-password" : "fa-eye toggle-icon-change-password"}`}
                          onClick={() => setShowCNew(!showCNew)}
                        ></i>
                      </div>
                      {verrors.cnewpass ? <span className="text-danger">{verrors.cnewpass}</span> : null}
                    </div>
                    <br />
                    <button
                      type="submit"
                      className="btn btn-primary btn-style login-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                            style={{ marginRight: "6px" }}
                          ></span>
                          Changing password...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </button>

                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ChangePassword;