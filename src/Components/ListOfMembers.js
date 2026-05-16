import api from "../api/api";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function getInitials(name) {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
}

function ListOfMembers() {

    useEffect(() => {
        document.title = "List of Members - Study Course";
    }, []);

    const [uinfo, setuinfo] = useState([]);
    const navigate = useNavigate();

    const getallmembs = useCallback(async () => {
        try {
            const apiresp = await api.get(`/api/auth/allusers`);
            if (apiresp?.data?.code === 1) {
                setuinfo(apiresp.data.udata || []);
            } else {
                setuinfo([]);
            }
        } catch (e) {
            console.error(e);
            toast.error(e?.response?.data?.message || e?.message || "Server not responding");
        }
    }, []);

    useEffect(() => { getallmembs(); }, [getallmembs]);

    async function delmemb(membid) {
        if (!membid) return;
        if (!window.confirm("Are you sure to delete?")) return;
        try {
            const apiresp = await api.delete(`/api/auth/deletemember`, { data: { mid: membid } });
            if (apiresp?.data?.success === true) {
                toast.success("User deleted successfully");
                getallmembs();
            } else {
                toast.error(apiresp?.data?.msg || "User not deleted");
            }
        } catch (e) {
            console.error(e);
            toast.error(e?.response?.data?.message || e?.message || "Server not responding");
        }
    }

    return (
        <section className="mem-section">
            <div className="mem-inner">
                {uinfo.length > 0 ? (
                    <div className="mem-card">
                        <div className="table-responsive">
                            <div className="mem-table-wrapper">
                                <table className="mem-table" style={{ marginTop: "2%" }}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Phone</th>
                                            <th>Username</th>
                                            <th>Role</th>
                                            <th>Delete</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {uinfo.map((data, i) => (
                                            <tr key={data._id || i}>
                                                <td>
                                                    <div className="mem-name-cell">
                                                        <div className="mem-avatar">{getInitials(data.name)}</div>
                                                        <span>{data.name}</span>
                                                    </div>
                                                </td>
                                                <td className="mem-phone">{data.phone}</td>
                                                <td className="mem-email">{data.username}</td>
                                                <td>
                                                    <span className={`mem-role-badge ${data.usertype === "admin" ? "mem-role-admin" : "mem-role-user"}`}>
                                                        {data.usertype}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="mem-del-btn" onClick={() => delmemb(data._id)}>
                                                        Delete
                                                    </button>
                                                </td>
                                                <td>
                                                    {data.usertype === "user" && (
                                                        <button onClick={() => navigate(`/adminlayout/studentdetail/${data.username}`)} className="mem-btn-view">
                                                            View
                                                        </button>
                                                    )}
                                                </td>
                                                
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="mem-header">
                                    <span className="mem-count-badge">{uinfo.length} members</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mem-card mem-empty">
                        No members found
                    </div>
                )}

            </div>
        </section>
    );
}

export default ListOfMembers;