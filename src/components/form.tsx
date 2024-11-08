import { useState } from "react";
import { validatePhone } from "./phValidate";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/client";
// import { formatPhoneNumber } from "./formatPh";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  videoUrl: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  mobile?: string;
  videoUrl?: string;
  message?: string;
}

interface EmbedHtml {
  error?: string;
  html?: string;
  meta?: {
    site: string;
    title: string;
  };
}

const key = import.meta.env.NEXT_PUBLIC_IFRAMELY_API_KEY;
const isDev = import.meta.env.MODE === "development";

const Form = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "Test User",
    email: "testuser@domain.com",
    mobile: "1234567890",
    videoUrl: "https//www.youtube.com",
    message:
      "The sun rises over mountains, casting golden light across valleys as birds soar through crisp morning air.",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  // Video Validation

  const [embedHtml, setEmbedHtml] = useState<EmbedHtml | null>(null);
  const [videoErrorMessage, setVideoErrorMessage] = useState("privateVideo");

  const handleValidateVideo = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    // setVideoUrl(formData.videoUrl);
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
        setEmbedHtml(data); // Store the HTML to render
      } else {
        setEmbedHtml(null);
        setVideoErrorMessage("Unable to preview this video.");
      }
    } catch (error) {
      setVideoErrorMessage("Error fetching video preview.");
    }
  };

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  console.log({ videoErrorMessage });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      setSubmitStatus("submitting");
      await addDoc(collection(db, "submissions"), {
        ...formData,
        createdAt: new Date(),
      });

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        videoUrl: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      {submitStatus === "idle" && (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            style={{ padding: 20 }}
            value={formData.name}
            onChange={(e) => handleChange(e)}
          />
          {errors.name && <p>{errors.name}</p>}
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            style={{ padding: 20 }}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}
          <input
            id="mobile"
            name="mobile"
            type="phone"
            style={{ padding: 20 }}
            value={formData.mobile}
            onChange={handleChange}
            placeholder="1234-567-890"
          />
          {errors.mobile && <p>{errors.mobile}</p>}
          <input
            id="videoUrl"
            name="videoUrl"
            type="text"
            placeholder="Link to video"
            style={{ padding: 20 }}
            value={formData.videoUrl}
            onChange={handleChange}
          />
          <button onClick={handleValidateVideo}>Validate Video</button>
          {embedHtml?.meta && (
            <div style={{ height: 300 }}>
              <div>
                Platform: {embedHtml.meta.site}
                Title: {embedHtml.meta.title}
                Preview:{" "}
                <div
                  style={{ width: 200, height: 200 }}
                  dangerouslySetInnerHTML={{ __html: `${embedHtml?.html}` }}
                />
              </div>
            </div>
          )}
          {embedHtml?.error && <p>{embedHtml.error}</p>}
          {errors.videoUrl && <p>{errors.videoUrl}</p>}
          <textarea
            id="message"
            name="message"
            placeholder="Why should you get the call up?"
            style={{ padding: 20 }}
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && <p>{errors.message}</p>}
          <button
            style={{ padding: 20 }}
            type="submit"
            disabled={isSubmitting && !!errors}
          >
            {isSubmitting ? "Submitting..." : "LET'S GO"}
          </button>
        </form>
      )}
      {submitStatus === "success" && (
        <div>
          <h2>Let's Go</h2>
          <p>Yout Kayo call up entry has been successfully submitted</p>
        </div>
      )}
    </div>
  );
};

export default Form;
