import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function ErrorPage() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Content Not Found - Study Course";
    }, []);

    return (
        <>
            <section className="w3l-breadcrumb">
                <div className="breadcrumb-bg breadcrumb-bg-about py-2">
                    <div className="container pt-3 pb-5 p-lg-4 pt-lg-5">
                        <h2 className="title mt-5 pt-lg-5 pt-sm-3">Error Page</h2>
                        <ul className="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
                            <Link to="/" className="breadcrumb-homelink">Home</Link>
                            <li className="active"> / 404 </li>
                        </ul>
                    </div>
                </div>
                <div className="waveWrapper waveAnimation">
                    <svg viewBox="0 0 500 150" preserveAspectRatio="none">
                        <path
                            d="M-5.07,73.52 C149.99,150.00 299.66,-102.13 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
                            style={{ stroke: "none" }}
                        ></path>
                    </svg>
                </div>
            </section>

            <section className="ep-section">
                <div className="ep-card">

                    {/* Icon */}
                    <div className="ep-icon-ring">
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" stroke="var(--ep-danger)" strokeWidth="1.5" />
                            <path d="M12 7.5v5" stroke="var(--ep-danger)" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="16.5" r="1.2" fill="var(--ep-danger)" />
                        </svg>
                    </div>

                    {/* Badge */}
                    <p className="ep-badge">
                        404 — Content not found
                    </p>

                    {/* Heading */}
                    <h2 className="ep-title">
                        Something went Wrong!
                    </h2>

                    {/* Description */}
                    <p className="ep-desc">
                        This page does not exist or the ID is invalid.
                         Please use the correct link or go back to home.
                    </p>

                    {/* Buttons */}
                   <div className="ep-btns">
                        <button
                            onClick={() => navigate(-1)}
                            className="ep-btn-back"
                        >
                            ← Go Back
                        </button>
                        <Link
                            to="/"
                            className="ep-btn-home"
                        >
                            Go to Home
                        </Link>
                    </div>
                </div>
            </section>

        
        </>
    );
}

export default ErrorPage;
