import { useState } from "react";
import styles from "./flip.module.scss";
import { useIsMobile } from "../../hooks/useIsMobile";

export interface CardProps {
  name: string;
  role: string;
  avatar: string | null;
  description: string;
}
const FlipCard = ({ name, role, avatar, description }: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <div
        className={`${styles.card}  ${isFlipped ? styles.flipped : ""}`}
        onClick={() => isMobile && setIsFlipped(!isFlipped)}
        onMouseEnter={() => !isMobile && setIsFlipped(true)}
        onMouseLeave={() => !isMobile && setIsFlipped(false)}
      >
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
