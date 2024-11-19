import TermsModal from "../modals/terms";
import { useState } from "react";
import styles from "./styles.module.scss";
const LegalLinks = () => {
  // Terms Modal
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenModal();
  };
  return (
    <>
      <div className={styles.legal}>
        <p className={`small-print ${styles.smallPrint}`}>Privacy Policy</p>
        <button
          className="text-button small-print color-black"
          onClick={(e) => handleOpenModal(e)}
        >
          TERMS AND CONDITIONS
        </button>
      </div>

      <TermsModal open={open} onCloseModal={onCloseModal} />
    </>
  );
};

export default LegalLinks;
