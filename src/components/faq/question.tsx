import styles from "./styles.module.scss";
interface QuestionProps {
  label: string;
  onClick: () => void;
}

const Question = ({ label, onClick }: QuestionProps) => {
  return (
    <button className={styles.question} onClick={onClick}>
      <div className={styles.content}>
        <p className={styles.label}>{label}</p>
        <span className={styles.toggle}>+</span>
      </div>
    </button>
  );
};

export default Question;
