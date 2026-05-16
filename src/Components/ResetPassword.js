import api from "../api/api";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newpass, setNewpass] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
useEffect(() => {
    document.title = "Reset Password - Study Course";
    if (!token) { navigate("/login"); return; }

    // ✅ Token validate karo
    api.get(`/api/auth/validtoken?token=${token}`)
        .then((resp) => {
            if (resp.data.code === -1) {
                toast.error("Link expired! Please request a new one.");
                navigate("/forgotpassword");
            } else if (resp.data.code !== 1) {
                toast.error("Invalid link!");
                navigate("/login");
            }
        })
        .catch(() => navigate("/login"));
}, [token, navigate]);

async function handleSubmit(e) {
    e.preventDefault();
    if (newpass !== confirmpass) {
        toast.error("Passwords do not match!");
        return;
    }
    setLoading(true);
    try {
        const resp = await api.post(`/api/auth/reset`, { token, pass: newpass });
        if (resp.data.code === 1) {
            toast.success("Password reset successfully! Please login.");
            navigate("/login");
        } else {
            toast.error("Something went wrong! Please try again.");
        }
    } catch (e) {
        toast.error(e?.message || "Something went wrong");
    } finally {
        setLoading(false);
    }
}

  return (
    <>
      <section className="w3l-breadcrumb">
        <div className="breadcrumb-bg breadcrumb-bg-about py-2">
       <div className="container pt-3 pb-5 p-lg-4 pt-lg-5">
            <h2 className="title mt-5 pt-lg-5 pt-sm-3">Reset Password</h2>
            <ul className="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
              <Link to="/" className="breadcrumb-homelink">Home</Link>
              <li className="active"> / Reset Password </li>
            </ul>
          </div>
        </div>
        <div className="waveWrapper waveAnimation">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none">
            <path d="M-5.07,73.52 C149.99,150.00 299.66,-102.13 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: "none" }}></path>
          </svg>
        </div>
      </section>

      <section className="w3l-loginblock pb-5" id="contact">
        <div className="contacts-9 pb-lg-5 pb-md-4">
          <div className="container">
            <div className="top-map">
              <div className="row map-content-9">
                <div className="col-lg-6 pr-lg-5">
                  <h2>Reset Password</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-grid">

                      <div className="input-field">
                        <label>New Password</label>

                        <div className="password-box">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="Password"
                            placeholder="Enter new password"
                            value={newpass}
                            required
                            minLength="8"
                            pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$"
                            title="Password must be at least 8 characters long and include at least one letter, one number, and one special character"
                            onChange={(e) => setNewpass(e.target.value)}
                          />

                          <i
                            className={showPassword ? "fa-solid fa-eye-slash toggle-icon-signup" : "fa-solid fa-eye toggle-icon-signup"}
                            onClick={() => setShowPassword(!showPassword)}
                          ></i>
                        </div>
                      </div>

                      <div className="input-field">
                        <label>Confirm Password *</label>

                        <div className="password-box">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirm_password"
                            placeholder="Confirm new password"
                            value={confirmpass}
                            required
                            minLength="8"
                            pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$"
                            title="Must match the same valid password format"
                            onChange={(e) => setConfirmpass(e.target.value)}
                          />

                          <i
                            className={showConfirmPassword ? "fa-solid fa-eye-slash toggle-icon-signup" : "fa-solid fa-eye toggle-icon-signup"}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          ></i>
                        </div>
                      </div>
                    </div>

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
                          Resetting password...
                        </>
                      ) : (
                        "Reset Password"
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

export default ResetPassword;