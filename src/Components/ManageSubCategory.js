import api from "../api/api";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useFetchCategories from "../hooks/useFetchCategories";

function ManageSubCategory() {

    useEffect(() => {
        document.title = "Manage Sub Category - Study Course";
    }, []);

    const [scname, setscname] = useState("");
    const [picfile, setpicfile] = useState(null);
    const { allcat, fetchCategories } = useFetchCategories();
    const [subcatdata, setsubcatdata] = useState([]);
    const [picname, setpicname] = useState();
    const [editmode, seteditmode] = useState(false);
    const fileref = useRef(null);
    const [catid, setcatid] = useState(null);
    const [scatid, setscatid] = useState();
    const [loading, setLoading] = useState(false);

    const [catidError, setcatidError] = useState("");
    const [scnameError, setscnameError] = useState("");

    async function handlesubmit(e) {
        e.preventDefault();

        if (!catid || catid === "") {
            setcatidError("Please Choose Category");
            return;
        } else {
            setcatidError("");
        }

        if (!scname || scname.trim() === "") {
            setscnameError("Sub category name required");
            return;
        } else {
            setscnameError("");
        }

        setLoading(true);

        if (editmode === true) {
            try {
                const formData = new FormData();
                formData.append("subcatname", scname);
                if (picfile !== null) formData.append("pic", picfile);
                formData.append("oldpicname", picname);
                formData.append("catid", catid);
                formData.append("scid", scatid);

                const apiresp = await api.put(`/api/subcategory/update`, formData)

                if (apiresp?.data?.code === 1) {
                    toast.success("Sub Category updated successfully");
                    fetchsubcatbycat?.();
                    seteditmode(false);
                    handlecancel();
                } else {
                    toast.error("Sub Category not updated");
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
                formData.append("catid", catid);
                formData.append("subcatname", scname);
                if (picfile !== null) formData.append("pic", picfile);

                const apiresp = await api.post(`/api/subcategory/add`, formData)

                if (apiresp?.data?.code === 1) {
                    toast.success("Sub Category added successfully");
                    fetchsubcatbycat?.();
                    handlecancel();
                } else {
                    toast.error("Sub Category not added");
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

    function updateSubCategory(scdata) {
        seteditmode(true);
        setscname(scdata?.subcatname);
        setpicname(scdata?.picname);
        setscatid(scdata?._id);
    }

    async function delsubcategories(id) {
        const uchoice = window.confirm("Are you sure to delete?");
        if (uchoice === true) {
            try {
                const apiresp = await api.delete(`/api/subcategory/delete`, { data: { scid: id } })

                if (apiresp?.data?.success === true) {
                    toast.success("Sub Category deleted successfully");
                    fetchsubcatbycat?.();
                } else {
                    toast.error("Sub Category not deleted");
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
    setscname("");
    setpicname("");
    setscatid("");
    setpicfile(null);

    // Sirf yeh 2 defined hain
    setcatidError("");
    setscnameError("");

    if (fileref.current) {
        fileref.current.value = "";
    }
}
    async function fetchsubcatbycat() {
        try {
            const apiresp = await api.get(`/api/subcategory/bycat?cid=${catid}`)

            if (apiresp?.data?.code === 1) {
                setsubcatdata(apiresp.data.scdata);
            } else {
                toast.info("No sub categories found");
                setsubcatdata([]);
            }
        } catch (e) {
            const msg =
                e?.response?.data?.message ||
                e?.message ||
                "Something went wrong";

            toast.error(msg);
        }
    }

    useEffect(() => {
        if (catid !== null) {
            fetchsubcatbycat();
        }
    }, [catid]);

    return (
        <>
            {/* UI SAME — NO CHANGE */}
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

                                                <select
                                                    className="form-control"
                                                    value={catid || ""}
                                                    onChange={(e) => {
                                                        setcatid(e.target.value);
                                                        if (e.target.value !== "") setcatidError("");
                                                    }}
                                                    style={{ borderColor: catidError ? "red" : "" }}
                                                >
                                                    <option value="">Choose Category</option>
                                                    {allcat?.map((data, i) => (
                                                        <option value={data._id} key={i}>
                                                            {data.catname}
                                                        </option>
                                                    ))}
                                                </select>

                                                {catidError && (
                                                    <p style={{ color: "red", fontSize: "18px", margin: "4px 0 0" }}>
                                                        {catidError}
                                                    </p>
                                                )}

                                                <br /><br />

                                                <input
                                                    type="text"
                                                    value={scname}
                                                    name="scname"
                                                    placeholder="Sub Category Name"
                                                    minLength="3"
                                                    maxLength="50"
                                                    pattern="^[A-Za-z ]+$"
                                                    title="Sub category name should be 3-50 characters long and contain only letters"
                                                    onChange={(e) => {
                                                        setscname(e.target.value);
                                                        if (e.target.value.trim() !== "") setscnameError("");
                                                    }}
                                                    style={{ borderColor: scnameError ? "red" : "" }}
                                                />

                                                {scnameError && (
                                                    <p style={{ color: "red", fontSize: "18px", margin: "4px 0 0" }}>
                                                        {scnameError}
                                                    </p>
                                                )}

                                                <br /><br />

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileref}
                                                    name="cpic"
                                                    onChange={(e) => setpicfile(e.target.files?.[0])}
                                                />

                                                {editmode && (
                                                    <>
                                                        <br /><br />
                                                        <img
                                                            src={`${process.env.REACT_APP_APIURL}/uploads/${picname}`}
                                                            height="150"
                                                            alt="capic"
                                                        />
                                                        <br />Choose new image, if required
                                                    </>
                                                )}

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
                                                        editmode ? "Update Sub Category" : "Add Sub Category"
                                                    )}
                                                </button>

                                                <br /><br />

                                                {editmode && (
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
                                                )}

                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <br />

                                {subcatdata?.length > 0 ? (
                                    <>
                                        <h2 className="text-center categoryh2">List of Sub Categories</h2>

                                        <div className="table-responsive" style={{marginTop:"2%"}}>
                                          <table className="mem-table">
    <thead>
        <tr>
            <th>Picture</th>
            <th>Sub Category Name</th>
            <th>Update</th>
            <th>Delete</th>
        </tr>
    </thead>

    <tbody>
        {subcatdata.map((data, i) => (
            <tr key={data._id || i}>
                
                <td>
                    <div className="mem-name-cell">
                        <img
                            src={`${process.env.REACT_APP_APIURL}/uploads/${data.picname}`}
                            alt="SubcatPic"
                            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                        />
                    </div>
                </td>

                <td>
                    <span>{data.subcatname}</span>
                </td>

                <td>
                    <button
                        className="mem-update-btn"
                        onClick={() => updateSubCategory(data)}
                    >
                        Update
                    </button>
                </td>

                <td>
                    <button
                        className="mem-del-btn"
                        onClick={() => delsubcategories(data._id)}
                    >
                        Delete
                    </button>
                </td>
            </tr>
        ))}

        <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>
                {subcatdata.length} sub category found
            </td>
        </tr>
    </tbody>
</table>
                                        </div>
                                    </>
                                ) : (
                                    <h2 className="categoryh2">No sub categories found</h2>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ManageSubCategory;