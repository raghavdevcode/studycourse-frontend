import api from "../api/api";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useFetchCategories from "../hooks/useFetchCategories";

function ManageCategory() {

    useEffect(() => {
        document.title = "Manage Category - Study Course";
    }, []);

    const [cname, setcname] = useState("");
    const [picfile, setpicfile] = useState(null);
    const { allcat, fetchCategories } = useFetchCategories();
    const [picname, setpicname] = useState();
    const [editmode, seteditmode] = useState(false);
    const fileref = useRef(null);
    const [catid, setcatid] = useState();
    const [loading, setLoading] = useState(false);

    async function handlesubmit(e) {
        e.preventDefault();

        if (!cname) {
            toast.info("Category name required");
            return;
        }

        setLoading(true);

        if (editmode === true) {
            try {
                const formData = new FormData();
                formData.append("catname", cname);
                if (picfile !== null) formData.append("pic", picfile);
                formData.append("oldpicname", picname);
                formData.append("cid", catid);

                const apiresp = await api.put(`/api/category/update`, formData);

                if (apiresp?.data?.code === 1) {
                    toast.success("Category updated successfully");
                    fetchCategories?.();
                    seteditmode(false);
                    handlecancel();
                } else {
                    toast.error("Category not updated");
                }
            } catch (e) {
                const msg =
                    e?.response?.data?.message ||
                    e?.message ||
                    "Something went wrong";

                toast.error(msg);
            } finally {
                setLoading(false);
            }

        } else {
            try {
                const formData = new FormData();
                formData.append("catname", cname);
                if (picfile !== null) formData.append("pic", picfile);

                const apiresp = await api.post("/api/category/add", formData)

                if (apiresp?.data?.code === 1) {
                    toast.success("Category added successfully");
                    fetchCategories?.();
                    handlecancel();
                } else {
                    toast.error("Category not added");
                }
            } catch (e) {
                const msg =
                    e?.response?.data?.message ||
                    e?.message ||
                    "Something went wrong";

                toast.error(msg);
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        fetchCategories?.();
    }, []);

    function updateCategory(cdata) {
        seteditmode(true);
        setcname(cdata?.catname);
        setpicname(cdata?.picname);
        setcatid(cdata?._id);
    }

    async function delcategories(catid) {
        const uchoice = window.confirm("Are you sure to delete?");
        if (uchoice === true) {
            try {
                const apiresp = await api.delete(`/api/category/delete`, { data: { cid: catid } })

                if (apiresp?.data?.success === true) {
                    toast.success("Category deleted successfully");
                    fetchCategories?.();
                } else {
                    toast.error("Category not deleted");
                }
            } catch (e) {
                const msg =
                    e?.response?.data?.message ||
                    e?.message ||
                    "Something went wrong";

                toast.error(msg);
            }
        }
    }

    function handlecancel() {
        seteditmode(false);
        setcname("");
        setcatid("");
        setpicfile(null);

        if (fileref.current) {
            fileref.current.value = "";
        }
    }

    return (
        <>
            <section className="w3l-loginblock pb-5" id="contact">
                <div className="contacts-9 pb-lg-5 pb-md-4">
                    <div className="container">
                        <div className="top-map">
                            <div className="row map-content-9">
                                <div className="col-lg-6 pr-lg-5">

                                    <form name="form1" onSubmit={handlesubmit}>
                                        <div className="form-grid">
                                            <div className="input-field">
                                                <br /><br />

                                                <input
                                                    type="text"
                                                    value={cname}
                                                    name="cname"
                                                    placeholder="Category Name"
                                                    minLength="3"
                                                    maxLength="50"
                                                    pattern="^[A-Za-z ]+$"
                                                    title="Category name should be 3-50 characters long and contain only letters"
                                                    onChange={(e) => setcname(e.target.value)}
                                                />

                                                <br /><br />

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileref}
                                                    name="cpic"
                                                    onChange={(e) => setpicfile(e.target.files?.[0])}
                                                />

                                                {editmode &&
                                                    <>
                                                        <br /><br />
                                                        <img
                                                            src={`${process.env.REACT_APP_APIURL}/uploads/${picname}`}
                                                            height="150"
                                                            alt="capic"
                                                        />
                                                        <br />Choose new image, if required
                                                    </>
                                                }

                                                <br /><br />

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
                                                            {editmode ? "Updating..." : "Adding..."}
                                                        </>
                                                    ) : (
                                                        editmode ? "Update Category" : "Add Category"
                                                    )}
                                                </button>

                                                <br /><br />

                                                {editmode &&
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary btn-style login-btn search-btn"
                                                            onClick={handlecancel}
                                                            disabled={loading}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <br /><br />
                                                    </>
                                                }

                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <br />

                                {allcat?.length > 0 ? (
                                    <>
                                        <h2 className="text-center categoryh2">List of Categories</h2>

                                        <div className="table-responsive" style={{marginTop:"2%"}}>
                                            <table className="mem-table">
                                                <thead>
                                                    <tr>
                                                        <th>Picture</th>
                                                        <th>Category Name</th>
                                                        <th>Update</th>
                                                        <th>Delete</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {allcat.map((data, i) => (
                                                        <tr key={data._id || i}>

                                                            <td>
                                                                <div className="mem-name-cell">
                                                                    <img
                                                                        src={`${process.env.REACT_APP_APIURL}/uploads/${data.picname}`}
                                                                        alt="catpic"
                                                                        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                                                                    />
                                                                </div>
                                                            </td>

                                                            <td>
                                                                <span>{data.catname}</span>
                                                            </td>

                                                            <td>
                                                                <button
                                                                    className="mem-update-btn"  // same button style use
                                                                    onClick={() => updateCategory(data)}
                                                                >
                                                                    Update
                                                                </button>
                                                            </td>

                                                            <td>
                                                                <button
                                                                    className="mem-del-btn"
                                                                    onClick={() => delcategories(data._id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                    <tr>
                                                        <td colSpan="4" style={{ textAlign: "center" }}>
                                                            {allcat.length} category found
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                ) : (
                                    <h2>No categories found</h2>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ManageCategory;