import styles from "./styles.module.scss";
import Plus from "../../assets/plus.svg";
interface QuestionProps {
  label: string;
  onClick: () => void;
}

const Question = ({ label, onClick }: QuestionProps) => {
  return (
    <button className={styles.question} onClick={onClick}>
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
