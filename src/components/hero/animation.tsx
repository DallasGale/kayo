import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import HeroImg from "../../assets/hero.svg";
import GoalPosts from "../../assets/generic-seated-aussie-rules-stadium-600nw.png";

const Animation = () => {
  const [liftBar, setLiftBar] = useState(false);

  useEffect(() => {
    setLiftBar(true);
  }, []);
  return (
    <div className={styles.scene}>
      {/* scene */}

      {/* 1. Lift green bar upward */}
      <div className={`${styles.greenBar} ${liftBar ? styles.lift : ""}`}></div>
      <div className={`${styles.greenBg} ${liftBar ? styles.lift : ""}`}></div>

      <div className={`${styles.logo} ${liftBar ? styles.lift : ""}`}>
        <img src={HeroImg.src} alt="The Kayo Callup" />
      </div>

      <div className={`${styles.goalPosts} ${liftBar ? styles.lift : ""}`}>
        <img src={GoalPosts.src} />
      </div>
    </div>
  );
};

export default Animation;
