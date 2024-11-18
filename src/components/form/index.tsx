import { useEffect, useState } from "react";
import { validatePhone } from "../phValidate";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import HeroImg from "../../assets/hero.svg";
import Bg from "../../assets/footballs.png";

import { db } from "../../firebase/client";
import styles from "./styles.module.scss";
import btnStyles from "../button/styles.module.scss";
import Tick from "../../assets/tick.svg";

import Cheer from "../../assets/sounds/cheer.mp3";

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

interface FormProps {
  successCb: () => void;
}
const Form = ({ successCb }: FormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "Dallas Gale",
    email: "dallasgale.digital@gmail.com",
    mobile: "0409235082",
    videoUrl: "https://youtu.be/SwCW-yVrC38?si=ZCsRq9oR5byClHjZ",
    message: "Hey",
    readTerms: true,
    over18: true,
    resident: true,
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
      console.log(formData.videoUrl);
      // Fetch embed HTML from Iframely API
      const response = await fetch(
        `https://iframe.ly/api/iframely?url=${encodeURIComponent(
          formData.videoUrl,
        )}&omit_script=1&${isDev ? `key=${key}` : `api_key=${apiKey}`}`,
      );
      const data = await response.json();
      console.log({ data });

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

    // Clear any existing errors first
    setErrors({});

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!validatePhone(formData.mobile)) {
      newErrors.mobile = "Please enter a valid mobile number";
    }

    if (videoErrorMessage === "privateVideo") {
      newErrors.videoUrl = "A public Video URL is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    // if (!formData.readTerms) {
    //   newErrors.readTerms = "Please accept the terms and conditions";
    // }

    setErrors(newErrors);
    console.log({ errors, newErrors });
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
  const [disabledSubmit, setDissabledSetSubmit] = useState(true);
  useEffect(() => {
    // Check if any required fields are empty
    const hasEmptyFields =
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.mobile.trim() ||
      !formData.videoUrl.trim() ||
      !formData.message.trim() ||
      !formData.readTerms ||
      !formData.over18 ||
      !formData.resident;

    // Check if there are any validation errors
    const hasValidationErrors = Object.keys(errors).length > 0;

    // Check if video is validated (only if videoUrl is not empty)
    const videoNotValidated =
      !!formData.videoUrl.trim() && !Boolean(embedHtml?.html);

    // Disable submit if any of these conditions are true
    setDissabledSetSubmit(
      isOverLimit || hasEmptyFields || hasValidationErrors || videoNotValidated,
    );
    console.log({
      isOverLimit,
      hasEmptyFields,
      hasValidationErrors,
      videoNotValidated,
    });
  }, [isOverLimit, errors, formData, embedHtml?.html]);

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

    // Clear the specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Update handleTermsChange to clear errors
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));

    // Clear the specific error when checkbox is changed
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
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

    const hasValidationErrors = Object.keys(errors).length > 0;
    const videoNotValidated = !!formData.videoUrl.trim() && !validVideo;

    setDissabledSetSubmit(
      isOverLimit || hasEmptyFields || hasValidationErrors || videoNotValidated,
    );
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
      <div className={styles.wrapper}>
        <div className={styles.formWrapper}>
          {submitStatus !== "success" && (
            <>
              <img
                className={styles.hero}
                src={HeroImg.src}
                alt="Kato Sports Call Up"
              />
              <h2 className="display-1">Submit your entry</h2>
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
                    onChange={handleChange}
                  />
                  {errors.email && <p>{errors.email}</p>}
                  <input
                    className={styles.input}
                    id="mobile"
                    name="mobile"
                    type="phone"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Mobile No"
                  />
                </fieldset>
                {errors.mobile && <p>{errors.mobile}</p>}
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
                      onChange={handleChange}
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
                    onChange={handleChange}
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

                <label htmlFor="read" className={styles.termsLabel}>
                  <input
                    type="checkbox"
                    id="read"
                    name="readTerms"
                    onChange={(e) => handleTermsChange(e)}
                    className={styles.checkbox}
                  />
                  <p>I have read and accept the terms and conditions</p>
                </label>
                <label htmlFor="age" className={styles.termsLabel}>
                  <input
                    type="checkbox"
                    id="age"
                    name="over18"
                    onChange={(e) => handleTermsChange(e)}
                    className={styles.checkbox}
                  />
                  <p>I AM OVER THE AGE OF 18</p>
                </label>
                <label htmlFor="resident" className={styles.termsLabel}>
                  <input
                    type="checkbox"
                    id="resident"
                    name="resident"
                    onChange={(e) => handleTermsChange(e)}
                    className={styles.checkbox}
                  />
                  <p>I Live in australia</p>
                </label>

                <div className={styles.youWin}>
                  <h2 className="display-4 color-black05">
                    <span className="color-black">YOU WIN:</span> A{" "}
                    <span className="color-black">paid, on-air role</span> for
                    at least the first 11 weeks of the season, plus{" "}
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
          <div className={styles.success}>
            <h2 className={`${styles.successTitle}`}>LET'S GO!</h2>
            <h3 className={`${styles.successSubTitle}`}>
              Your KAYO CALL UP entry has been successfully submitted
            </h3>
          </div>
        )}
      </div>
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${Bg.src})` }}
      />
    </section>
  );
};

export default Form;
