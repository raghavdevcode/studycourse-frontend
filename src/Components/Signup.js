import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signupApi } from "../api/authApi";

function Signup() {

    useEffect(() => {
        document.title = "Signup - Study Course";
    }, []);

    const [pname, setpname] = useState("");
    const [phone, setphone] = useState("");
    const [uname, setuname] = useState("");
    const [pass, setpass] = useState("");
    const [cpass, setcpass] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [terms, setterms] = useState(false);
    const [verrors, setverrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    
    const SITE_KEY = "6LcU4NgsAAAAAEsrgnHS7c0vlcAxJYTFFsbdmFBi"

// Load reCAPTCHA script
useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js"
    script.async = true
    script.defer = true
    document.body.appendChild(script)
}, [])

    const validateForm = () => {
        const errors = {};

        if (!pname || pname.trim().length < 3) {
            errors.pname = "Name must be at least 3 characters long";
        }

        if (!/^\d{10}$/.test(phone)) {
            errors.phone = "Phone must be a 10-digit number";
        }

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(uname)) {
            errors.email = "Invalid email format";
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}/.test(pass)) {
            errors.password =
                "Password must contain at least 1 uppercase, 1 number, 1 special character, and min 6 characters";
        }

        if (pass !== cpass) {
            errors.passmatch = "Password and confirm password do not match";
        }

        if (!terms) {
            errors.terms = "Please accept terms and conditions";
        }

        setverrors(errors);

        return Object.keys(errors).length === 0;
    };

    async function handleRegister(e) {
        e.preventDefault();

    //  Captcha check
    const token = window.grecaptcha.getResponse()
    if (!token) {
        toast.info("Please complete captcha verification")
        return
    }

        if (!validateForm()) return;

        setLoading(true);

        try {
            const apidata = { pname, phone, uname, pass, captcha: token };

            const apiresp = await signupApi(apidata);
            console.log(apiresp);
            if (apiresp.data.code === 1) {
                window.grecaptcha.reset() 
                toast.success("Signup successful, Check your mail to activate account");
                navigate("/login");
            } else if (apiresp.data.code === -1) {
                toast.error("Error while sending activation mail");
            } else if (apiresp.data.code === -2) {
                toast.error("Username already exists");
            } else {
                toast.error("Error while signing up");
            }

        } catch (e) {
            const msg =
                e?.response?.data?.msg ||
                e?.response?.data?.message ||
                e?.message ||
                "Something went wrong";

            toast.error(msg);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <section className="w3l-breadcrumb">
                <div className="breadcrumb-bg breadcrumb-bg-about py-2">
                     <div className="container pt-3 pb-5 p-lg-4 pt-lg-5">
                        <h2 className="title mt-5 pt-lg-5 pt-sm-3">Signup / Registration page</h2>
                        <ul className="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
                            <Link to="/" className="breadcrumb-homelink">Home</Link>
                            <li className="active"> / Signup </li>
                        </ul>
                    </div>
                </div>
                <div className="waveWrapper waveAnimation">
                    <svg viewBox="0 0 500 150" preserveAspectRatio="none">
                        <path
                            d="M-5.07,73.52 C149.99,150.00 299.66,-102.13 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
                            style={{ stroke: "none" }}
                        ></path>
                    </svg>
                </div>
            </section>

            <section className="w3l-loginblock pb-5" id="contact">
                <div className="contacts-9 pb-lg-5 pb-md-4">
                    <div className="container">
                        <div className="top-map">
                            <div className="map-content-9">

                                <form onSubmit={handleRegister}>
                                    <div className="form-grid signupgrids">

                                        {/* Name */}
                                        <div className="input-field">
                                            <label>Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Name" minLength={3}
                                                onChange={(e) => setpname(e.target.value)}
                                            />
                                            {verrors.pname && <span className="text-danger">{verrors.pname}</span>}
                                        </div>

                                        {/* Phone */}
                                        <div className="input-field">
                                            <label>Phone *</label>
                                            <input
                                                type="tel"
                                                minLength={10}
                                                maxLength={10}
                                                pattern="[0-9]{10}"
                                                placeholder="Phone number"
                                                onChange={(e) => setphone(e.target.value)}
                                            />
                                            {verrors.phone && <span className="text-danger">{verrors.phone}</span>}
                                        </div>

                                        {/* Email */}
                                        <div className="input-field">
                                            <label>Email *</label>
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                onChange={(e) => setuname(e.target.value)}
                                            />
                                            {verrors.email && <span className="text-danger">{verrors.email}</span>}
                                        </div>

                                        {/* Password */}
                                        <div className="input-field">
                                            <label>Password *</label>
                                            <div className="password-box">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Password"
                                                    required
                                                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}"
                                                    title="Min 6 chars, 1 uppercase, 1 number, 1 special character"
                                                    onChange={(e) => setpass(e.target.value)}
                                                />
                                                <i
                                                    className={showPassword ? "fa-solid fa-eye-slash toggle-icon-signup" : "fa-solid fa-eye toggle-icon-signup"}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                ></i>
                                            </div>
                                            {verrors.password && <span className="text-danger">{verrors.password}</span>}
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="input-field">
                                            <label>Confirm Password *</label>
                                            <div className="password-box">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirm password" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}"
                                                    title="Min 6 chars, 1 uppercase, 1 number, 1 special character" onChange={(e) => setcpass(e.target.value)}
                                                />
                                                <i
                                                    className={showConfirmPassword ? "fa-solid fa-eye-slash toggle-icon-signup" : "fa-solid fa-eye toggle-icon-signup"}
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                ></i>
                                            </div>
                                            {verrors.passmatch && <span className="text-danger">{verrors.passmatch}</span>}
                                        </div>

                                    </div>

                                    {/* Terms */}
                                    <div className="check">
                                        <label className="checkbox" style={{ marginTop: "2%" }}>
                                            <input
                                                type="checkbox"
                                                checked={terms}
                                                onChange={(e) => setterms(e.target.checked)}
                                            />
                                            <i> </i>I accept the terms and conditions
                                        </label>

                                        {verrors.terms && (
                                            <span className="text-danger d-block mt-1">
                                                {verrors.terms}
                                            </span>
                                        )}
                                    </div><br/>
                                    <div className="g-recaptcha" data-sitekey={SITE_KEY}></div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-style mt-4"
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
                                                Signing...
                                            </>
                                        ) : (
                                            "Signup / Register now"
                                        )}
                                    </button>

                                    <br /><br />
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Signup;