import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

function Contact({ embedded = false }) {
    useEffect(() => {
        document.title = "Contact - Study Course";
    }, []);

    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [phone, setphone] = useState("");
    const [message, setmessage] = useState("");

    const [errors, seterrors] = useState({});
    const [touched, settouched] = useState({});
    const [loading, setLoading] = useState(false);
    const SITE_KEY = "6LcU4NgsAAAAAEsrgnHS7c0vlcAxJYTFFsbdmFBi"

    // Load reCAPTCHA v2 script
    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://www.google.com/recaptcha/api.js"
        script.async = true
        script.defer = true
        document.body.appendChild(script)
    }, [])

    // VALIDATIONS
    const validate = useCallback((fields) => {
        const newErrors = {};

        if (!fields.name || fields.name.trim() === "") {
            newErrors.name = "Name is required.";
        } else if (fields.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters.";
        }

        if (!fields.email || fields.email.trim() === "") {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!fields.phone || fields.phone.trim() === "") {
            newErrors.phone = "Phone number is required.";
        } else if (!/^[0-9]{10}$/.test(fields.phone.trim())) {
            newErrors.phone = "Please enter a valid 10-digit phone number.";
        }

        if (!fields.message || fields.message.trim() === "") {
            newErrors.message = "Message is required.";
        } else if (fields.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters.";
        }

        return newErrors;
    }, []);

    function handleBlur(field) {
        settouched((prev) => ({ ...prev, [field]: true }));
        const validationErrors = validate({ name, email, phone, message });
        seterrors(validationErrors);
    }

    const handlesubmit = useCallback(async (e) => {
        e.preventDefault();

        // Get captcha token from widget
        const token = window.grecaptcha.getResponse()
        if (!token) {
            toast.info("Please complete captcha verification")
            return
        }

        settouched({ name: true, email: true, phone: true, message: true });

        const validationErrors = validate({ name, email, phone, message });
        seterrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        setLoading(true);

        try {
            const apidata = { name, email, phone, message, captcha: token };

            const apiresp = await api.post("/api/contactus", apidata);

            // Reset captcha after submit
            window.grecaptcha.reset()

            toast.success(apiresp?.data || "Message sent successfully");

            setname("");
            setemail("");
            setphone("");
            setmessage("");
            seterrors({});
            settouched({});
        } catch (e) {
            toast.error(e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [name, email, phone, message, validate]);

    const errorStyle = {
        color: "#dc3545",
        fontSize: "16px",
        marginTop: "4px",
        display: "block",
    };

    const inputErrorStyle = { borderColor: "#dc3545" };

    return (
        <>
            {!embedded && (
                <section className="w3l-breadcrumb">
                    <div className="breadcrumb-bg breadcrumb-bg-about py-2">
                        <div className="container pt-3 pb-5 p-lg-4 pt-lg-5">
                            <h2 className="title mt-5 pt-lg-5 pt-sm-3" style={{ cursor: "context-menu" }}>Get in touch</h2>
                            <ul className="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
                                <Link to="/" className="breadcrumb-homelink">Home</Link>
                                <li className="active" style={{ cursor: "context-menu" }}> / Contact us </li>
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
            )}

            <section className={`w3l-contact-1${embedded ? " contact-embedded" : " pb-5"}`} id="contact">
                <div className={embedded ? "contacts-9 py-3" : "contacts-9 py-lg-5 py-md-4"}>
                    <div className="container">
                        <div className="d-grid contact-view">

                            {/* LEFT SIDE (UNCHANGED UI) */}
                            <div className="cont-details">
                                <h4 className="title-small">Get in touch</h4>
                                <h3 className="title-big mb-4">Feel free to contact us</h3>
                                <p className="mb-sm-5 mb-4" style={{ cursor: "pointer" }}>
                                    Start working with Us, We guarantee that you'll be able to
                                    have any issue resolved within 24 hours.
                                </p>

                                <div className="cont-top">
                                    <div className="cont-left text-center">
                                        <span className="fa fa-map-marker text-primary"></span>
                                    </div>
                                    <div className="cont-right">
                                        <h6 style={{ cursor: "context-menu" }}>Our head office address</h6>
                                        <p className="pr-lg-5" style={{ cursor: "context-menu" }}>
                                            Study Course, 208 Trainer Avenue street, Illinois, UK - 62617.
                                        </p>
                                    </div>
                                </div>
                                <div className="cont-top margin-up">
                                    <div className="cont-left text-center">
                                        <span className="fa fa-phone text-primary"></span>
                                    </div>
                                    <div className="cont-right">
                                        <h6 style={{ cursor: "context-menu" }}>Call for help</h6>
                                        <p>
                                            <a href="tel:+(21) 255 999 8888">+(21) 255 999 8888</a>
                                        </p>
                                    </div>
                                </div>
                                <div className="cont-top margin-up">
                                    <div className="cont-left text-center">
                                        <span className="fa fa-envelope-o text-primary"></span>
                                    </div>
                                    <div className="cont-right">
                                        <h6 style={{ cursor: "context-menu" }}>Contact with our support</h6>
                                        <p>
                                            <a href="mailto:studycoursenotify@outlook.com">
                                                studycoursenotify@outlook.com
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* FORM */}
                            <div className="map-content-9">
                                <h5 className="mb-sm-4 mb-3" style={{ cursor: "context-menu" }}>Write to us</h5>
                                <form onSubmit={handlesubmit} noValidate>

                                    {/* NAME + EMAIL */}
                                    <div className="twice-two">
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Name"
                                                value={name}
                                                onChange={(e) => {
                                                    setname(e.target.value);
                                                    if (touched.name) {
                                                        seterrors(validate({ name: e.target.value, email, phone, message }));
                                                    }
                                                }}
                                                onBlur={() => handleBlur("name")}
                                                style={touched.name && errors.name ? inputErrorStyle : {}}
                                            />
                                            {touched.name && errors.name && (
                                                <span style={errorStyle}>{errors.name}</span>
                                            )}
                                        </div>

                                        <div>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Email"
                                                value={email}
                                                onChange={(e) => {
                                                    setemail(e.target.value);
                                                    if (touched.email) {
                                                        seterrors(validate({ name, email: e.target.value, phone, message }));
                                                    }
                                                }}
                                                onBlur={() => handleBlur("email")}
                                                style={touched.email && errors.email ? inputErrorStyle : {}}
                                            />
                                            {touched.email && errors.email && (
                                                <span style={errorStyle}>{errors.email}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* PHONE */}
                                    <div className="twice">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Phone"
                                            value={phone}
                                            maxLength="10"
                                            onChange={(e) => {
                                                setphone(e.target.value);
                                                if (touched.phone) {
                                                    seterrors(validate({ name, email, phone: e.target.value, message }));
                                                }
                                            }}
                                            onBlur={() => handleBlur("phone")}
                                            style={touched.phone && errors.phone ? inputErrorStyle : {}}
                                        />
                                        {touched.phone && errors.phone && (
                                            <span style={errorStyle}>{errors.phone}</span>
                                        )}
                                    </div>

                                    {/* MESSAGE */}
                                    <textarea
                                        className="form-control"
                                        placeholder="Message"
                                        value={message}
                                        onChange={(e) => {
                                            setmessage(e.target.value);
                                            if (touched.message) {
                                                seterrors(validate({ name, email, phone, message: e.target.value }));
                                            }
                                        }}
                                        onBlur={() => handleBlur("message")}
                                        style={touched.message && errors.message ? inputErrorStyle : {}}
                                    />

                                    {touched.message && errors.message && (
                                        <span style={errorStyle}>{errors.message}</span>
                                    )}

                                    <div>
                                        <br />
                                        <div
                                            className="g-recaptcha"
                                            data-sitekey={SITE_KEY}
                                        ></div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-style mt-4"
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
                                                    Sending...
                                                </>
                                            ) : (
                                                "Send Message"
                                            )}
                                        </button>
                                    </div>

                                </form>
                            </div>

                        </div>
                    </div>
                </div>

                {!embedded && (
                    <>
                        <br /><br />
                        <div className="map-iframe">
                            <iframe
                                title="mapiframe"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d317718.69319292053!2d-0.3817765050863085!3d51.528307984912544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C+UK!5e0!3m2!1sen!2spl!4v1562654563739!5m2!1sen!2spl"
                                width="100%"
                                height="400"
                                frameBorder="0"
                                style={{ border: "0px" }}
                                allowFullScreen=""
                            ></iframe>
                        </div>
                    </>
                )}
            </section>
        </>
    );
}

export default Contact;