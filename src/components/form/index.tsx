import { useEffect, useState } from "react";
import { validatePhone } from "../phValidate";
import { addDoc, collection, writeBatch, doc } from "firebase/firestore";
import { db } from "../../firebase/client";
import styles from "./styles.module.scss";
import btnStyles from "../button/styles.module.scss";
import Tick from "../../assets/tick.svg";

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

const BATCH_SIZE = 500;
const BATCH_TIMEOUT = 30000; // 30 seconds

const key = import.meta.env.NEXT_PUBLIC_IFRAMELY_API_KEY;
const isDev = import.meta.env.MODE === "development";

const Form = () => {
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
      console.log(formData.videoUrl);
      // Fetch embed HTML from Iframely API
      const response = await fetch(
        `https://iframe.ly/api/iframely?url=${encodeURIComponent(
          formData.videoUrl,
        )}&omit_script=1&${isDev ? "key" : "api_key"}=${key}`,
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
    return Object.keys(newErrors).length === 0;
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
    const videoNotValidated = !!formData.videoUrl.trim() && !embedHtml?.html;

    // Disable submit if any of these conditions are true
    setDissabledSetSubmit(
      isOverLimit || hasEmptyFields || hasValidationErrors || videoNotValidated,
    );
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    // Apply phone formatting if it's the mobile field
    // const formattedValue = name === "mobile" ? formatPhoneNumber(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // ----------------------------------------------------------------
  // Batch Processing
  // ----------------------------------------------------------------
  const [submissionQueue, setSubmissionQueue] = useState<
    Array<FormData & { createdAt: Date }>
  >([]);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchStatus, setBatchStatus] = useState<string>("");

  // Handle batch processing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const processBatch = async () => {
      if (submissionQueue.length === 0 || batchProcessing) return;

      try {
        setBatchProcessing(true);
        const batch = writeBatch(db);
        const submissionsRef = collection(db, "submissions");

        // Process up to BATCH_SIZE submissions
        const itemsToProcess = submissionQueue.slice(0, BATCH_SIZE);
        itemsToProcess.forEach((submission) => {
          const docRef = doc(submissionsRef);
          batch.set(docRef, submission);
        });

        await batch.commit();

        // Remove processed items from queue
        setSubmissionQueue((prev) => prev.slice(itemsToProcess.length));
        setBatchStatus(
          `Successfully processed ${itemsToProcess.length} submissions`,
        );
      } catch (error) {
        console.error("Batch processing error:", error);
        setBatchStatus("Error processing batch. Will retry...");
      } finally {
        setBatchProcessing(false);
      }
    };

    // Process immediately if queue reaches batch size
    if (submissionQueue.length >= BATCH_SIZE) {
      processBatch();
    }
    // Otherwise, set a timer to process whatever is in the queue
    else if (submissionQueue.length > 0) {
      timeoutId = setTimeout(processBatch, BATCH_TIMEOUT);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [submissionQueue, batchProcessing]);

  // ----------------------------------------------------------------
  // Form Submission
  // ----------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      setSubmitStatus("submitting");

      // Add submission to queue instead of immediate Firebase write
      const submissionData = {
        ...formData,
        createdAt: new Date(),
      };

      setSubmissionQueue((prev) => [...prev, submissionData]);
      setBatchStatus(
        `Added to queue. Current queue size: ${submissionQueue.length + 1}`,
      );

      setSubmitStatus("success");
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
    } catch (error) {
      setSubmitStatus("error");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }

    console.log({ batchProcessing, batchStatus, submissionQueue });
  };

  return (
    <div className={styles.formWrapper}>
      {submitStatus === "idle" && (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {submissionQueue.length > 0 && (
            <div className={styles.batchStatus}>
              <p className="small-print">
                Submissions in queue: {submissionQueue.length}
              </p>
              <p className="small-print">{batchStatus}</p>
            </div>
          )}
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
                    dangerouslySetInnerHTML={{ __html: `${embedHtml?.html}` }}
                  />
                </div>
              </div>
            )}
            <p className={styles.videoTerms}>
              {validVideo && <img src={Tick.src} />} The link provided must be
              public with no password
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
              <span className={isOverLimit ? " color-warning" : "color-grey"}>
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
            <h2 className="display-4">
              YOU WIN: A paid, on-air role for at least the first 11 weeks of
              the season, plus mentoring from the biggest names at Fox Footy.
            </h2>
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              className={`${btnStyles.btn} ${btnStyles.primaryBtn}  ${btnStyles.largeBtn}`}
              type="submit"
              disabled={disabledSubmit}
            >
              <span>{isSubmitting ? "Submitting..." : "SUBMIT ENTRY"}</span>
            </button>
          </div>
        </form>
      )}
      {submitStatus === "success" && (
        <div>
          <h2>Let's Go</h2>
          <p>Yout Kayo call up entry has been successfully submitted</p>
          {/* {submissionQueue.length > 0 && (
            <p className="small-print">
              Your submission is queued and will be processed shortly.
            </p>
          )} */}
        </div>
      )}
    </div>
  );
};

export default Form;
