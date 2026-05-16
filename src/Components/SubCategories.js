import api from "../api/api";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";  // useSearchParams add karo
import { toast } from "react-toastify";
import ErrorPage from "./ErrorPage";

const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

function SubCategories({ catId, onBack, onSubCatClick }) {
    const [params] = useSearchParams();
    // Props pehle, fallback URL params 
    const catid = catId || params.get("cid");

    const [subcatdata, setsubcatdata] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    async function fetchsubcatbycat() {
        try {
            const apiresp = await api.get(`/api/subcategory/bycat?cid=${catid}`);
            if (apiresp.data.code === 1) {
                setsubcatdata(apiresp.data.scdata);
            } else {
                setNotFound(true);
            }
        } catch (e) {
            toast.error(e.customMessage || "Error Occured");
            setNotFound(true);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        document.title = "Sub Categories - Study Course";
    }, []);

    useEffect(() => {
        if (!catid || !isValidObjectId(catid)) {
            setNotFound(true);
            return;
        }
        fetchsubcatbycat();
    }, [catid]);

    if (notFound) return <ErrorPage />;
    
     if (loading) return  <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <div className="spinner-border text-primary" role="status"></div>
      </div>;

    return (
        <>
            {/* Back Button — sirf dashboard mein */}
            {onBack && (
                <div style={{ marginBottom: "20px" }}>
                    <button
                        onClick={onBack}
                        style={{
                            background: "transparent",
                            border: "1px solid #5a8dee",
                            color: "#5a8dee",
                            padding: "8px 18px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        ← Back to Categories
                    </button>
                </div>
            )}

            {/* Breadcrumb — sirf public page par, dashboard mein nahi */}
            {!onBack && (
                <section className="w3l-breadcrumb">
                     <div className="breadcrumb-bg breadcrumb-bg-about py-2">
                         <div className="container pt-3 pb-5 p-lg-4 pt-lg-5">
                            <h2 className="title mt-5 pt-lg-5 pt-sm-3">Sub Categories of {subcatdata[0]?.catid?.catname}</h2>
                            <ul className="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
                                <Link to="/" className="breadcrumb-homelink">Home</Link>
                                <li className="active"> / Sub Categories </li>
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
            )}

            <section className="w3l-courses">
                <div className="blog pb-5" id="courses">
                    <div className="container py-lg-5 py-md-4 py-2">
                        <div className="row">
                            {subcatdata.length > 0 ?
                                subcatdata.map((data, i) =>
                                    <div className="col-lg-4 col-md-6 item" key={i}>
                                        <div className="card lesson-img-gap">
                                            <div className="card-body">
                                                {/* Dashboard: callback, Public: Link */}
                                                {onSubCatClick ? (
                                                    <div
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => onSubCatClick(data._id, data.subcatname)}
                                                    >
                                                        <img alt="catpic" src={`uploads/${data.picname}`} className="img-fluid" />
                                                        <p className="category-p">{data.subcatname}</p>
                                                    </div>
                                                ) : (
                                                    <Link to={`/lessons?scid=${data._id}&name=${encodeURIComponent(data.subcatname)}`}>
                                                        <img alt="catpic" src={`uploads/${data.picname}`} className="img-fluid" />
                                                        <p className="category-p">{data.subcatname}</p>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default SubCategories;