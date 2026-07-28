import 'react-slideshow-image/dist/styles.css'
import { Fade } from 'react-slideshow-image';
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { getAllSubCategoriesApi } from "../api/subCategoryApi";

const fadeImages = [
    {
        url: 'images/banner1.jpg',
        heading: 'Expert-Led Courses — Invest in Your Future',
        desc: 'Learn from industry professionals with structured, in-depth courses at just ₹499.',
    },
    {
        url: 'images/banner2.jpg',
        heading: 'Premium Education, One-Time Payment',
        desc: 'Pay once, get lifetime access. No subscriptions, no hidden fees.',
    },
    {
        url: 'images/banner3.jpg',
        heading: 'Unlock Your Potential Today',
        desc: 'Enroll in any course for ₹499 and get unlimited access to all lessons forever.',
    },
];

const TEACHERS = [
    { initials: 'HA', name: 'Haris Ali Khan', subject: 'Web Development', category: 'Web Dev', bar: 'tc-bar-blue', av: 'tc-av-blue', badge: 'tc-badge-blue', dot: 'tc-dot-blue' },
    { initials: 'BS', name: 'Badani Sir', subject: 'Oracle', category: 'Database', bar: 'tc-bar-amber', av: 'tc-av-amber', badge: 'tc-badge-amber', dot: 'tc-dot-amber' },
    { initials: 'BG', name: 'Bhagirath Giri', subject: 'MySQL', category: 'Database', bar: 'tc-bar-amber', av: 'tc-av-amber', badge: 'tc-badge-amber', dot: 'tc-dot-amber' },
    { initials: 'VT', name: 'Vipul Tyagi', subject: 'MongoDB', category: 'Database', bar: 'tc-bar-teal', av: 'tc-av-teal', badge: 'tc-badge-teal', dot: 'tc-dot-teal' },
    { initials: 'HA', name: 'Haris Ali Khan', subject: 'C Language', category: 'Coding', bar: 'tc-bar-blue', av: 'tc-av-blue', badge: 'tc-badge-blue', dot: 'tc-dot-blue' },
    { initials: 'HA', name: 'Haris Ali Khan', subject: 'C++ Language', category: 'Coding', bar: 'tc-bar-blue', av: 'tc-av-blue', badge: 'tc-badge-blue', dot: 'tc-dot-blue' },
];

function getIsMobile() {
    // window.innerWidth SSR-safe wrapper
    return typeof window !== 'undefined' && window.innerWidth <= 768;
}

