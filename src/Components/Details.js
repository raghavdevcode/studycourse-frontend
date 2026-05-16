import api from "../api/api";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorPage from "./ErrorPage";
import { createPortal } from "react-dom";
import { convertUTCtoIST } from "../utils/time";
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

/* ---------------- VIDEO MODAL ---------------- */
function VideoModal({ youtubeId, onClose, onWatchComplete }) {
  const playerRef = useRef(null);
  const player = useRef(null);
  const watchCompleted = useRef(false);
  const intervalRef = useRef(null);

  function startProgressTracking() {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (!player.current) return;

      try {
        const state = player.current.getPlayerState();
        if (state !== 1) return;

        const current = player.current.getCurrentTime();
        const duration = player.current.getDuration();
        if (!duration) return;

        const percent = (current / duration) * 100;

        if (percent >= 90 && !watchCompleted.current) {
          watchCompleted.current = true;
          clearInterval(intervalRef.current);
          onWatchComplete?.();
        }
      } catch { }
    }, 5000);
  }

  useEffect(() => {
    const initPlayer = () => {
      if (!playerRef.current) return;

      player.current = new window.YT.Player(playerRef.current, {
        videoId: youtubeId,
        playerVars: { autoplay: 1, controls: 1, modestbranding: 1, rel: 0 },
        events: {
          onStateChange: (event) => {
            const YT = window.YT.PlayerState;

            if (event.data === YT.PLAYING) startProgressTracking();
            if (event.data === YT.PAUSED && intervalRef.current) clearInterval(intervalRef.current);

            if (event.data === YT.ENDED) {
              clearInterval(intervalRef.current);
              if (!watchCompleted.current) {
                watchCompleted.current = true;
                onWatchComplete?.();
              }
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else initPlayer();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      player.current?.destroy();
    };
  }, [youtubeId]);

  const handleBack = () => {
    player.current?.seekTo(player.current.getCurrentTime() - 10, true);
  };

  const handleForward = () => {
    player.current?.seekTo(player.current.getCurrentTime() + 30, true);
  };

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.95)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000000,
          background: "rgba(0,0,0,0.6)",
          border: "2px solid #fff",
          color: "#fff",
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "#000",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", paddingBottom: "56.25%" }}>
          <div ref={playerRef} style={{ position: "absolute", width: "100%", height: "100%" }} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            padding: "15px",
            background: "#111",
          }}
        >
          <div style={{ display: "flex", gap: "20px" }}>
            <button onClick={handleBack} style={btnStyle}>⏪ 10s</button>
            <button onClick={handleForward} style={btnStyle}>⏩ 30s</button>
          </div>

          <p style={{ color: "#ccc", fontSize: "0.85rem" }}>
            Click the ✕ icon in the top-right corner to close the video.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

const btnStyle = {
  background: "#5a8dee",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
};

/* ---------------- DETAILS ---------------- */
function Details({ lessonId, onBack }) {
  const [params] = useSearchParams();
  const courseid = lessonId || params.get("lid");

  const [courseinfo, setcourseinfo] = useState({});
  const udata = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [alreadyMarked, setAlreadyMarked] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const youtubeId =
    courseinfo?.youtubeUrl?.length === 11 ? courseinfo.youtubeUrl : null;

  const isLocked = courseinfo?.isLocked;
  const subcatId = courseinfo?.subcatId;

  function handleWatchNow() {
    if (!udata?.isLoggedIn) {
      toast.warn("Please login to watch this lesson");
      sessionStorage.setItem("lid", courseid);
      navigate("/login");
      return;
    }

    if (isLocked) {
      navigate(
        `/payment?scid=${subcatId}&name=${encodeURIComponent(
          courseinfo?.subcatName || "Course"
        )}`
      );
      return;
    }

    if (youtubeId) setShowModal(true);
    else toast.warn("Video not available");
  }

  async function markAsWatched() {
    try {
      const res = await api.post(
        `/api/progress/mark`,
        { lessonId: courseid, subcatId }
      );

      if (res?.data?.code === 1) setAlreadyMarked(true);
    } catch (e) {
      console.error(e);
    }
  }

async function checkIfWatched() {
    try {
        const res = await api.get("/api/progress/get");
        if (res.data.code === 1) {
            const watched = res.data.progressData || [];
            const isWatched = watched.some(p => 
                p.lessonId?.toString() === courseid?.toString() 
            );
            
            setAlreadyMarked(isWatched);
        }
    } catch (e) {
        console.error(e);
    }
}
  async function fetchcoursedetails() {
    try {
      const res = await api.get(
        `/api/lesson/getone/${courseid}`
        
      );

      if (res?.data?.code === 1) setcourseinfo(res.data.coursedata);
      else setNotFound(true);
    } catch {
      setNotFound(true);
    }
    finally{
      setLoading(false)
    }
  }

  async function fetchComments() {
    try {
      const res = await api.get(
       `/api/comment/get?lessonId=${courseid}`
      );
      if (res?.data?.code === 1) setComments(res.data.comments || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleAddComment() {
    if (!commentText.trim()) return toast.warn("Write something");

    try {
      const res = await api.post(
        `/api/comment/add`,
        { lessonId: courseid, username: udata?.uname, comment: commentText },
        { withCredentials: true }
      );

      if (res.data.code === 1) {
        setCommentText("");
        fetchComments();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDeleteComment(cid) {
    const updated = comments.filter((c) => c._id !== cid);
    setComments(updated);

    try {
      const res = await api.delete(`/api/comment/delete/${cid}`);

      if (res.data.code === 1) toast.success("Comment deleted");
      else fetchComments();
    } catch (e) {
      console.error(e);
      fetchComments();
    }
  }

  useEffect(() => {
    if (!courseid || !isValidObjectId(courseid)) return setNotFound(true);
    fetchcoursedetails();
    fetchComments();
     if (udata?.isLoggedIn) checkIfWatched();
  }, [courseid,udata]);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

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
      {showModal && youtubeId && (
        <VideoModal
          youtubeId={youtubeId}
          onClose={() => setShowModal(false)}
          onWatchComplete={() => {
            if (!alreadyMarked && subcatId) markAsWatched();
          }}
        />
      )}

      {onBack && (
        <div style={{ marginBottom: "20px" }}>
          <button onClick={onBack} style={{ ...btnStyle, background: "transparent", border: "1px solid #5a8dee" }}>
            ← Back to Lessons
          </button>
        </div>
      )}

      <div className="course-container">
        <div className="course-header">
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={`${process.env.REACT_APP_APIURL}/uploads/${courseinfo.thumbnail}`}
              onClick={handleWatchNow}
              style={{
                cursor: "pointer",
                filter: isLocked ? "brightness(0.3)" : "none",
                borderRadius: "12px",
              }}
            />

            {isLocked && (
              <div
                onClick={handleWatchNow}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: "3.5rem" }}>🔒</div>
                <p style={{ color: "#fff", fontWeight: "bold" }}>Enroll to Watch</p>
              </div>
            )}
          </div>

          <div className="course-info">
           <h1 style={{cursor:"context-menu"}}>{courseinfo.title}</h1>
            <p style={{cursor:"pointer"}}>{courseinfo.description}</p>

            <h3 style={{ color: "#f8f8fc", cursor:"context-menu" }}>Duration: {courseinfo.duration}</h3>

            {isLocked ? (
              <>
              <br/>
              <button onClick={handleWatchNow} className="enroll-btn">
                💳 Enroll Now — ₹499
              </button>
              </>
            ) : (
              <>
                <br />
                <button onClick={handleWatchNow} className="enroll-btn">
                  {alreadyMarked ? "✅ Watched — Play Again" : "▶ Watch Now"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {udata?.isLoggedIn && (
        <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 10px" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            Comments
            <span style={{
              background: "#5a8dee", padding: "3px 10px",
              borderRadius: "20px", fontSize: "0.8rem"
            }}>
              {comments.length}
            </span>
          </h3><br />

          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write comment..."
            style={{ width: "100%", minHeight: "80px", padding: "10px", borderRadius: "8px" }}
          /><br /><br />

          <button onClick={handleAddComment} style={btnStyle}>Post</button>

          {comments.length > 0 ? comments.map((c, i) => (
            <div key={i} style={{
              background: "#1e293b", color: "#fff", padding: "12px",
              marginTop: "12px", borderRadius: "8px",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <strong>{c.username}</strong>
                <p className="comment-color" style={{ margin: "5px 0" }}>{c.comment}</p>
                 <small style={{ color: "#aaa", fontSize: "0.75rem" }}>
    {convertUTCtoIST(c.createdAt)}
  </small>
              </div>
              {(c.userId === udata.uid || udata.utype === "admin") && (
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this comment?")) {
                      handleDeleteComment(c._id);
                    }
                  }}
                  style={{
                    background: "#ff4d4f", border: "none", color: "#fff",
                    padding: "6px 10px", borderRadius: "6px", cursor: "pointer"
                  }}
                >Delete</button>
              )}
            </div>
          )) : (
            <><br /><br /><p style={{ color: "#aaa" }}>No comments yet</p></>
          )}
        </div>
      )}
    </>
  );
}

export default Details;