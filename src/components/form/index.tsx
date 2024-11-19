import { useEffect, useState } from "react";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import HeroImg from "../../assets/hero.svg";
import Bg from "../../assets/footballs.png";

import { db } from "../../firebase/client";
import styles from "./styles.module.scss";
import btnStyles from "../button/styles.module.scss";
import Tick from "../../assets/tick.svg";

import Cheer from "../../assets/sounds/cheer.mp3";
import FoxLogo from "../../assets/fox-logo-white.svg";
import { isEmailValid, isPhoneValid } from "./helpers";
import TermsModal from "../modals/terms";
import SuccessScreen from "./successSceen";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  videoUrl: string;
  message: string;
  readTerms: boolean;
  over18: boolean;
  resident: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  mobile?: string;
  videoUrl?: string;
  message?: string;
  readTerms?: boolean;
  over18?: boolean;
  resident?: boolean;
}

interface EmbedHtml {
  error?: string;
  html?: string;
  meta?: {
    site: string;
    title: string;
  };
}

const key = import.meta.env.NEXT_PUBLIC_IFRAMELY_KEY;
const apiKey = import.meta.env.NEXT_PUBLIC_IFRAMELY_API_KEY;
const isDev = import.meta.env.MODE === "development";

const Form = () => {
  // Terms Modal
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenModal();
  };
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    videoUrl: "",
    message: "",
    readTerms: false,
    over18: false,
    resident: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  // ----------------------------------------------------------------
  // Video Validation
  // ----------------------------------------------------------------
  const [embedHtml, setEmbedHtml] = useState<EmbedHtml | null>(null);
  const [videoErrorMessage, setVideoErrorMessage] = useState("");
  const [validating, setValidating] = useState(false);

  const handleValidateVideo = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setValidating(true);
    setVideoErrorMessage(""); // Clear any previous error message

    try {
      // Fetch embed HTML from Iframely API
      const response = await fetch(
        `https://iframe.ly/api/iframely?url=${encodeURIComponent(
          formData.videoUrl,
        )}&omit_script=1&${isDev ? `key=${key}` : `api_key=${apiKey}`}`,
      );
      const data = await response.json();

      if (data.html) {
        setValidating(false);
        setEmbedHtml(data); // Store the HTML to render
      } else {
        setEmbedHtml(null);
        setValidating(false);
        setVideoErrorMessage("Unable to preview this video.");
      }
    } catch (error) {
      setVideoErrorMessage("Error fetching video preview.");
      setValidating(false);
    }
  };

  const [validVideo, setValidVideo] = useState(false);
  useEffect(() => {
    if (embedHtml?.meta) {
      setValidVideo(true);
    } else {
      setValidVideo(false);
    }
  }, [embedHtml?.meta]);

  // ----------------------------------------------------------------
  // Form Validation
  // ----------------------------------------------------------------
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isEmailValid(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!isPhoneValid(formData.mobile)) {
      newErrors.mobile = "Please enter a valid mobile number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (videoErrorMessage === "privateVideo") {
      newErrors.videoUrl = "A public Video URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form and all related states
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      videoUrl: "",
      message: "",
      readTerms: false,
      over18: false,
      resident: false,
    });
    setErrors({});
    setEmbedHtml(null);
    setVideoErrorMessage("");
    setValidVideo(false);
  };

  const wordCount = formData.message
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const isOverLimit = wordCount > 100;

  // Add this at the top of your component where other state declarations are
  // const [formErrors, setFormErrors] = useState(false);
  const [disabledSubmit, setDissabledSetSubmit] = useState<boolean>(true);

  const handleRemoveUrl = () => {
    setEmbedHtml(null);
    setFormData((prev) => ({
      ...prev,
      videoUrl: "",
    }));
  };

  // ----------------------------------------------------------------
  // Form Change Handler
  // ----------------------------------------------------------------
  // Update the handleChange to properly clear errors
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove the immediate error clearing
    const newErrors = { ...errors };
    delete newErrors[name as keyof FormErrors];

    // Only set errors if the field has a value and is invalid
    if (value.trim()) {
      switch (name) {
        case "email":
          if (!isEmailValid(value)) {
            newErrors.email = "Email is invalid";
          }
          break;
        case "mobile":
          if (!isPhoneValid(value)) {
            newErrors.mobile = "Please enter a valid mobile number";
          }
          break;
        case "message":
          if (value.trim().length === 0) {
            newErrors.message = "Please enter a message";
          }
          break;
      }
    }

    setErrors(newErrors);
  };

  // Update handleTermsChange to clear errors
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));

    // Simply clear any errors for this checkbox
    const newErrors = { ...errors };
    delete newErrors[name as keyof FormErrors];
    setErrors(newErrors);
  };

  // ----------------------------------------------------------------
  // Form Submission
  // ----------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any existing errors before validation
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("submitting");

    try {
      const submissionData = {
        ...formData,
        createdAt: serverTimestamp(), // Use serverTimestamp() from firebase/firestore
        status: "pending",
        submittedAt: new Date().toISOString(),
        retryCount: 0,
      };

      // Add to queue collection
      await addDoc(collection(db, "submissionQueue"), submissionData);

      setSubmitStatus("success");
      resetForm(); // Use the new resetForm function
    } catch (error) {
      setSubmitStatus("error");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to emit custom event when state changes
  useEffect(() => {
    // Create and dispatch a custom event
    const event = new CustomEvent("statusChange", {
      detail: { status: submitStatus },
    });
    document.dispatchEvent(event);
  }, [submitStatus]);

  useEffect(() => {
    const hasEmptyFields =
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.mobile.trim() ||
      !formData.videoUrl.trim() ||
      !formData.message.trim() ||
      !formData.readTerms ||
      !formData.over18 ||
      !formData.resident;

    // Only check for validation errors on fields that have values
    const hasValidationErrors = Object.keys(errors).length > 0;
    const videoNotValidated = !!formData.videoUrl.trim() && !validVideo;

    const emailHasValue = formData.email.trim().length > 0;
    const phoneHasValue = formData.mobile.trim().length > 0;
    // Check if email and phone are valid when they have values
    const emailValid = emailHasValue ? isEmailValid(formData.email) : false;
    const phoneValid = phoneHasValue ? isPhoneValid(formData.mobile) : false;

    const shouldDisableSubmit =
      isOverLimit ||
      hasEmptyFields ||
      hasValidationErrors ||
      videoNotValidated ||
      (emailHasValue && !emailValid) ||
      (phoneHasValue && !phoneValid);

    console.log("Submit Button State:", {
      shouldDisableSubmit,
      reasons: {
        isOverLimit,
        hasEmptyFields,
        hasValidationErrors,
        videoNotValidated,
        emailValid,
        phoneValid,
        currentErrors: errors,
      },
      formData: {
        email: formData.email,
        mobile: formData.mobile,
        hasValues: {
          email: !!formData.email.trim(),
          mobile: !!formData.mobile.trim(),
        },
      },
    });

    setDissabledSetSubmit(shouldDisableSubmit);
  }, [formData, errors, isOverLimit, validVideo]);

  // When Submit is successful, play the cheer.mp3
  useEffect(() => {
    if (submitStatus === "success") {
      const audio = new Audio(Cheer);
      audio.play();
    }
  }, [submitStatus]);

  return (
    <section
      className={`${styles.section} ${submitStatus === "success" ? styles.success : ""}`}
    >
      <header style={{ textAlign: "left", width: "100%", zIndex: 40 }}>
        {submitStatus === "success" ? (
          <a
            href="https://www.foxsports.com.au/afl"
            style={{ display: "block", height: 80, width: 100 }}
          >
            <img className={styles.foxLogo} src={FoxLogo.src} alt="Fox Footy" />
          </a>
        ) : (
          <a
            href="/ "
            className={`${btnStyles.btn} ${btnStyles.primaryBtn} ${btnStyles.darkBtn}`}
          >
            <span>Back</span>
          </a>
        )}
      </header>
      <div className={styles.wrapper}>
        <div className={styles.formWrapper}>
          {submitStatus !== "success" && (
            <>
              <div className={styles.logoLockup}>
                <img
                  className={styles.hero}
                  src={HeroImg.src}
                  alt="Kato Sports Call Up"
                />
                <h2 className="display-1">Submit your entry</h2>
              </div>
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <fieldset className={styles.fieldset}>
                  <h3 className={styles.fieldHeading}>Your information</h3>
                  <input
                    className={styles.input}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="First & Last Name"
                    value={formData.name}
                    onChange={(e) => handleChange(e)}
                  />
                  {errors.name && <p>{errors.name}</p>}
                  <input
                    className={styles.input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleChange(e)}
                  />
                  <div>
                    {errors.email && (
                      <p>Please provide a valid email address</p>
                    )}
                  </div>
                  <input
                    className={styles.input}
                    id="mobile"
                    name="mobile"
                    type="phone"
                    value={formData.mobile}
                    onChange={(e) => handleChange(e)}
                    placeholder="Mobile No"
                  />
                  <div>
                    {errors.mobile && (
                      <p>Please provide a valid AU phone number</p>
                    )}
                  </div>
                </fieldset>
                <fieldset className={styles.fieldset}>
                  <h3 className={styles.fieldHeading}>Your submission video</h3>
                  {validVideo && (
                    <div
                      onClick={handleRemoveUrl}
                      className={`${styles.remove} small-print`}
                    >
                      Remove Video
                    </div>
                  )}

                  <div className={styles.videoFieldLockup}>
                    <input
                      className={styles.input}
                      id="videoUrl"
                      name="videoUrl"
                      type="text"
                      placeholder="Link to your submission video"
                      value={formData.videoUrl}
                      onChange={(e) => handleChange(e)}
                    />
                    <div>
                      {validVideo ? (
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <button
                            className={`${btnStyles.btn} ${btnStyles.primaryBtn} ${btnStyles.largeBtn}`}
                          >
                            <span>validated</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          className={`${btnStyles.btn} ${btnStyles.primaryBtn} ${btnStyles.largeBtn}  ${btnStyles.darkBtn}`}
                          onClick={handleValidateVideo}
                        >
                          <span>{validating ? "checking" : "Validate"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                  {validVideo && (
                    <div>
                      <div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `${embedHtml?.html}`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <p className={styles.videoTerms}>
                    {validVideo && <img src={Tick.src} />} The link provided
                    must be public with no password
                  </p>
                  <p className={styles.videoTerms}>
                    {validVideo && <img src={Tick.src} />} MUST BE A LINK FROM
                    YOUTUBE, VIMEO, INSTAGRAM, FACEBOOK or TIKTOK
                  </p>

                  {videoErrorMessage && <p>{videoErrorMessage}</p>}
                  {embedHtml?.error && <p>{embedHtml.error}</p>}
                  {errors.videoUrl && <p>{errors.videoUrl}</p>}
                </fieldset>

                <fieldset className={styles.fieldset}>
                  <h3 className={styles.fieldHeading}>
                    Why should you get The Kayo Call Up?
                  </h3>
                  <textarea
                    className={styles.textArea}
                    id="message"
                    name="message"
                    placeholder="In 100 words of less"
                    value={formData.message}
                    onChange={(e) => handleChange(e)}
                  />
                  <div
                    className={`${styles.limit}
              }`}
                  >
                    {isOverLimit && (
                      <p className="color-warning small-print">
                        Please reduce your text to 100 words or less before
                        submitting.
                      </p>
                    )}
                    <span
                      className={isOverLimit ? " color-warning" : "color-grey"}
                    >
                      {wordCount}
                    </span>{" "}
                    / 100
                  </div>
                </fieldset>
                {errors.message && <p>{errors.message}</p>}

                <div className={styles.checkboxGroup}>
                  <input
                    checked={formData.readTerms}
                    type="checkbox"
                    id="read"
                    name="readTerms"
                    onChange={(e) => handleTermsChange(e)}
                    className={styles.checkbox}
                  />
                  <label className={styles.termsLabel}>
                    <p>
                      I have read and accept the{" "}
                      <button
                        className="text-button"
                        type="button"
                        onClick={(e) => handleOpenModal(e)}
                      >
                        TERMS AND CONDITIONS
                      </button>
                    </p>
                  </label>
                </div>
                <div className={styles.checkboxGroup}>
                  <input
                    checked={formData.over18}
                    type="checkbox"
                    id="age"
                    name="over18"
                    onChange={(e) => handleTermsChange(e)}
                    className={styles.checkbox}
                  />
                  <label htmlFor="age" className={styles.termsLabel}>
                    <p>I AM OVER THE AGE OF 18</p>
                  </label>
                </div>
                <div className={styles.checkboxGroup}>
                  <input
                    checked={formData.resident}
                    type="checkbox"
                    id="resident"
                    name="resident"
                    onChange={(e) => handleTermsChange(e)}
                    className={styles.checkbox}
                  />
                  <label htmlFor="resident" className={styles.termsLabel}>
                    <p>I Live in australia</p>
                  </label>
                </div>

                <div className={styles.youWin}>
                  <h2 className="display-4 color-black05">
                    <span className="color-black">YOU WIN:</span> A{" "}
                    <span className="color-black">paid, on-air role</span> for
                    at least the first 8 weeks of the season, plus{" "}
                    <span className="color-black">mentoring</span> from the
                    biggest names at Fox Footy.
                  </h2>
                </div>
                <div style={{ textAlign: "center" }}>
                  <button
                    className={`${btnStyles.btn} ${btnStyles.primaryBtn}  ${btnStyles.largeBtn}`}
                    type="submit"
                    disabled={disabledSubmit}
                  >
                    <span>
                      {isSubmitting ? "Submitting..." : "SUBMIT ENTRY"}
                    </span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
        {submitStatus === "success" && (
          <SuccessScreen handleOpenModal={(e) => handleOpenModal(e)} />
        )}
      </div>
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${Bg.src})` }}
      />
      <TermsModal open={open} onCloseModal={onCloseModal} />
    </section>
  );
};

export default Form;
