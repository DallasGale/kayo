import { Modal } from "react-responsive-modal";
import styles from "./styles.module.scss";

interface Props {
  open: boolean;
  onCloseModal: () => void;
}

const TermsModal = ({ open, onCloseModal }: Props) => {
  return (
    <Modal open={open} onClose={onCloseModal} center>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Terms and conditions</h2>
        <p className={styles.modalParagraph}></p>
      </div>
    </Modal>
  );
};

export default TermsModal;
