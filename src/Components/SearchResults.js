import { useEffect, useState } from "react";
import ErrorPage from "./ErrorPage";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

function SearchResults() {
  const [params] = useSearchParams();
  const stext = params.get("s") || "";
  const [subcats, setSubcats] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);

  async function searchAll() {
    try {
      const apiresp = await api.get(`/api/searchcourses?s=${stext}`);
      if (apiresp.data.code === 1) {
        setSubcats(apiresp.data.subcats);
      } else {
        setSubcats([]);
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || "Something went wrong";
      toast.error(msg);
      setSubcats([]);
    } finally {
      setSearched(true);
      setLoading(false)
    }
  }


  useEffect(() => {
    if (!stext) {
      setSubcats([]);
      setSearched(true);
      setLoading(false)
      return;
    }

    setSearched(false);
    searchAll();
  }, [stext]);

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
  if (!searched) return null;
  if (subcats.length === 0) return <ErrorPage />;
 

  return (
    <>
      <section className="w3l-breadcrumb">
          <div className="breadcrumb-bg breadcrumb-bg-about py-2">
              <div className="container pt-3 pb-5 p-lg-4 pt-lg-5">
            <h2 className="title mt-5 pt-lg-5 pt-sm-3">Search Results</h2>
            <ul className="breadcrumbs-custom-path pb-sm-5 pb-4 mt-2 text-center mb-md-5">
              <Link to="/" className="breadcrumb-homelink">Home</Link>
              <li className="active"> / Search Results </li>
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

      <section className="w3l-courses">
        <div className="blog pb-5" id="courses">
          <div className="container py-lg-5 py-md-4 py-2">
            <div className="row">
              {subcats.map((data, i) => (
                <div className="col-lg-4 col-md-6 item" key={i}>
                  <div className="card lesson-img-gap">
                    <div className="card-body">
                      <Link to={`/lessons?scid=${data._id}`}>
                        <img
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
          </div>
        </div>
      </section>
    </>
  );
}
export default SearchResults;