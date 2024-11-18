import Question from "../question";
import styles from "../styles.module.scss";
import btnStyles from "../../button/styles.module.scss";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useState } from "react";

type Question = {
  question: string;
  answer: string;
};

const SuperSaturday = () => {
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [modalContent, setModalContent] = useState({
    question: "",
    answer: "",
  });

  const handleOpenModal = (question: string, answer: string) => {
    setModalContent({ question, answer });
    onOpenModal();
  };
  return (
    <section className={styles.section} id="super-saturday-live">
      <div className="content">
        <h6 className="display-1">Super Saturday Live</h6>
        <div className={styles.questionsList}>
          {questions.map(({ question, answer }) => {
            return (
              <Question
                label={question}
                onClick={() => handleOpenModal(question, answer)}
              />
            );
          })}
        </div>

        <Modal open={open} onClose={onCloseModal} center>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{modalContent.question}</h2>
            {/* <p> */}
            <p className={styles.modalParagraph}>{modalContent.answer}</p>
          </div>
        </Modal>
        {/* Modal */}
        {/* Answer */}
      </div>
    </section>
  );
};
export default SuperSaturday;

const questions = [
  {
    question: "What is Super Saturday LIVE?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
  {
    question: "How can I watch Super Saturday LIVE?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
  {
    question: "What makes Fox Footy’s coverage unique?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
  {
    question: "Will every game be shown in full on Super Saturday LIVE?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
];
