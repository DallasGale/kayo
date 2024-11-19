import styles from "./styles.module.scss";
import { useSpring, a } from "@react-spring/web";

export interface CardProps {
  name: string;
  role: string;
  avatar: string | null;
  description: string;
}

const Card = ({ name, role, avatar, description }: CardProps) => {
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
              <p>{description}</p>
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
