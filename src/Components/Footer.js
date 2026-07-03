import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useFetchCategories from "../hooks/useFetchCategories";

function Footer() {
  const { allcat, fetchCategories } = useFetchCategories();

  function topFunction() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  useEffect(() => {
    const handleScroll = () => {
      const btn = document.getElementById("movetop");
      if (btn) {
        if (window.scrollY > 100) {
          btn.classList.add("show");
        } else {
          btn.classList.remove("show");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);


  return (
    <>
      <section className="w3l-footer-29-main">
        <div className="footer-29 py-5">
          <div className="container py-md-4">
            <div className="row footer-top-29">
              <div className="col-lg-4 col-md-6 col-sm-7 footer-list-29 footer-1 pr-lg-5">
                <h6 className="footer-title-29">Contact Info </h6>
                <p style={{ cursor: "pointer" }}>Address : Study course, 343 marketing, #2214 cravel street, NY - 62617.</p>
                <p className="my-2">Phone : <a href="tel:+1(21) 234 4567">+1(21) 234 4567</a></p>
                <p>Email :   <a href="mailto:raghavbhanot908@gmail.com">
                  raghavbhanot908@gmail.com
                </a></p>

              </div>

              <div className="col-lg-3 col-md-6 col-sm-5 col-6 footer-list-29 footer-2 mt-sm-0 mt-5">
                <ul>
                  <h6 className="footer-title-29">Company</h6>
                  <li><Link to="/about">About company</Link></li>
                  <li> <Link to="/categories">Online Courses</Link> </li>
                  <li><Link to="/contact">Get in touch</Link></li>
                </ul>
              </div>

              <div className="col-lg-2 col-md-6 col-sm-5 col-6 footer-list-29 footer-3 mt-lg-0 mt-5">
                {allcat.length > 0 && (
                  <>
                    <h6 className="footer-title-29">Categories</h6>
                    {allcat.map((data, i) =>
                      <ul key={i}>
                        <Link to={`/subcategories?cid=${data._id}`}>
                          <p className="category-p categories-hover-effect">{data.catname}</p>
                        </Link>
                      </ul>
                    )}
                  </>
                )}
              </div>

              <div className="col-lg-3 col-md-6 col-sm-7 footer-list-29 footer-4 mt-lg-0 mt-5">
                <h6 className="footer-title-29">Follow Us</h6>

                {/* Social Media Links */}
                <div className="footer-social-links mt-3">
                  <a href="https://github.com/raghavdevcode" target="_blank" rel="noreferrer" className="social-icon" title="Github">
                    <i class="fa-brands fa-github"></i>
                  </a>

                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" title="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>

                  <a href="https://www.linkedin.com/in/raghav-bhanot-56bab939b" target="_blank" rel="noreferrer" className="social-icon" title="LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        <section className="w3l-copyright text-center">
          <div className="container">
            <p className="copy-footer-29" style={{ cursor: "context-menu" }}>© 2026 Study Course. All rights reserved. Design by <a href="https://github.com/raghavdevcode"
              target="_blank" rel="noreferrer" className="footercopylink">
              Raghav Bhanot</a></p>
          </div>
        </section>
      </section>

      <button onClick={topFunction} id="movetop" title="Go to top">
        &#10548;
      </button>
    </>
  )
}
export default Footer;