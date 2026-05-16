import api from "../api/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {

    useEffect(() => {
        document.title = "Forgot Password - Study Course";
    }, []);

    const [uname, setuname] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const SITE_KEY = "6LcU4NgsAAAAAEsrgnHS7c0vlcAxJYTFFsbdmFBi"

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js"
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [])

    async function handlesubmit(e) {
        e.preventDefault();
        
    // Captcha check
    const token = window.grecaptcha.getResponse()
    if (!token) {
        toast.info("Please complete captcha verification")
        return
    }

        if (!uname || uname.trim() === "") {
            setError("Email field is empty");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(uname)) {
            setError("Enter valid email");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const apiresp = await api.post(`/api/auth/forgot`, { email: uname, captcha: token });
            if (apiresp?.data?.code === 1) {
                window.grecaptcha.reset()
                toast.info("Check your mail to reset password. Link is valid for 15 mins only");
            } else {
                toast.error("Error Occured, try again");
            }

        } catch (e) {
            console.error(e);
            toast.error(e?.response?.data?.message || e?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <section className="w3l-breadcrumb">
                <div className="breadcrumb-bg breadcrumb-bg-about py-2">
                     <div className="container pt-3 pb-5 p-lg-4 pt-lg-5">
                        <h2 className="title mt-5 pt-lg-5 pt-sm-3">Forgot Password</h2>
                        <ul className="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
                            <Link to="/" className="breadcrumb-homelink">Home</Link>
                            <li className="active"> / Forgot Password </li>
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
                            <div className="row map-content-9">
                                <div className="col-lg-6 pr-lg-5">

                                    <h2>Forgot Password</h2>

                                    <form name="form1" onSubmit={handlesubmit}>
                                        <div className="form-grid">
                                            <div className="input-field">

                                                <label>Username or Email</label>

                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    placeholder="Enter email"
                                                    value={uname}
                                                    required
                                                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                                    title="Please enter a valid email address"
                                                    onChange={(e) => {
                                                        setuname(e.target.value);
                                                        setError("");
                                                    }}
                                                />

                                                {error && (
                                                    <p style={{ color: "red", fontSize: "16px", marginTop: "4px" }}>
                                                        {error}
                                                    </p>
                                                )}

                                            </div>
                                        </div><br/>
                                        <div className="g-recaptcha" data-sitekey={SITE_KEY}></div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-style login-btn search-btn"
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
                                                    Sending mail...
                                                </>
                                            ) : (
                                                "Submit"
                                            )}
                                        </button>

                                        <br /><br /><br />
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

export default ForgotPassword;