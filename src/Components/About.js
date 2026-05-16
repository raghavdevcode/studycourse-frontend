import { useEffect } from "react";
import { Link } from "react-router-dom";

function About(){
    
    useEffect(()=>{
        document.title = "About - Study Course";
    },[]);

    return(
        <>
            <section className="w3l-breadcrumb">
                <div className="breadcrumb-bg breadcrumb-bg-about py-2">
                 <div className="container pt-3 pb-5 p-lg-4 pt-lg-5">
                        <h2 className="title mt-5 pt-lg-5 pt-sm-3">About Us</h2>
                        <ul className="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-5">
                            <Link to="/" className="breadcrumb-homelink">Home</Link>
                            <li className="active"> / About Us </li>
                        </ul>
                    </div>
                </div>
                <div className="waveWrapper waveAnimation">
                    <svg viewBox="0 0 500 150" preserveAspectRatio="none">
                        <path d="M-5.07,73.52 C149.99,150.00 299.66,-102.13 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: "none" }}></path>
                    </svg>
                </div>
            </section>

            {/* About Intro */}
            <section className="w3l-aboutblock1" id="about">
                <div className="container py-lg-5 py-md-4 py-2">
                    <div className="row">
                        <div className="col-lg-6 align-self">
                            <span className="title-small mb-2">About Us</span>
                            <h3 className="title-big mx-0">Welcome to StudyCourse — Premium Online Learning</h3>
                            <p className="mt-lg-4 mt-3" style={{cursor:"pointer"}}>
                                StudyCourse is a premium e-learning platform built for students, beginners, and professionals who want to build real skills in technology. Our structured, expert-led courses are available at an affordable one-time price of just ₹499 per course — no subscriptions, no renewals.
                            </p>
                            <p style={{cursor:"pointer"}}>
                                We offer courses in Web Development (HTML, CSS, JavaScript), Programming (C, C++), and Databases (MongoDB, MySQL, Oracle). Each course is crafted with clarity and depth so that learners can go from zero to confident in their chosen domain.
                            </p>
                            <p style={{cursor:"pointer"}}>
                                Every course is divided into well-structured lessons with video content, making learning flexible and self-paced. You can watch lessons anytime, anywhere — forever, because your access never expires.
                            </p>
                            <p style={{cursor:"pointer"}}>
                                The first lesson of every course is available for free so you can experience the quality before enrolling. Once you enroll, all lessons unlock instantly.
                            </p>
                            <b><p style={{cursor:"pointer"}}>Join StudyCourse today — invest ₹499, gain skills for life.</p></b>
                            <p className="mt-3 mb-lg-5"></p>
                        </div>
                        <div className="col-lg-6 left-wthree-img mt-lg-0 mt-sm-5 mt-4">
                            <img src="images/about.jpg" alt="" className="img-fluid radius-image"/>
                        </div>
                    </div>
                </div>
            </section>

            {/* Progress Bars */}
            <section className="w3l-servicesblock w3l-servicesblock1 py-5" id="progress">
                <div className="container py-lg-5 py-md-4 py-2">
                    <div className="row">
                        <div className="col-lg-6 align-self pr-lg-4">
                            <div className="progress-info info1">
                                <h6 className="progress-tittle">MongoDB <span>80%</span></h6>
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped" role="progressbar" style={{ width: "80%" }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            <div className="progress-info info2">
                                <h6 className="progress-tittle">C++ Programming <span>95%</span></h6>
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped" role="progressbar" style={{ width: "95%" }} aria-valuenow="95" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            <div className="progress-info info3">
                                <h6 className="progress-tittle">Web Design & Development <span>90%</span></h6>
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped" role="progressbar" style={{ width: "90%" }} aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            <div className="progress-info info4">
                                <h6 className="progress-tittle">Oracle <span>75%</span></h6>
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped" role="progressbar" style={{ width: "75%" }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            <div className="progress-info info2 mb-0">
                                <h6 className="progress-tittle">MySQL <span>95%</span></h6>
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped" role="progressbar" style={{ width: "95%" }} aria-valuenow="95" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mt-lg-0 mt-5 pl-lg-4">
                            <span className="title-small mb-2">Course Depth</span>
                            <h3 className="title-big">What you get in our Premium Courses</h3>
                            <p className="mt-md-4 mt-3" style={{cursor:"pointer"}}>
                                Our premium courses are crafted to give you deep, practical knowledge in the most in-demand tech skills. Whether you are learning Web Development, Programming, or Database Management — every course follows a structured path from basics to advanced concepts.
                            </p>
                            <p className="mt-3" style={{cursor:"pointer"}}>
                                Each lesson includes video content taught by experienced instructors, with real-world examples and hands-on exercises. Pay just ₹499 once per course and get unlimited, lifetime access — revisit any lesson whenever you need a refresher.
                            </p>
                            <Link to="/categories" className="btn btn-primary btn-style mt-md-5 mt-4">Browse Courses — ₹499</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Section */}
            <section className="w3l-block py-5" id="">
                <div className="container py-lg-5 py-md-3">
                    <div className="row">
                        <div className="col-lg-6 about-right-faq align-self">
                            <span className="title-small mb-2">Why Choose Us</span>
                            <h3 className="title-big mx-0">Premium Quality at an Accessible Price</h3>
                            <p className="mt-lg-4 mt-3 mb-lg-5 mb-4" style={{cursor:"pointer"}}>
                                At StudyCourse, we believe great education should be affordable. That's why every course is priced at a flat ₹499 — one payment, lifetime access, no hidden costs. Our platform is built for learners who are serious about building real-world skills through expertly designed lessons, structured content, and a supportive community.
                            </p>
                            <div className="two-grids mt-md-0 mt-md-5 mt-4">
                                <div className="grids_info">
                                    <h4>Lifetime Access</h4>
                                    <p style={{cursor:"pointer"}}>Pay once and access all lessons in your enrolled course forever — no expiry, no renewal fees.</p>
                                </div>
                                <div className="grids_info">
                                    <h4>Expert Instructors</h4>
                                    <p style={{cursor:"pointer"}}>Learn from experienced professionals who guide you with practical knowledge and real-world insights.</p>
                                </div>
                                <div className="grids_info">
                                    <h4>Free First Lesson</h4>
                                    <p style={{cursor:"pointer"}}>Try before you enroll — the first lesson of every course is completely free so you can judge the quality yourself.</p>
                                </div>
                                <div className="grids_info">
                                    <h4>Community Comments</h4>
                                    <p style={{cursor:"pointer"}}>Ask doubts, share insights and learn alongside other enrolled students through lesson comments.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-6 left-wthree-img mt-lg-0 mt-sm-5 mt-4">
                            <img src="images/about1.jpg" alt="" className="img-fluid radius-image"/>
                        </div>
                        <div className="col-lg-3 col-6 left-wthree-img mt-lg-0 mt-sm-5 mt-4">
                            <img src="images/about2.jpg" alt="" className="img-fluid radius-image"/>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default About;