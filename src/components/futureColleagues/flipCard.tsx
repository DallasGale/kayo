import styles from "./flip.module.scss";

export interface CardProps {
  name: string;
  role: string;
  avatar: string | null;
  description: string;
}
const FlipCard = ({ name, role, avatar, description }: CardProps) => {
  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardFront}>
            <div
              className={styles.cardAvatar}
              style={{ backgroundImage: `url(${avatar})` }}
            />
          </div>
          <div className={styles.cardBack}>
            <p>{description}</p>
          </div>
        </div>
      </div>
      <div className={styles.cardNameTitle}>
        <h2 className="display-5">{name}</h2>
        <p>{role}</p>
      </div>
    </>
  );
};

export default FlipCard;
