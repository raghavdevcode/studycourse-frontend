import { useState, useEffect, useRef } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import useFetchCategories from "../hooks/useFetchCategories";


function ManageLesson() {

    const { allcat, fetchCategories } = useFetchCategories();
    const [subcats, setsubcats] = useState([]);
    const [lessondata, setlessondata] = useState([]);
    const [catid, setcatid] = useState("");
    const [subcatid, setsubcatid] = useState("");
    const fileref = useRef();

    const [title, settitle] = useState("");
    const [description, setdescription] = useState("");
    const [thumbnail, setthumbnail] = useState(null);
    const [youtubeUrl, setyoutubeUrl] = useState("");
    const [duration, setduration] = useState("");
    const [order, setorder] = useState("");

    const [editmode, seteditmode] = useState(false);
    const [lessonid, setlessonid] = useState("");
    const [oldthumbnail, setoldthumbnail] = useState("");
    const [loading, setLoading] = useState(false);

    const [catidError, setcatidError] = useState("");
    const [subcatidError, setsubcatidError] = useState("");
    const [titleError, settitleError] = useState("");
    const [descriptionError, setdescriptionError] = useState("");
    const [youtubeUrlError, setyoutubeUrlError] = useState("");
    const [durationError, setdurationError] = useState("");
    const [orderError, setorderError] = useState("");

    async function fetchsubcats(cid) {
        setcatid(cid);
        setsubcats([]);
        setlessondata([]);
        setsubcatid("");

        if (cid !== "") setcatidError("");

        try {
            const res = await api.get(`/api/subcategory/bycat?cid=${cid}`);
            if (res?.data?.code === 1) setsubcats(res.data.scdata);
        } catch (e) {
            const msg =
                e?.response?.data?.message ||
                e?.message ||
                "Something went wrong";

            toast.error(msg);
        }
    }

    async function fetchLessons(scid) {
        setsubcatid(scid);

        if (scid !== "") setsubcatidError("");

        try {
            const res = await api.get(`/api/lesson/get/${scid}`)
            if (res?.data?.code === 1) {
                setlessondata(res.data.lessondata);
            } else {
                setlessondata([]);
            }
        } catch (e) {
            const msg =
                e?.response?.data?.message ||
                e?.message ||
                "Something went wrong";

            toast.error(msg);
        }
    }

    function validate() {
        let isValid = true;

        if (!editmode) {
            if (!catid || catid === "") {
                setcatidError("Please choose a Category");
                isValid = false;
            } else setcatidError("");

            if (!subcatid || subcatid === "") {
                setsubcatidError("Please choose a Course");
                isValid = false;
            } else setsubcatidError("");
        }

        if (!title || title.trim() === "") {
            settitleError("Title required");
            isValid = false;
        } else settitleError("");

        if (!description || description.trim() === "") {
            setdescriptionError("Description required");
            isValid = false;
        } else setdescriptionError("");

        if (!youtubeUrl || youtubeUrl.trim() === "") {
            setyoutubeUrlError("YouTube URL required");
            isValid = false;
        } else setyoutubeUrlError("");

        if (!duration || duration.trim() === "") {
            setdurationError("Duration required");
            isValid = false;
        } else setdurationError("");

        if (!order || order === "") {
            setorderError("Order required");
            isValid = false;
        } else setorderError("");

        return isValid;
    }

    async function handlesubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        if (editmode === true) {
            try {
                const formData = new FormData();
                formData.append("lid", lessonid);
                formData.append("title", title);
                formData.append("description", description);
                formData.append("youtubeUrl", youtubeUrl);
                formData.append("duration", duration);
                formData.append("order", order);
                formData.append("oldthumbnail", oldthumbnail);

                if (thumbnail !== null) formData.append("thumbnail", thumbnail);

                const res = await api.put(`/api/lesson/update`, formData)

                if (res?.data?.code === 1) {
                    toast.success("Lesson Updated Successfully");
                    fetchLessons(subcatid);
                    seteditmode(false);
                    handlecancel();
                } else {
                    toast.error("Lesson not Updated");
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
                formData.append("subcatid", subcatid);
                formData.append("title", title);
                formData.append("description", description);
                formData.append("youtubeUrl", youtubeUrl);
                formData.append("duration", duration);
                formData.append("order", order);

                if (thumbnail !== null) formData.append("thumbnail", thumbnail);

                const res = await api.post(`/api/lesson/add`, formData)

                if (res?.data?.code === 1) {
                    toast.success("Lesson Added Successfully");
                    fetchLessons(subcatid);
                    handlecancel();
                } else {
                    toast.error("Lesson not Added");
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

    function updateLesson(ldata) {
        seteditmode(true);
        setlessonid(ldata._id);
        settitle(ldata.title);
        setdescription(ldata.description);
        setyoutubeUrl(ldata.youtubeUrl);
        setduration(ldata.duration);
        setorder(ldata.order);
        setoldthumbnail(ldata.thumbnail);
        setthumbnail(null);

        settitleError("");
        setdescriptionError("");
        setyoutubeUrlError("");
        setdurationError("");
        setorderError("");

        if (fileref.current) fileref.current.value = "";
    }

 function handlecancel() {
    seteditmode(false);
    setlessonid("");
    settitle("");
    setdescription("");
    setyoutubeUrl("");
    setduration("");
    setorder("");
    setoldthumbnail("");
    setthumbnail(null);

    // Errors clear
    setcatidError("");
    setsubcatidError("");
    settitleError("");
    setdescriptionError("");
    setyoutubeUrlError("");
    setdurationError("");
    setorderError("");

    if (fileref.current) fileref.current.value = "";
}

    async function handleDelete(lid) {
        if (!window.confirm("Are you sure to Delete this lesson?")) return;

        try {
            const res = await api.delete(`/api/lesson/delete/${lid}`)
            if (res?.data?.success) {
                toast.success("Lesson Deleted");
                fetchLessons(subcatid);
            } else {
                toast.error("Lesson not Deleted");
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
        fetchCategories();
    }, []);


    return (
        <>
            <section className="w3l-loginblock pb-5" id="contact">
                <div className="contacts-9 pb-lg-5 pb-md-4">
                    <div className="container">
                        <div className="top-map">
                            <div className="row map-content-9">
                                <div className="col-lg-6 pr-lg-5">
                                    <h2 className="categoryh2">Manage Lesson</h2><br />
                                    <form onSubmit={handlesubmit}>

                                        {!editmode && (
                                            <>
                                                <select
                                                    className="form-control"
                                                    value={catid}
                                                    onChange={(e) => fetchsubcats(e.target.value)}
                                                    style={{ borderColor: catidError ? "red" : "" }}
                                                >
                                                    <option value="">Choose Category</option>
                                                    {allcat.map(data => (
                                                        <option key={data._id} value={data._id}>{data.catname}</option>
                                                    ))}
                                                </select>
                                                {catidError && <p style={{ color: "red", fontSize: "18px", margin: "4px 0 0" }}>{catidError}</p>}
                                                <br /><br />

                                                <select
                                                    className="form-control"
                                                    value={subcatid}
                                                    onChange={(e) => fetchLessons(e.target.value)}
                                                    style={{ borderColor: subcatidError ? "red" : "" }}
                                                >
                                                    <option value="">Choose Course</option>
                                                    {subcats.map(data => (
                                                        <option key={data._id} value={data._id}>{data.subcatname}</option>
                                                    ))}
                                                </select>
                                                {subcatidError && <p style={{ color: "red", fontSize: "18px", margin: "4px 0 0" }}>{subcatidError}</p>}
                                                <br /><br />
                                            </>
                                        )}

                                        {/* Title */}
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            value={title}
                                            minLength="5"
                                            maxLength="100"
                                            pattern="^[A-Za-z0-9 ]+$"
                                            title="Title should be 5-100 characters (letters and numbers only)"
                                            onChange={(e) => { settitle(e.target.value); if (e.target.value.trim()) settitleError(""); }}
                                            style={{ borderColor: titleError ? "red" : "" }}
                                        />
                                        {titleError && <p style={{ color: "red", fontSize: "18px", margin: "4px 0 0" }}>{titleError}</p>}
                                        <br /><br />

                                        {/* Description */}
                                        <textarea
                                            placeholder="Description"
                                            value={description}
                                            minLength="10"
                                            maxLength="500"
                                            title="Description must be at least 10 characters"
                                            onChange={(e) => { setdescription(e.target.value); if (e.target.value.trim()) setdescriptionError(""); }}
                                            style={{ borderColor: descriptionError ? "red" : "" }}
                                        />
                                        {descriptionError && <p style={{ color: "red", fontSize: "18px", margin: "4px 0 0" }}>{descriptionError}</p>}
                                        <br /><br />

                                        {/* Thumbnail */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileref}
                                            onChange={(e) => setthumbnail(e.target.files[0])}
                                        />
                                        {editmode && (
                                            <>
                                                <br /><br />
                                                <img src={`${process.env.REACT_APP_APIURL}/uploads/${oldthumbnail}`} height="100" alt="lesson thumbnail" />
                                                <br />Choose new image, if required
                                            </>
                                        )}
                                        <br /><br />

                                        {/* YouTube URL */}
                                        <input
                                            type="text"
                                            placeholder="YouTube URL"
                                            value={youtubeUrl}
                                            onChange={(e) => { setyoutubeUrl(e.target.value); if (e.target.value.trim()) setyoutubeUrlError(""); }}
                                            style={{ borderColor: youtubeUrlError ? "red" : "" }}
                                        />
                                        {youtubeUrlError && <p style={{ color: "red", fontSize: "18px", margin: "4px 0 0" }}>{youtubeUrlError}</p>}
                                        <br /><br />

                                        {/* Duration */}
                                        <input
                                            type="text"
                                            placeholder="Duration (e.g. 10:30)"
                                            value={duration}
                                            onChange={(e) => { setduration(e.target.value); if (e.target.value.trim()) setdurationError(""); }}
                                            style={{ borderColor: durationError ? "red" : "" }}
                                        />
                                        {durationError && <p style={{ color: "red", fontSize: "18px", margin: "4px 0 0" }}>{durationError}</p>}
                                        <br /><br />

                                        {/* Order */}
                                        <input
                                            type="number"
                                            placeholder="Order"
                                            value={order}
                                            onChange={(e) => { setorder(e.target.value); if (e.target.value) setorderError(""); }}
                                            style={{ borderColor: orderError ? "red" : "" }}
                                        />
                                        {orderError && <p style={{ color: "red", fontSize: "18px", margin: "4px 0 0" }}>{orderError}</p>}
                                        <br /><br />

                                        {/* Submit Button with Spinner */}
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
                                                    {editmode ? "Updating..." : "Saving..."}
                                                </>
                                            ) : (
                                                editmode ? "Update Lesson" : "Save Lesson"
                                            )}
                                        </button>
                                        &nbsp;&nbsp;

                                        {editmode && (
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-style login-btn"
                                                onClick={handlecancel}
                                                disabled={loading}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <br /><br />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lessons Table */}
            <div className="container">
                {subcatid !== "" &&
                    <div className="table-responsive mt-4">
                    <table className="mem-table" style={{marginTop:"2%"}}>
    <thead>
        <tr>
            <th>#</th>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Duration</th>
            <th>Order</th>
            <th>Update</th>
            <th>Delete</th>
        </tr>
    </thead>

    <tbody>
        {lessondata.length > 0 ? (
            lessondata.map((lesson, i) => (
                <tr key={lesson._id || i}>
                    
                    <td>{i + 1}</td>

                    <td>
                        <div className="mem-name-cell">
                            <img
                                src={`${process.env.REACT_APP_APIURL}/uploads/${lesson.thumbnail}`}
                                alt="thumbnail"
                                style={{ width: "40px", height: "40px", borderRadius: "8px" }}
                            />
                        </div>
                    </td>

                    <td>{lesson.title}</td>

                    <td className="mem-phone">{lesson.duration}</td>

                    <td>{lesson.order}</td>

                    <td>
                        <button
                            className="mem-update-btn"
                            onClick={() => updateLesson(lesson)}
                        >
                            Update
                        </button>
                    </td>

                    <td>
                        <button
                            className="mem-del-btn"
                            onClick={() => handleDelete(lesson._id)}
                        >
                            Delete
                        </button>
                    </td>

                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                    No Lessons Found
                </td>
            </tr>
        )}
    </tbody>
</table>
                    </div>
                }
            </div>
        </>
    );
}

export default ManageLesson;