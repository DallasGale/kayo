import Question from "../question";
import styles from "../styles.module.scss";
import modalStyles from "../../modal/styles.module.scss";
import btnStyles from "../../button/styles.module.scss";
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
          <div className={modalStyles.modalContent}>
            <h2 className={modalStyles.modalTitle}>{modalContent.question}</h2>
            {/* <p> */}
            <p
              className={modalStyles.modalParagraph}
              dangerouslySetInnerHTML={{ __html: modalContent.answer }}
            />
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
      "All passionate AFL fans and budding broadcasters aged 18 and over living in Australia are eligible to enter. You just need to bring your best on-air energy and creativity!.",
  },
  {
    question: "What do I need to submit?",
    answer:
      "Create a 15–30 second video where you show off your personality and imagine you’re live on air with Fox Footy. Post it to your public social media account (Instagram, TikTok, Facebook, YouTube, or Vimeo), copy the link and paste it into our entry form. Please make sure your social profile of choice is public so we can view your submission. Then, add a short 100-word description of why you’re perfect for The Kayo Call Up. <a href='/submit' style='color: #000';>Submit your entry.</a>",
  },
  {
    question: "Which social media platforms can I use?",
    answer:
      "You can upload your video to Instagram, TikTok, Facebook, YouTube, or Vimeo. Just make sure your post is public and that you paste the link into our entry form (make sure you share the link to the video post and not your profile).",
  },
  {
    question: "What’s the deadline for entries?",
    answer:
      "Entries open on 7.00pm, 20 November, 2024, and close on 11:59pm AEDT on 11 December 2024. The competition goes for 3 weeks. Make sure to submit your entry within this timeframe.",
  },
  {
    question: "When is the shortlisting phase of the talent search?",
    answer:
      "The team at Fox Footy will be shortlisting talent 11 Dec 2024 – 20 January 2025.",
  },
  {
    question: "What is the prize?",
    answer:
      "<ul class='default-ul'><li class='default-li'>A paid on-air role for at least eight weeks of the season on Fox Footy’s Super Saturday LIVE broadcast - available on Kayo Sports and Foxtel.</li><li class='default-li'>Mentorship from Fox Footy’s industry-leading experts.</li><li class='default-li'>The chance to kickstart a long-term career in sports broadcasting.</li></ul>Check out the Terms and Conditions for more details and enter now to make 2025 your breakout year!",
  },
  {
    question: "How much will I get paid?",
    answer:
      "This will depend on the role selected and availability during our Super Saturday LIVE exclusivity window. For more information, please read our Terms and Conditions.",
  },
  {
    question: "What are the judges looking for?",
    answer:
      "Each entry will be individually judged based on literary and creative merit of the entire submission (video and 100-word or less submission).",
  },
  {
    question: "When will the winner be announced?",
    answer:
      "The winner will be announced in the week commencing 17 February 2025, so stay tuned! We will contact the winner via phone and email.",
  },
  {
    question: "Can I submit multiple entries?",
    answer:
      "No, only one entry per person is allowed. So make your video count!",
  },
  {
    question: "I don’t have professional equipment—can I still enter?",
    answer:
      "Absolutely! You don’t need fancy equipment; a smartphone video is perfect. Just focus on your energy, creativity, and personality.",
  },
];
