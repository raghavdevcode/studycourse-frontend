import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginApi } from "../api/authApi";
import { useDispatch } from "react-redux";
import { login } from "../reducers/userReducer";

function Login() {

    useEffect(() => {
        document.title = "Login - Study Course";
    }, []);

    const [uname, setuname] = useState("");
    const [pass, setpass] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({ uname: "", pass: "" });
    const [loading, setLoading] = useState(false);
    const SITE_KEY = "6LcU4NgsAAAAAEsrgnHS7c0vlcAxJYTFFsbdmFBi"

      // Load reCAPTCHA v2 script
    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://www.google.com/recaptcha/api.js"
        script.async = true
        script.defer = true
        document.body.appendChild(script)
    }, [])

    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function handlesubmit(e) {
        e.preventDefault();

        // Get captcha token from widget
        const token = window.grecaptcha.getResponse()
        if(!token)
                    {
                        toast.info("Please complete captcha verification")
                        return
                    }

        let newErrors = { uname: "", pass: "" };
        let isValid = true;

        if (!uname || uname.trim() === "") {
            newErrors.uname = "Email is required";
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(uname)) {
                newErrors.uname = "Valid email enter karo";
                isValid = false;
            }
        }

        if (!pass || pass.trim() === "") {
            newErrors.pass = "Password is required";
            isValid = false;
        }

        setErrors(newErrors);
        if (!isValid) return;

        setLoading(true);

        try {
            const logindata = {
                uname,
                pass,
                remember: rememberMe,
                 captcha: token
            };

            const apiresp = await loginApi(logindata);

            if (apiresp?.code === 1) {
                window.grecaptcha.reset()
                setuname("");
                setpass("");
                setShowPassword(false);
                setRememberMe(false);

                const user = apiresp.udata;
                dispatch(login(user));

                if (rememberMe) {
                    localStorage.setItem("uinfo", JSON.stringify(user));
                } else {
                    sessionStorage.setItem("uinfo", JSON.stringify(user));
                }

                toast.success("Login Successful!");

                if (user.usertype === "admin") {
                    navigate("/adminlayout");
                } else if (user.usertype !== "admin") {
                    const lid = sessionStorage.getItem("lid");
                    sessionStorage.removeItem("lid");

                    navigate(lid ? `/details?lid=${lid}` : "/studentdashboard");
                }

            } else {
                toast.error("Incorrect Username/Password");
            }

        } catch (err) {
            toast.error(err?.response?.data?.message || err?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <section className="w3l-breadcrumb">
                <div className="breadcrumb-bg breadcrumb-bg-about py-2">
                 <div className="container pt-3 pb-5 p-lg-4 pt-lg-5">
                        <h2 className="title mt-5 pt-lg-5 pt-sm-3">Login page</h2>
                        <ul className="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
                            <Link to="/" className="breadcrumb-homelink">Home</Link>
                            <li className="active"> / Login </li>
                        </ul>
                    </div>
                </div>
                <div className="waveWrapper waveAnimation">
                    <svg viewBox="0 0 500 150" preserveAspectRatio="none">
                        <path d="M-5.07,73.52 C149.99,150.00 299.66,-102.13 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
                            style={{ stroke: "none" }}></path>
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
                                        <div className="form-grid">

                                            {/* Email Field */}
                                            <div className="input-field">
                                                <label>Username or Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    placeholder="Username or Email"
                                                    value={uname}
                                                    required
                                                    maxLength="100"
                                                    title="Enter a valid email address"
                                                    autoComplete="email"
                                                    onChange={(e) => {
                                                        setuname(e.target.value);
                                                        setErrors({ ...errors, uname: "" });
                                                    }}
                                                />
                                                {errors.uname && (
                                                    <p style={{ color: "red", fontSize: "16px", marginTop: "4px" }}>
                                                        {errors.uname}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Password Field */}
                                            <div className="input-field mt-4" style={{ position: "relative" }}>
                                                <label>Password</label>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="Password"
                                                    id="Password"
                                                    placeholder="Password"
                                                    value={pass}
                                                    required
                                                    minLength="6"
                                                    maxLength="50"
                                                    title="Enter your password"
                                                    autoComplete="current-password"
                                                    onChange={(e) => {
                                                        setpass(e.target.value);
                                                        setErrors({ ...errors, pass: "" });
                                                    }}
                                                    style={{ paddingRight: "45px" }}
                                                />
                                                <i
                                                    className={showPassword ? "fa-solid fa-eye-slash toggle-icon" : "fa-solid fa-eye toggle-icon"}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    style={{
                                                        position: "absolute",
                                                        right: "28px",
                                                        top: "74%",
                                                        transform: "translateY(-50%)",
                                                        cursor: "pointer",
                                                        color: "#888"
                                                    }}
                                                ></i>
                                            </div>

                                            {errors.pass && (
                                                <p style={{ color: "red", fontSize: "16px", marginTop: "4px" }}>
                                                    {errors.pass}
                                                </p>
                                            )}

                                            {/* Remember Me Checkbox */}
                                            <div className="input-field mt-3" style={{ display: "flex", cursor: "pointer", alignItems: "center", gap: "8px" }}>
                                                <label className="checkbox remember-me" style={{ marginTop: "2%" }}>
                                                    <input
                                                        type="checkbox"
                                                        name="rememberme"
                                                        checked={rememberMe}
                                                        onChange={(e) => setRememberMe(e.target.checked)}
                                                    />
                                                    <i> </i> Remember me
                                                </label>
                                            </div>

                                        </div>

                                        <Link to="/forgotpassword">Forgot password?</Link> <br /> <br />
                                <div className="g-recaptcha" 
                                data-sitekey={SITE_KEY}></div>
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
                                                    Logging in...
                                                </>
                                            ) : (
                                                "Login now"
                                            )}
                                        </button>
                                    </form>
                                </div>

                                <div className="col-lg-6 social-login-details align-self pl-lg-5 mt-lg-0 mt-4">
                                 <div className="info-box">
    <h4>Continue Your Learning Journey 🚀</h4>
    
    <p style={{ marginBottom: "10px", color: "#555" }}>
        Track your progress, complete lessons, and keep improving your skills step by step.
    </p>

    <ul>
        <li>📚 Access all your enrolled courses anytime</li>
        <li>🎯 Continue from where you left off</li>
        <li>📊 Monitor your learning progress in real-time</li>
        <li>🔥 Maintain your daily learning streak</li>
        <li>💾 Save and revisit important lessons</li>
    </ul>
</div>

                                    <p className="text-center mt-4">
                                        Not yet registered? <Link to="/signup" className="breadcrumb-homelink">signup</Link> here
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Login;