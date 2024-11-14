import styles from "./styles.module.scss";
import Plus from "../../assets/plus.svg";
interface QuestionProps {
  label: string;
}

const Question = ({ label }: QuestionProps) => {
  return (
    <button className={styles.question}>
      <div className={styles.content}>
        <p className={styles.label}>{label}</p>
        <span
          style={{ backgroundImage: `url(${Plus.src})` }}
          className={styles.toggle}
        >
          +
        </span>
      </div>
    </button>
  );
};

export default Question;
