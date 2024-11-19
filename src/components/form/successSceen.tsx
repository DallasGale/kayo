import styles from "./styles.module.scss";
import btnStyles from "../button/styles.module.scss";
import { useState } from "react";

interface Props {
  handleOpenModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const SuccessScreen = ({ handleOpenModal }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        "https://thekayocallup.kayosports.com.au",
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div className={styles.success}>
      <h2 className={`${styles.successTitle}`}>LET'S GO!</h2>
      <h3 className={`${styles.successSubTitle}`}>
        Your KAYO CALL UP entry has been successfully submitted
      </h3>

      <div className={styles.successBtns}>
        <button
          onClick={handleCopy}
          className={`${btnStyles.btn} ${btnStyles.primaryBtn}  ${btnStyles.largeBtn}`}
          type="submit"
        >
          <span>{copied ? "URL Copied" : "Share with a mate"}</span>
        </button>

        <a
          href="/#have-a-question"
          className={`${btnStyles.btn} ${btnStyles.primaryBtn} ${btnStyles.largeBtn} ${btnStyles.greenBtn}`}
          type="submit"
        >
          <span>Have a question</span>
        </a>
      </div>

      <div>
        <p className={styles.signUpNow}>
          New to Kayo? <a href="https://kayosports.com.au/">Sign up now</a>
        </p>

        <div className={styles.legal}>
          <p className="small-print color-white">
            <a
              className={`small-print ${styles.smallPrint}`}
              style={{ color: "#fff" }}
              href="https://www.foxtel.com.au/about/privacy/comp-privacy-notice.html"
              target="_blank"
            >
              PRIVACY POLICY
            </a>
          </p>
          <p className="small-print color-white">
            <button
              className="text-button small-print color-white"
              onClick={(e) => handleOpenModal(e)}
            >
              TERMS AND CONDITIONS
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SuccessScreen;
