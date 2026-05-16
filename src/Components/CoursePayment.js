import api from "../api/api";
import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

function CoursePayment({
  embedded = false,
  subcatId: propSubcatId,
  subcatName: propSubcatName,
  onSuccess
}) {
  const [params] = useSearchParams();

  const subcatId = embedded ? propSubcatId : params.get("scid");
  const subcatName = embedded ? propSubcatName : (params.get("name") || "Course");
  const udata = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [step, setStep] = useState("form");

  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const [errors, setErrors] = useState({});

  // ---------------- HANDLE CHANGE (RESTORED & CLEAN) ----------------
  function handleChange(e) {
    let { name, value } = e.target;

    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16);
      value = value.replace(/(.{4})/g, "$1 ").trim();
    }

    if (name === "expiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 3) {
        value = value.slice(0, 2) + "/" + value.slice(2);
      }
    }

    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  // ---------------- VALIDATION (UNCHANGED LOGIC) ----------------
  const validate = useCallback(() => {
    const newErrors = {};

    const name = form.cardName.trim();
    if (!name) newErrors.cardName = "Name required";
    else if (name.length < 3) newErrors.cardName = "Enter full name as on card";
    else if (!/^[a-zA-Z\s]+$/.test(name)) newErrors.cardName = "Only letters allowed";

    const rawCard = form.cardNumber.replace(/\s/g, "");

    const blockedCards = [
      "1234567890123456", "1111111111111111", "2222222222222222", "3333333333333333",
      "4444444444444444", "5555555555555555", "0000000000000000", "9999999999999999",
      "1234123412341234", "1234567812345678"
    ];

    if (rawCard.length !== 16) newErrors.cardNumber = "Enter valid 16-digit card number";
    else if (blockedCards.includes(rawCard)) newErrors.cardNumber = "Invalid card number";
    else if (/^(\d)\1{15}$/.test(rawCard)) newErrors.cardNumber = "Invalid card number";
    else if (/^1234/.test(rawCard)) newErrors.cardNumber = "Invalid card number";

    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      newErrors.expiry = "Invalid expiry";
    } else {
      const [mm, yy] = form.expiry.split("/").map(Number);
      const now = new Date();
      const expDate = new Date(2000 + yy, mm - 1);

      if (mm < 1 || mm > 12) newErrors.expiry = "Invalid month";
      else if (expDate < now) newErrors.expiry = "Card expired";
    }

    if (form.cvv.length !== 3) newErrors.cvv = "Enter valid 3-digit CVV";
    else if (/^(\d)\1{2}$/.test(form.cvv)) newErrors.cvv = "Invalid CVV";
    else if (["123", "000", "001"].includes(form.cvv)) newErrors.cvv = "Invalid CVV";

    return newErrors;
  }, [form]);

  // ---------------- SUBMIT ----------------
  async function handleSubmit(e) {
    e.preventDefault();

    if (!udata?.isLoggedIn) {
      toast.warn("Please login first");
      navigate("/login");
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setStep("processing");

    try {
      await new Promise((r) => setTimeout(r, 2000));

    const res = await api.post(`/api/enrollment/enroll`, { subcatId }
);
      if (res?.data?.code === 1 || res?.data?.code === 2) {
        setStep("success");
      } else {
        toast.error("Enrollment failed. Try again.");
        setStep("form");
      }
    } catch (err) {
      toast.error(err.customMessage || "Something went wrong");
      setStep("form");
    }
  }

  function handleStartLearning() {
    if (embedded && onSuccess) {
      onSuccess();
    } else {
      navigate("/studentdashboard");
    }
  }

  return (
    <div className={embedded ? "" : "pay-page"}>
      <div className={embedded ? "" : "pay-card"}>

        {step === "form" && (
          <form onSubmit={handleSubmit}>

            <div className="pay-header">
              <div style={{ fontSize: "2rem" }}>💳</div>
              <h2>Secure Payment</h2>
              <p>Enrolling in: <strong>{subcatName}</strong></p>
            </div>

            <div className="pay-amount-badge">
              <p>Total Amount</p>
              <h1>₹499</h1>
              <small>One-time payment • Lifetime access</small>
            </div>

            {/* Card Preview */}
            <div className="pay-card-preview">
              <div className="pcp-number">
                {form.cardNumber || "•••• •••• •••• ••••"}
              </div>
            </div>

            {/* Card Name */}
            <div className="pay-field">
              <label>Cardholder Name</label>
              <input
                name="cardName"
                value={form.cardName}
                onChange={handleChange}
                className={`pay-input ${errors.cardName ? "error" : ""}`}
                placeholder="Name on card"
              />
              {errors.cardName && <p className="pay-error-msg">{errors.cardName}</p>}
            </div>

            {/* Card Number */}
            <div className="pay-field">
              <label>Card Number</label>
              <input
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                className={`pay-input ${errors.cardNumber ? "error" : ""}`}
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
              />
              {errors.cardNumber && <p className="pay-error-msg">{errors.cardNumber}</p>}
            </div>

            {/* Expiry + CVV */}
            <div className="pay-row">
              <div className="pay-field">
                <label>Expiry</label>
                <input
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  className={`pay-input ${errors.expiry ? "error" : ""}`}
                  placeholder="MM/YY"
                />
                {errors.expiry && <p className="pay-error-msg">{errors.expiry}</p>}
              </div>

              <div className="pay-field">
                <label>CVV</label>
                <input
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  type="password"
                  className={`pay-input ${errors.cvv ? "error" : ""}`}
                  placeholder="•••"
                />
                {errors.cvv && <p className="pay-error-msg">{errors.cvv}</p>}
              </div>
            </div>

            <button type="submit" className="pay-btn">
              🔒 Pay ₹499 & Enroll Now
            </button>

          </form>
        )}

         {step === "processing" && (
          <div className="pay-processing">
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⏳</div>
            <h3>Processing Payment...</h3>
            <p>Please wait, do not refresh.</p>
            <div className="pay-spinner" />
          </div>
        )}

        {step === "success" && (
          <div className="pay-success">
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎉</div>
            <h2>Payment Successful!</h2>
            <button className="pay-success-btn" onClick={handleStartLearning}>
              ▶ Start Learning
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default CoursePayment;