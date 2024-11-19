import styles from "./styles.module.scss";
import { useSpring, a } from "@react-spring/web";

export interface CardProps {
  name: string;
  role: string;
  avatar: string | null;
}

const Card = ({ name, role, avatar }: CardProps) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <div>
          <div className={styles.cardInner}>
            <div className={styles.cardFront}>
              <div className={styles.cardAvatar}>
                <div
                  className={styles.image}
                  style={{ backgroundImage: `url(${avatar})` }}
                />
              </div>
            </div>

            {/* <picture className={styles.cardFront}>
              {avatar !== null && (
                <img src={avatar} alt={name} className={styles.avatar} />
              )}
            </picture> */}

            <div className={styles.cardBack}>
              <p>
                Recently elevated to Legend status in the AFL Hall of Fame,
                Jason Dunstall’s on-field career speaks for itself. As an
                expert, Dunstall now adds his analysis on game day and provides
                plenty of laughs alongside other larrikins on Bounce.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.cardNameTitle}>
        <h2 className="display-5">{name}</h2>
        <p>{role}</p>
      </div>
    </div>
  );
};
export default Card;
