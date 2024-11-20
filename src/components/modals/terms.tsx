import { Modal } from "react-responsive-modal";
import styles from "./styles.module.scss";
import Terms from "../../pages/terms/terms";

interface Props {
  open: boolean;
  onCloseModal: () => void;
}

const TermsModal = ({ open, onCloseModal }: Props) => {
  return (
    <Modal open={open} onClose={onCloseModal} center>
      <div className={styles.modalContent}>
        <Terms />
      </div>
    </Modal>
  );
};

export default TermsModal;
