import api from "../api/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../reducers/userReducer";
import { useDispatch } from "react-redux";

function STUChangePassword() {
    useEffect(() => {
        document.title = "Change Password - Study Course";
    }, []);

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

    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}/;

    const validateForm = () => {
        const errors = {};
        if (!currpass || currpass.trim() === "") errors.currpass = "Current password is required";
        if (!newpass || newpass.trim() === "") {
            errors.newpass = "New password is required";
        } else if (!passwordRegex.test(newpass)) {
            errors.newpass = "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 6 characters long";
        }
        if (!cnewpass || cnewpass.trim() === "") {
            errors.cnewpass = "Please confirm your new password";
        } else if (newpass !== cnewpass) {
            errors.cnewpass = "Passwords do not match";
        }
        setverrors(errors);
        return Object.keys(errors).length === 0;
    };

    async function handlesubmit(e) {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const apiresp = await api.post(`/api/auth/changepassword`, {
                oldpass: currpass,  //  oldpass
                newpass             //  newpass
            });
            if (apiresp?.data?.code === 1) {
                toast.success("Password changed successfully");
                dispatch(logout());  
                sessionStorage.clear();
                localStorage.clear();
                navigate("/login");
            } else if (apiresp?.data?.code === -1) {
                setverrors({ currpass: "Current password is incorrect" });
            } else {
                toast.error("Error while changing password");
            }
        } catch (e) {
            toast.error(e.customMessage || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    const inputWrapperStyle = {
        position: "relative",
        width: "100%",
    };

    const inputStyle = {
        width: "100%",
        padding: "12px 44px 12px 14px",
        borderRadius: 10,
        border: "1px solid var(--card-border, #e0e0e0)",
        background: "var(--input-bg, #f7f7f7)",
        fontSize: 14,
        color: "var(--text-primary, #222)",
        outline: "none",
        boxSizing: "border-box",
    };

    const eyeStyle = {
        position: "absolute",
        right: 14,
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#888",
        fontSize: 15,
    };

    const labelStyle = {
        display: "block",
        marginBottom: 7,
        fontSize: 13,
        fontWeight: 600,
        color: "var(--text-secondary, #555)",
    };

    const fieldStyle = {
        marginBottom: 18,
    };

    return (
        <div style={{
            background: "var(--card-bg, #fff)",
            border: "1px solid var(--card-border, #e8e8e8)",
            borderRadius: 16,
            padding: "28px 24px",
            marginTop: 8,
        }}>
            <h5 style={{ marginBottom: 22, fontWeight: 600, fontSize: 16 }}>🔒 Change Password</h5>

            <form onSubmit={handlesubmit}>

                {/* Current Password */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>Current Password *</label>
                    <div style={inputWrapperStyle}>
                        <input
                            type={showCurr ? "text" : "password"}
                            placeholder="Enter current password"
                            value={currpass}
                            style={inputStyle}
                            onChange={(e) => {
                                setcurrpass(e.target.value);
                                if (e.target.value.trim() !== "")
                                    setverrors(old => ({ ...old, currpass: undefined }));
                            }}
                        />
                        <i
                            className={`fa ${showCurr ? "fa-eye-slash" : "fa-eye"}`}
                            style={eyeStyle}
                            onClick={() => setShowCurr(!showCurr)}
                        />
                    </div>
                    {verrors.currpass && <span className="text-danger" style={{ fontSize: 12 }}>{verrors.currpass}</span>}
                </div>

                {/* New Password */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>New Password *</label>
                    <div style={inputWrapperStyle}>
                        <input
                            type={showNew ? "text" : "password"}
                            placeholder="Enter new password"
                            value={newpass}
                            style={inputStyle}
                            onChange={(e) => {
                                setnewpass(e.target.value);
                                if (passwordRegex.test(e.target.value))
                                    setverrors(old => ({ ...old, newpass: undefined }));
                                if (e.target.value === cnewpass)
                                    setverrors(old => ({ ...old, cnewpass: undefined }));
                            }}
                        />
                        <i
                            className={`fa ${showNew ? "fa-eye-slash" : "fa-eye"}`}
                            style={eyeStyle}
                            onClick={() => setShowNew(!showNew)}
                        />
                    </div>
                    {verrors.newpass && <span className="text-danger" style={{ fontSize: 12 }}>{verrors.newpass}</span>}
                </div>

                {/* Confirm New Password */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>Confirm New Password *</label>
                    <div style={inputWrapperStyle}>
                        <input
                            type={showCNew ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={cnewpass}
                            style={inputStyle}
                            onChange={(e) => {
                                setcnewpass(e.target.value);
                                if (e.target.value === newpass)
                                    setverrors(old => ({ ...old, cnewpass: undefined }));
                            }}
                        />
                        <i
                            className={`fa ${showCNew ? "fa-eye-slash" : "fa-eye"}`}
                            style={eyeStyle}
                            onClick={() => setShowCNew(!showCNew)}
                        />
                    </div>
                    {verrors.cnewpass && <span className="text-danger" style={{ fontSize: 12 }}>{verrors.cnewpass}</span>}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-style"
                    disabled={loading}
                    style={{ width: "100%", padding: "12px 0", borderRadius: 10, fontSize: 15 }}
                >
                    {loading ? (
                        <>
                            <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                                style={{ marginRight: 6 }}
                            />
                            Changing password...
                        </>
                    ) : "Change Password"}
                </button>

            </form>
        </div>
    );
}

export default STUChangePassword;