import { motion, useScroll, useSpring } from "framer-motion";
import styles from "./styles.module.scss";

import Carousel from "react-multi-carousel";

const FutureColleaguesSlider = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <div>
      {/* <motion.div className={styles.progressBar} style={{ scaleX }} /> */}
      <div className={styles.container}>
        <Carousel responsive={responsive}>
          {collegues.map((collegue) => {
            return (
              <>
                <div>Item 2</div>
                <div>Item 2</div>
                <div>Item 3</div>
                <div>Item 4</div>
              </>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
};

export default FutureColleaguesSlider;

type CollegueType = {
  avatar: string;
  name: string;
  role: string;
};
const collegues: CollegueType[] = [
  {
    avatar: "/images/collegues/collegue1.jpg",
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: "/images/collegues/collegue1.jpg",
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: "/images/collegues/collegue1.jpg",
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: "/images/collegues/collegue1.jpg",
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: "/images/collegues/collegue1.jpg",
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: "/images/collegues/collegue1.jpg",
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: "/images/collegues/collegue1.jpg",
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: "/images/collegues/collegue1.jpg",
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: "/images/collegues/collegue1.jpg",
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: "/images/collegues/collegue1.jpg",
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: "/images/collegues/collegue1.jpg",
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: "/images/collegues/collegue1.jpg",
    name: "John Doe",
    role: "Senior Producer",
  },
];
