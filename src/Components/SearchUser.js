import api from "../api/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function SearchUser() {

    useEffect(() => {
        document.title = "Search User - Study Course";
    }, []);

    const [uname, setuname] = useState("");
    const [uinfo, setuinfo] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handlesubmit(e) {
        e.preventDefault();

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
            const apiresp = await api.get(`/api/auth/searchuser/${uname}`);
            if (apiresp.data.code === 1) {
                setuinfo(apiresp.data.udata);
            } else {
                toast.error("User not found");
                setuinfo({});
            }
        } catch (e) {
            const msg =
                e?.response?.data?.message || e?.message || "Something went wrong";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    // Avatar initials — pehle 2 words ke first letters
    const getInitials = (name) =>
        name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    return (
        <section className="searchusermaindiv" id="contact">
            <div className="searchuserseconddiv">

                <h2 className="searchuser-heading">Search User</h2>

                <form name="form1" onSubmit={handlesubmit}>

                    {/* Input */}
                    <div className="searchuser-inputwrap">
                        <label className="searchuser-label" htmlFor="email">
                            Username or Email
                        </label>
                        <input
                            className="searchuser-input"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter email address"
                            value={uname}
                            onChange={(e) => {
                                setuname(e.target.value);
                                setError("");
                            }}
                        />
                        {error && (
                            <p className="searchuser-error">{error}</p>
                        )}
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="searchuser-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Searching...
                            </>
                        ) : (
                            "Search User"
                        )}
                    </button>

                </form>

                {/* ── Result Card ── */}
                {uinfo.name && (
                    <div className="searchuser-resultcard">

                        {/* Header: avatar + name + badge */}
                        <div className="searchuser-cardheader">
                            <div className="searchuser-avatar">
                                {getInitials(uinfo.name)}
                            </div>
                            <div className="searchuser-nameblock">
                                <p className="searchuser-name">{uinfo.name}</p>
                                <p className="searchuser-email">{uname}</p>
                            </div>
                            <span className="searchuser-badge">Active</span>
                        </div>

                        <hr className="searchuser-divider" />

                        {/* Info grid */}
                        <div className="searchuser-infogrid">
                            <div className="searchuser-infoitem">
                                <p className="searchuser-infolabel">Phone</p>
                                <p className="searchuser-infovalue">{uinfo.phone || "—"}</p>
                            </div>
                            {/* Agar aur fields hain jaise role, joinDate etc. toh yahan add karo */}
                            {/* Example:*/}
                            <div className="searchuser-infoitem">
                                <p className="searchuser-infolabel">Role</p>
                                <p className="searchuser-infovalue">{uinfo.usertype || "—"}</p>
                            </div>
                            
                        </div>

                    </div>
                )}

            </div>
        </section>
    );
}

export default SearchUser;