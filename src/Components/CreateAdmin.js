import api from "../api/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CreateAdmin() {
    useEffect(() => {
        document.title = "Create Admin - Study Course";
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

    // ---------------- VALIDATION (UNCHANGED LOGIC) ----------------
    var validateForm = () => {
        const errors = {};

        if (!pname || pname.length < 3) {
            errors.pname = "Name must be at least 3 characters long";
        }

        if (!/^\d{10}$/.test(phone)) {
            errors.phone = "Phone must be a 10-digit number";
        }

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(uname)) {
            errors.email = "Invalid email format";
        }

        if (
            !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}/.test(pass)
        ) {
            errors.password =
                "Password must contain at least 1 uppercase, 1 number, 1 special character, and be at least 6 characters long";
        }

        if (pass !== cpass) {
            errors.passmatch = "Password and confirm password does not match";
        }

        if (terms !== true) {
            errors.terms = "Please accept terms and conditions";
        }

        setverrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ---------------- SUBMIT (CLEANED + SAFE) ----------------
    async function handleRegister(e) {
        e.preventDefault();

        if (!validateForm()) return;

        if (!terms) {
            toast.error("Please accept terms and conditions");
            return;
        }

        setLoading(true);

        try {
            const apidata = { pname, phone, uname, pass };

            const apiresp = await api.post(
                `/api/auth/createadmin`,
                apidata
            );

            if (apiresp?.data?.code === 1) {
                toast.success("Admin created successfully");
                navigate("/adminlayout");
            }
        }
        catch (e) {
            console.error("API Error:", e);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <section className="w3l-loginblock pb-5" id="contact">
                <div className="contacts-9 pb-lg-5 pb-md-4">
                    <div className="container">
                        <div className="top-map">
                            <div className="map-content-9">
                                <h2 className="text-center mb-4" style={{cursor:"context-menu"}}>Create Admin</h2>

                                <form name="form1" onSubmit={handleRegister}>
                                    <div className="form-grid signupgrids">

                                        {/* NAME */}
                                        <div className="input-field">
                                            <label> Name * </label>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                required
                                                minLength="3"
                                                maxLength="50"
                                                pattern="^[a-zA-Z\s]+"
                                                autoComplete="name"
                                                value={pname}
                                                onChange={(e) => {
                                                    setpname(e.target.value);
                                                    if (e.target.value.length >= 3) {
                                                        setverrors((p) => ({ ...p, pname: undefined }));
                                                    }
                                                }}
                                            />
                                            {verrors.pname && (
                                                <span className="text-danger d-block mt-1" style={{color: "red", fontSize: "18px", marginTop: "4px"}}>{verrors.pname}</span>
                                            )}
                                        </div><br/>
                                        

                                        {/* PHONE */}
                                        <div className="input-field">
                                            <label> Phone number </label>
                                            <input
                                                type="tel"
                                                placeholder="Phone number"
                                                required
                                                maxLength="10"
                                                pattern="[0-9]{10}"
                                                value={phone}
                                                onChange={(e) => {
                                                    setphone(e.target.value);
                                                    if (/^\d{10}$/.test(e.target.value)) {
                                                        setverrors((p) => ({ ...p, phone: undefined }));
                                                    }
                                                }}
                                            />
                                            {verrors.phone && (
                                               <span className="text-danger d-block mt-1" style={{color: "red", fontSize: "18px", marginTop: "4px"}}>{verrors.phone}</span>
                                            )}
                                        </div><br/>
                                    

                                        {/* EMAIL */}
                                        <div className="input-field">
                                            <label> Username or Email * </label>
                                            <input
                                                type="email"
                                                placeholder="Username or Email"
                                                required
                                                maxLength="100"
                                                autoComplete="email"
                                                value={uname}
                                                onChange={(e) => {
                                                    setuname(e.target.value);
                                                    if (
                                                        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value)
                                                    ) {
                                                        setverrors((p) => ({ ...p, email: undefined }));
                                                    }
                                                }}
                                            />
                                            {verrors.email && (
                                                <span className="text-danger d-block mt-1" style={{color: "red", fontSize: "18px", marginTop: "4px"}}>{verrors.email}</span>
                                            )}
                                        </div> <br/>

                                        {/* PASSWORD */}
                                        <div className="input-field">
                                            <label>Password *</label>
                                            <div className="password-box">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Password"
                                                    required
                                                    minLength="6"
                                                    maxLength="50"
                                                    value={pass}
                                                    onChange={(e) => {
                                                        setpass(e.target.value);

                                                        if (
                                                            /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}/.test(
                                                                e.target.value
                                                            )
                                                        ) {
                                                            setverrors((p) => ({
                                                                ...p,
                                                                password: undefined,
                                                            }));
                                                        }

                                                        if (e.target.value === cpass) {
                                                            setverrors((p) => ({
                                                                ...p,
                                                                passmatch: undefined,
                                                            }));
                                                        }
                                                    }}
                                                />
                                                <i
                                                    className={
                                                        showPassword
                                                            ? "fa-solid fa-eye-slash toggle-icon-signup"
                                                            : "fa-solid fa-eye toggle-icon-signup"
                                                    }
                                                    onClick={() => setShowPassword(!showPassword)}
                                                ></i>
                                            </div>

                                            {verrors.password && (
                                               <span className="text-danger d-block mt-1" style={{color: "red", fontSize: "18px", marginTop: "4px"}}>
                                                    {verrors.password}
                                                </span>
                                            )}
                                        </div> <br/>

                                        {/* CONFIRM PASSWORD */}
                                        <div className="input-field">
                                            <label>Confirm Password *</label>
                                            <div className="password-box">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirm password"
                                                    required
                                                    minLength="6"
                                                    maxLength="50"
                                                    value={cpass}
                                                    onChange={(e) => {
                                                        setcpass(e.target.value);

                                                        if (e.target.value === pass) {
                                                            setverrors((p) => ({
                                                                ...p,
                                                                passmatch: undefined,
                                                            }));
                                                        }
                                                    }}
                                                />
                                                <i
                                                    className={
                                                        showConfirmPassword
                                                            ? "fa-solid fa-eye-slash toggle-icon-signup"
                                                            : "fa-solid fa-eye toggle-icon-signup"
                                                    }
                                                    onClick={() =>
                                                        setShowConfirmPassword(!showConfirmPassword)
                                                    }
                                                ></i>
                                            </div>

                                            {verrors.passmatch && (
                                                <span className="text-danger d-block mt-1" style={{color: "red", fontSize: "18px", marginTop: "4px"}}>
                                                    {verrors.passmatch}
                                                </span>
                                            )}
                                        </div> <br/>
                                    </div> 

                                    {/* TERMS */}
                                    <div className="check">
                                        <label className="checkbox" style={{ marginTop: "2%" }}>
                                            <input
                                                type="checkbox"
                                                required
                                                onChange={(e) => {
                                                    setterms(e.target.checked);
                                                    if (e.target.checked) {
                                                        setverrors((p) => ({
                                                            ...p,
                                                            terms: undefined,
                                                        }));
                                                    }
                                                }}
                                            />
                                            <i></i> I accept the terms and conditions
                                        </label>

                                        {verrors.terms && (
                                            <span className="text-danger d-block mt-1" style={{color: "red", fontSize: "18px", marginTop: "4px"}}>
                                                {verrors.terms}
                                            </span>
                                        )}
                                          
                                    </div> 

                                      <button
                                            type="submit"
                                            className="btn btn-primary btn-style create-admin-btn"
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
                                                    Creating Admin...
                                                </>
                                            ) : (
                                                "Create Admin"
                                            )}
                                        </button>

                                    <br />
                                    <br />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default CreateAdmin;