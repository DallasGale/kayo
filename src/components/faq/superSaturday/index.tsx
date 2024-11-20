import Question from "../question";
import styles from "../styles.module.scss";
import { useState } from "react";
import FaqModal from "../../modals/faq";

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

        <FaqModal
          open={open}
          onCloseModal={onCloseModal}
          question={modalContent.question}
          answer={modalContent.answer}
        />
      </div>
    </section>
  );
};
export default SuperSaturday;

const questions = [
  {
    question: "What is Super Saturday LIVE?",
    answer:
      "Super Saturday LIVE offers LIVE, back-to-back AFL coverage on Fox Footy (available on Foxtel and Kayo Sports), showcasing multiple games without ad breaks during play. This offering provides uninterrupted viewing <strong>nationally for the first 8 rounds</strong> of the season, ensuring you don’t miss a moment of the action. Fox Footy on Kayo Sports and Foxtel will be the only place to watch the footy LIVE and in 4K on a Saturday: <ul class='default-ul'><li class='default-li'>For the entire home and away season in VIC, TAS and NT</li><li class='default-li'>For the first 10 rounds in NSW, QLD and ACT</li><li class='default-li'>For the first 8 rounds in WA and SA</li></ul>",
  },
  {
    question: "How can I watch Super Saturday LIVE?",
    answer:
      "You can watch our Super Saturday LIVE coverage on Fox Footy (available on Foxtel and Kayo Sports), giving you flexibility to watch on TV or stream on-the-go. Both platforms deliver LIVE coverage, with high-definition visuals and expert commentary.",
  },
  {
    question: "What makes Fox Footy’s coverage unique?",
    answer:
      "Fox Footy on Foxtel and Kayo Sports will be the only place to watch the footy LIVE and in 4K on a Saturday. With dedicated commentary teams, and LIVE insights, you get a premium AFL viewing experience.",
  },
  {
    question: "Will every game be shown in full on Super Saturday LIVE?",
    answer:
      "Yes, Super Saturday LIVE features complete live broadcasts of every game with no ad breaks during play, ensuring you enjoy every key moment from start to finish. Click here to see the full fixture:  <a href='https://www.afl.com.au/broadcast-guide-premiership' target='_blank' rel='noopener noreferrer'>https://www.afl.com.au/broadcast-guide-premiership</a>",
  },
];
