import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    activateAccountApi,
    resendActivationApi
} from "../api/authApi";

function ActivateAccount() {
    useEffect(() => {
        document.title = "Activate Account - Study Course";
    }, []);

    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");
    const [email, setEmail] = useState("");
    const [resendLoading, setResendLoading] = useState(false);

    // ✅ Activate Account (API layer use)
    useEffect(() => {
        const code = searchParams.get("id");

        if (!code) {
            setStatus("error");
            return;
        }

        const activateAccount = async () => {
            try {
                const resp = await activateAccountApi(code);

                if (resp?.data?.code === 1) {
                    setStatus("success");
                } else {
                    setStatus("error");
                }
            } catch (error) {
                if (error.name !== "CanceledError") {
                    setStatus("error");
                }
            }
        };

        activateAccount();
    }, [searchParams]);

    // ✅ Resend handler (API layer use)
    async function handleResend(e) {
        e.preventDefault();

        if (!email || email.trim() === "") {
            toast.error("Please enter your email");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email");
            return;
        }

        try {
            setResendLoading(true);

            const resp = await resendActivationApi(email);

            if (resp?.data?.code === 1) {
                toast.success("Activation mail sent! Link is valid for 15 minutes only.");
            }
        } catch (e) {
            console.error("API Error:", e);
        } finally {
            setResendLoading(false);
        }
    }

    const iconStyle = {
        width: "80px", height: "80px", borderRadius: "50%",
        display: "flex", alignItems: "center",
        justifyContent: "center", margin: "0 auto 1.5rem"
    };

    return (
        <>
          <style>{`
            @keyframes spin {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
            }
            @keyframes pulseRing {
                0%, 100% { transform: scale(0.85); opacity: 0.6; }
                50%       { transform: scale(1.05); opacity: 0.2; }
            }
        `}</style>
            <section className="w3l-breadcrumb">
                <div className="breadcrumb-bg breadcrumb-bg-about py-2  py-md-3 py-lg-4">
                    <div className="container pt-3 pb-5 p-lg-4 pt-lg-5">
                        <h2 className="title mt-5 pt-lg-5 pt-sm-3">Account Activation</h2>
                        <ul className="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
                            <Link to="/" className="breadcrumb-homelink">Home</Link>
                            <li className="active"> / Activate Account </li>
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

            <section className="w3l-loginblock pb-5">
                <div className="contacts-9 pb-lg-5 pb-md-4">
                    <div className="container">
                        <div className="top-map">
                            <div className="map-content-9 text-center py-5">

                                {/* Loading */}
                                {status === "loading" && (
                                    <>
                                        <div style={{
                                            width: "80px", height: "80px", borderRadius: "50%",
                                            background: "#E6F1FB",
                                            display: "flex", alignItems: "center",
                                            justifyContent: "center", margin: "0 auto 1.5rem",
                                            animation: "pulseRing 2s ease-in-out infinite"
                                        }}>
                                            <div style={{
                                                width: "56px", height: "56px", borderRadius: "50%",
                                                border: "3px solid #e0e0e0",
                                                borderTopColor: "#378ADD",
                                                animation: "spin 0.9s linear infinite"
                                            }} />
                                        </div>
                                        <h4>Activating your account...</h4>
                                        <p className="text-muted">Please wait while we verify your activation link.</p>
                                    </>
                                )}

                                {/* Success */}
                                {status === "success" && (
                                    <>
                                        <div style={{ ...iconStyle, background: "#EAF3DE", border: "1px solid #97C459" }}>
                                            <svg width="38" height="38" viewBox="0 0 36 36" fill="none">
                                                <path d="M10 18.5L15 23.5L26 13" stroke="#3B6D11" strokeWidth="2.5"
                                                    strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <h4>Account activated!</h4>
                                        <p className="text-muted">Your account is now active. You can log in and start learning.</p>
                                        <Link to="/login" className="btn btn-primary btn-style mt-3">Go to Login</Link>
                                    </>
                                )}

                                {/* Error + Resend */}
                                {status === "error" && (
                                    <>
                                        <div style={{ ...iconStyle, background: "#FCEBEB", border: "1px solid #F09595" }}>
                                            <svg width="38" height="38" viewBox="0 0 36 36" fill="none">
                                                <line x1="12" y1="12" x2="24" y2="24" stroke="#A32D2D" strokeWidth="2.5" strokeLinecap="round" />
                                                <line x1="24" y1="12" x2="12" y2="24" stroke="#A32D2D" strokeWidth="2.5" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <h4>Activation failed</h4>
                                        <p className="text-muted">This link is invalid or has already been used.</p>

                                        <div style={{ maxWidth: "400px", margin: "20px auto 0", padding: "0 15px" }}>
                                            <p className="text-muted" style={{ fontSize: "16px" }}>
                                                Want to resend? Enter your registered email address
                                            </p> <br />
                                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                <input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px",
                                                        borderRadius: "6px",
                                                        border: "1px solid #ccc"
                                                    }}
                                                />

                                                <button
                                                    onClick={handleResend}
                                                    disabled={resendLoading}
                                                    className="btn btn-primary btn-style"
                                                    style={{ width: "100%", marginTop: "2%" }}
                                                >
                                                    {resendLoading ? "Sending..." : "Resend"}
                                                </button>
                                            </div>
                                        </div>

                                        <br />
                                        <Link to="/signup" className="btn btn-primary btn-style mt-3">Sign Up Again</Link>
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ActivateAccount;