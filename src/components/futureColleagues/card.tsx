import styles from "./styles.module.scss";

export interface CardProps {
  name: string;
  role: string;
  avatar: string;
}

const Card = ({ name, role, avatar }: CardProps) => {
  return (
    <>
      <div className={styles.card}>
        <img src={avatar} alt={name} className={styles.avatar} />
      </div>
      <h2 className="display-3">{name}</h2>
      <p>{role}</p>
    </>
  );
};
export default Card;
