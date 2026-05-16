import { useEffect } from "react";
import { Link } from "react-router-dom";
import useFetchCategories from "../hooks/useFetchCategories";

function Categories() {
    const { allcat = [], fetchCategories } = useFetchCategories();

    // Page title
    useEffect(() => {
        document.title = "Categories - Study Course";
    }, []);

    // Fetch categories safely
    useEffect(() => {
        let isMounted = true;


        const loadData = async () => {
            try {
                if (typeof fetchCategories === "function") {
                    await fetchCategories();
                }
            } catch (err) {
                console.log("Category fetch error:", err?.message || err);
            }
        };

        if (isMounted) loadData();

        return () => {
            isMounted = false;
        };
    }, [fetchCategories]);
    return (
        <>
            <section className="w3l-breadcrumb">
                <div className="breadcrumb-bg breadcrumb-bg-about py-2">
                     <div className="container pt-3 pb-5 p-lg-4 pt-lg-5">
                        <h2 className="title mt-5 pt-lg-5 pt-sm-3">Categories</h2>

                        <ul className="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
                            <Link to="/" className="breadcrumb-homelink">Home</Link>
                            <li className="active"> / Categories </li>
                        </ul>
                    </div>
                </div>

                <div className="waveWrapper waveAnimation">
                    <svg viewBox="0 0 500 150" preserveAspectRatio="none">
                        <path
                            d="M-5.07,73.52 C149.99,150.00 299.66,-102.13 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
                            style={{ stroke: "none" }}
                        />
                    </svg>
                </div>
            </section>

            <section className="w3l-courses">
                <div className="blog pb-5" id="courses">
                    <div className="container py-lg-5 py-md-4 py-2">
                        <div className="row">

                            {Array.isArray(allcat) && allcat.length > 0 ? (
                                allcat.map((data) => (
                                    <div className="col-lg-4 col-md-6 item" key={data._id}>
                                        <div className="card lesson-img-gap">
                                            <div className="card-body">
                                                <Link to={`/subcategories?cid=${data._id}`}>
                                                   <img
                                                    alt={data?.catname || "category"}
                                                    src={`${process.env.REACT_APP_APIURL}/uploads/${data?.picname}`}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.onerror = null; // no infinite loop
                                                        e.target.src = "/images/placeholder.png";
                                                    }}
                                                />
                                                    <p className="category-p">{data.catname}</p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                null
                            )}

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Categories;