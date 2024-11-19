import { Modal } from "react-responsive-modal";
import styles from "./styles.module.scss";
interface Props {
  open: boolean;
  onCloseModal: () => void;
  question: string;
  answer: string;
}
const FaqModal = ({ open, onCloseModal, question, answer }: Props) => {
  return (
    <Modal open={open} onClose={onCloseModal} center>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{question}</h2>
        <p
          className={styles.modalParagraph}
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </Modal>
  );
};

export default FaqModal;
