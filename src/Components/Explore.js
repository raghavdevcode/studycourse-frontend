import { useEffect } from "react";
import useFetchCategories from "../hooks/useFetchCategories";

function Explore({ onCategoryClick }) {
  const { allcat = [], fetchCategories } = useFetchCategories();

  useEffect(() => {
    document.title = "Explore - Study Course";
  }, []);

useEffect(() => {
  fetchCategories();
}, [fetchCategories]);

  return (
    <>
      <section className="w3l-courses">
        <div className="blog pb-5" id="courses">
          <div className="container py-lg-5 py-md-4 py-2">
            <div className="row">

              {allcat && allcat.length > 0
                ? allcat.map((data, i) => (
                    <div className="col-lg-4 col-md-6 item" key={data?._id || i}>
                      <div className="card lesson-img-gap">
                        <div className="card-body">

                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => onCategoryClick?.(data?._id)}
                          >
                            <img
                              alt="catpic"
                              src={`${process.env.REACT_APP_APIURL}/uploads/${data?.picname}`}
                            />
                            <p className="category-p">{data?.catname}</p>
                          </div>

                        </div>
                      </div>
                    </div>
                  ))
                : null}

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Explore;