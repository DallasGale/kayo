import styles from "./styles.module.scss";

export interface CardProps {
  name: string;
  role: string;
  avatar: string;
}

const Card = ({ name, role, avatar }: CardProps) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <div className={styles.cardInner}>
          <picture className={styles.cardFront}>
            <img src={avatar} alt={name} className={styles.avatar} />
          </picture>
        </div>

        {/* <div className={styles.cardBack}>
          <h1>John Doe</h1>
          <p>Architect & Engineer</p>
          <p>We love that guy</p>
        </div> */}
      </div>
      {/* </div> */}
      <div>
        <h2 className="display-5">{name}</h2>
        <p>{role}</p>
      </div>
    </div>
  );
};
export default Card;
