import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import btnStyles from "../button/styles.module.scss";
import HeroImg from "../../assets/hero.svg";
import GoalPosts from "../../assets/generic-seated-aussie-rules-stadium-600nw.png";
import TermsModal from "../modals/terms";

const Animation = () => {
  // Terms Modal
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const handleOpenModal = () => {
    onOpenModal();
  };

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsAnimating(true);
    });

    return () => {
      setIsAnimating(false);
    };
  }, []);

  return (
    <>
      <div className={styles.scene}>
        <div
          className={styles.animationContainer}
          style={{
            visibility: isAnimating ? "visible" : "hidden",
            willChange: "transform",
          }}
        >
          {/* scene */}

          {/* 1. animate green bar upward */}
          <div
            className={`${styles.greenBar} ${isAnimating ? styles.animate : ""}`}
          />
          <div
            className={`${styles.greenBg} ${isAnimating ? styles.animate : ""}`}
          />

          <div className={styles.logoMessageContainer}>
            <picture
              className={`${styles.logo} ${isAnimating ? styles.animate : ""}`}
            >
              <img
                src={HeroImg.src}
                alt="The Kayo Callup"
                loading="eager"
                decoding="async"
              />
            </picture>
            <div
              className={`${styles.message} ${isAnimating ? styles.animate : ""}`}
            >
              <h2 className={`display-1 text-center ${styles.display1}`}>
                THE SEARCH TO UNEARTH THE NEWEST MEMBER OF FOX FOOTY’S ON-AIR
                TEAM.
              </h2>
              <div className={styles.submitLockup}>
                <a
                  href="/submit"
                  className={`${styles.btn} ${btnStyles.btn} ${btnStyles.primaryBtn} ${btnStyles.largeBtn}  ${isAnimating ? styles.animate : ""}`}
                >
                  <span>Submit your entry</span>
                </a>
                {/* <Button label="Submit your entry" isLarge link="/submit" /> */}
                <p className={`small-print text-center ${styles.smallPrint}`}>
                  Must be 18+ to enter and a current Australian resident.{" "}
                  <button
                    className="small-print  text-button"
                    onClick={handleOpenModal}
                  >
                    TERMS AND CONDITIONS APPLY
                  </button>
                </p>
              </div>
            </div>
          </div>

          <picture
            className={`${styles.goalPosts} ${isAnimating ? styles.animate : ""}`}
          >
            <img src={GoalPosts.src} loading="eager" decoding="async" />
          </picture>
        </div>
        <TermsModal open={open} onCloseModal={onCloseModal} />
      </div>
    </>
  );
};

export default Animation;
