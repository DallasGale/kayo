import Question from "./question";
import styles from "./styles.module.scss";
import btnStyles from "../button/styles.module.scss";

type Question = {
  question: string;
  answer: string;
};
interface QuestionProps {
  questions: Question[];
}
const HaveAQuestion = ({ questions }: QuestionProps) => {
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
