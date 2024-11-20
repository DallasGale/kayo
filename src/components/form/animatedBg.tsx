import React from "react";
import styles from "./animated.module.scss";

const AnimatedBg = () => {
  const animations = [
    "moveLeftToRight",
    "moveRightToLeft",
    "moveTopToBottom",
    "moveBottomToTop",
    "moveDiagonalTLBR",
    "moveDiagonalTRBL",
  ];

  const getRandomStyle = () => ({
    "--duration": `${5 + Math.random() * 2}s`,
    "--delay": `${Math.random() * 5}s`,
  });

  const getRandomAnimation = () =>
    animations[Math.floor(Math.random() * animations.length)];

  return (
    <div className={styles.canvas}>
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className={`${styles.footballContainer} ${styles[getRandomAnimation()]}`}
          style={getRandomStyle() as React.CSSProperties}
        >
          <div className={styles.football} />
        </div>
      ))}
    </div>
  );
};

export default AnimatedBg;