function Home() {
    const [subcatdata, setSubcatData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(getIsMobile);
    const abortRef = useRef(null);

  async function fetchAllSubcats() {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);

    try {
        const apiresp = await getAllSubCategoriesApi({
            signal: abortRef.current.signal,
        });

        if (apiresp.data.code === 1) {
            setSubcatData(apiresp.data.scdata);
        }

    } catch (e) {
        if (e?.name === "CanceledError") return;

        console.error(e);

        toast.error(
            e?.response?.data?.message ||
            e?.message ||
            "Server not responding"
        );
    } finally {
        setLoading(false);
    }
}

    useEffect(() => {
        document.title = "Home - Study Course";
    }, []);

    useEffect(() => {
        fetchAllSubcats();
        return () => abortRef.current?.abort(); // Cleanup on unmount
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const displayedSubcats = subcatdata.slice(0, 3);

    return (
        <>
            <style>{`
                .w3l-main-slider .nav svg polygon,
                .w3l-main-slider .nav svg polyline { stroke: #27A6F5 !important; }
                .w3l-main-slider .nav {
                    background: transparent !important; border-radius: 50% !important;
                    width: 50px !important; height: 50px !important;
                    display: flex !important; align-items: center !important;
                    justify-content: center !important;
                    box-shadow: none !important; border: none !important; outline: none !important;
                }
                .w3l-main-slider .nav:hover svg polygon,
                .w3l-main-slider .nav:hover svg polyline { stroke: #ffffff !important; }
                .w3l-main-slider .nav:active, .w3l-main-slider .nav:focus { outline: none !important; box-shadow: none !important; }
                .w3l-main-slider .nav:active svg polygon,
                .w3l-main-slider .nav:active svg polyline,
                .w3l-main-slider .nav:focus svg polygon,
                .w3l-main-slider .nav:focus svg polyline { stroke: #27A6F5 !important; }
                @media (max-width: 768px) {
                    .w3l-main-slider .indicators { display: none !important; }
                    .w3l-main-slider img { height: 320px !important; }
                    .bannerslidertext h5 { font-size: 1.3rem !important; }
                    .bannerslidertext p { font-size: 0.9rem !important; margin-bottom: 1.2rem !important; }
                }
            `}</style>

            {/* BANNER SLIDER */}
            <section className="w3l-main-slider" id="home">
                <div className="companies20-content">
                    <div className="slide-container" style={{ position: 'relative' }}>
                        <Fade duration={3000} transitionDuration={600} infinite={true} arrows={!isMobile}>
                            {fadeImages.map((slide, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <img
                                        style={{ width: '100%', height: '520px', objectFit: 'cover', display: 'block' }}
                                        src={slide.url}
                                        alt={slide.heading}
                                    />
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                        background: 'rgba(0,0,0,0.45)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <div className='bannerslidertext' style={{ textAlign: 'center', padding: '0 20px', maxWidth: '700px' }}>
                                            <h5 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
                                                {slide.heading}
                                            </h5>
                                            <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                                                {slide.desc}
                                            </p>
                                            <Link to="/categories">
                                                <button className="btn btn-style btn-primary">Browse Courses</button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Fade>
                    </div>
                </div>
            </section>

            {/* FEATURED COURSES */}
            <section className="w3l-courses">
                <div className="container py-lg-5 py-md-4 py-2">
                    {/* Loading state */}
                    {loading && (
                        <p className="text-center text-muted">Loading courses...</p>
                    )}

                    {/* Empty state — If API not send data */}
                    {!loading && subcatdata.length === 0 && (
                        <p className="text-center text-muted">

                            No courses are currently available. Please check back later.
                        </p>
                    )}

                    {!loading && subcatdata.length > 0 && (
                        <>
                            <h5 className="title-small text-center mb-1">Start Your Learning Journey</h5>
                            <h3 className="title-big text-center mb-sm-5 mb-4">Popular <span>Courses</span></h3>
                            <div className="row">
                                {displayedSubcats.map((data, i) => (
                                    <div className="col-lg-4 col-md-6 item" key={data._id || i}>
                                        <div className="card lesson-img-gap">
                                            <div className="card-body">
                                                <Link to={`/lessons?scid=${data._id}&name=${encodeURIComponent(data.subcatname)}`}>
                                                    <img
                                                        alt={data.subcatname}
                                                        src={`${process.env.REACT_APP_APIURL}/uploads/${data.picname}`}
                                                        className="img-fluid"
                                                    />
                                                    <p className="category-p">{data.subcatname}</p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="w3l-features py-5" id="facilities">
                <div className="call-w3 py-lg-5 py-md-4 py-2">
                    <div className="container">
                        <div className="row main-cont-wthree-2">
                            <div className="col-lg-5 feature-grid-left">
                                <h5 className="title-small mb-1">Learn & Grow</h5>
                                <h3 className="title-big mb-4">Why StudyCourse?</h3>
                                <p className="text-para" style={{cursor:"pointer"}}>
                                    StudyCourse is a premium online learning platform where you can
                                    learn at your own pace. Pay once and get lifetime access to
                                    structured lessons, categories, and expert guidance.
                                </p>
                                <p className="mt-3" style={{cursor:"pointer"}}>
                                    Create an account, enroll in any course for just ₹499, and learn
                                    with the community by commenting on lessons. One payment, lifetime value.
                                </p>
                                <Link to="/categories" className="btn btn-primary btn-style mt-md-5 mt-4">
                                    Explore Courses
                                </Link>
                            </div>
                            <div className="col-lg-7 feature-grid-right mt-lg-0 mt-5">
                                <div className="call-grids-w3 d-grid">
                                    {[
                                        { icon: 'fa-th-large', title: 'Organized Categories', desc: 'Web Dev, Database and Coding — everything in one place, easily accessible.' },
                                        { icon: 'fa-lock', title: 'Lifetime Access', desc: 'Pay ₹499 once per course and get unlimited, lifetime access to all lessons — no renewals.' },
                                        { icon: 'fa-comments', title: 'Lesson Comments', desc: 'Comment on every lesson, ask doubts and learn together with the community.' },
                                        { icon: 'fa-user-cog', title: 'Admin Dashboard', desc: 'Easily manage categories, subcategories and users from the admin panel.' },
                                    ].map((f, i) => (
                                        <div className="grids-1 box-wrap" key={i}>
                                            <a href="#more" className="icon"><span className={`fa ${f.icon}`}></span></a>
                                            <h4><a href="#feature" className="title-head">{f.title}</a></h4>
                                            <p>{f.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="w3l-how-it-works py-5" id="how-it-works">
                <div className="container">
                    <h5 className="title-small text-center mb-1">Simple Process</h5>
                    <h3 className="title-big text-center mb-sm-5 mb-4">How it <span>Works</span></h3>
                    <div className="hiw-grid">
                        <div className="hiw-step">
                            <div className="hiw-icon-wrap">
                                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </div>
                            <p className="hiw-step-title">Register</p>
                            <p className="hiw-step-desc">Create a free account — only your email is needed to get started.</p>
                        </div>
                        <div className="hiw-arrow">→</div>
                        <div className="hiw-step">
                            <div className="hiw-icon-wrap">
                                <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
                            </div>
                            <p className="hiw-step-title">Enroll & Pay</p>
                            <p className="hiw-step-desc">Choose your course and pay just ₹499 once for lifetime access to all lessons.</p>
                        </div>
                        <div className="hiw-arrow">→</div>
                        <div className="hiw-step">
                            <div className="hiw-icon-wrap">
                                <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            </div>
                            <p className="hiw-step-title">Start Learning</p>
                            <p className="hiw-step-desc">Watch all video lessons, comment with the community, and grow your skills — forever.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA MIDDLE BANNER */}
            <div className="middle py-5">
                <div className="container py-lg-5 py-md-4 py-2">
                    <div className="welcome-left text-center py-lg-4">
                        <h5 className="title-small mb-1">Invest in Yourself Today</h5>
                        <h3 className="title-big">Get lifetime access to expert courses for just ₹499</h3>
                        <Link to="/categories" className="btn btn-style btn-outline-light mt-sm-5 mt-4 mr-2 getstarted">Browse Courses</Link>
                        <Link to="/contact" className="btn btn-style btn-primary mt-sm-5 mt-4 contact-btn">Contact Us</Link>
                    </div>
                </div>
            </div>

            {/* TEACHERS SECTION */}
            <section className="w3l-teachers py-5" id="teachers">
                <div className="container">
                    <h5 className="title-small text-center mb-1">Our Educators</h5>
                    <h3 className="title-big text-center mb-sm-5 mb-4">Meet our <span>Teachers</span></h3>
                    <div className="teachers-grid">
                        {TEACHERS.map((t, i) => (
                            <div className="teacher-card" key={i}>
                                <div className={`tc-bar ${t.bar}`} />
                                <div className={`teacher-avatar ${t.av}`}>{t.initials}</div>
                                <p className="teacher-name">{t.name}</p>
                                <p className="teacher-subject">{t.subject}</p>
                                <span className={`tc-badge ${t.badge}`}>
                                    <span className={`tc-dot ${t.dot}`} />
                                    {t.category}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;