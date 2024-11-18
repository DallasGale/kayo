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

const HaveAQuestion = () => {
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
    <section className={styles.section} id="have-a-question">
      <div className="content">
        <h6 className="display-1">Have a Question?</h6>
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
        <div className={styles.seeMore}>
          <button className={`${btnStyles.btn} ${btnStyles.secondaryBtn}`}>
            <span>See More</span>
          </button>
        </div>
      </div>
    </section>
  );
};
export default HaveAQuestion;

const questions = [
  {
    question: "Who can enter the competition?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
  {
    question: "What do I need to submit?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
  {
    question: "Which social media platforms can I use?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
  {
    question: "What’s the deadline for entries?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
  {
    question: "When is the shortlisting phase of the talent search?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
  {
    question: "What is the prize?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
  {
    question: "How much will I get paid?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
  {
    question: "What are the judges looking for?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
  {
    question: "When will the winner be announced?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
  {
    question: "Can I submit multiple entries?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
  {
    question: "I don’t have professional equipment—can I still enter?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up.",
  },
];
