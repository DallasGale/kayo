import Question from "./question";
import styles from "./styles.module.scss";
import btnStyles from "../button/styles.module.scss";

type Question = {
  question: string;
  answer: string;
};

const HaveAQuestion = () => {
  return (
    <section className={styles.section} id="have-a-question">
      <div className="content">
        <h6 className="display-1">Have a Question?</h6>
        <div className={styles.questionsList}>
          {questions.map(({ question, answer }) => {
            return <Question label={question} />;
          })}
        </div>

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
    answer: "You can apply by filling out the form on the website.",
  },
  {
    question: "What do I need to submit?",
    answer: "The deadline is 31st of December.",
  },
  {
    question: "Which social media platforms can I use?",
    answer: "The prize is a 6 month internship at Kayo.",
  },
  {
    question: "What’s the deadline for entries?",
    answer: "The prize is a 6 month internship at Kayo.",
  },
  {
    question: "When is the shortlisting phase of the talent search?",
    answer: "The prize is a 6 month internship at Kayo.",
  },
  {
    question: "What is the prize?",
    answer: "The prize is a 6 month internship at Kayo.",
  },
  {
    question: "How much will I get paid?",
    answer: "The prize is a 6 month internship at Kayo.",
  },
  {
    question: "What are the judges looking for?",
    answer: "The prize is a 6 month internship at Kayo.",
  },
  {
    question: "When will the winner be announced?",
    answer: "The prize is a 6 month internship at Kayo.",
  },
  {
    question: "Can I submit multiple entries?",
    answer: "The prize is a 6 month internship at Kayo.",
  },
  {
    question: "I don’t have professional equipment—can I still enter?",
    answer: "The prize is a 6 month internship at Kayo.",
  },
];
