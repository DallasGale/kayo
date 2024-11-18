import { motion, useScroll, useSpring } from "framer-motion";
import styles from "./styles.module.scss";
import { Virtual, Navigation, Pagination, Scrollbar } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

import Brown from "../../assets/collegues/Brown.jpg";
import Buckley from "../../assets/collegues/Buckley.jpg";
import Eddie from "../../assets/collegues/eddie.jpg";
import Jones from "../../assets/collegues/Jones.jpg";
import Loughnan from "../../assets/collegues/Loughnan.jpg";
import Riewoldt from "../../assets/collegues/Riewoldt.jpg";
import Underwood from "../../assets/collegues/Underwood.jpg";
import type { CardProps } from "./card";
import Card from "./card";
import { useEffect, useState } from "react";

type CollegueType = {
  avatar: string;
  name: string;
  role: string;
};
const collegues: CardProps[] = [
  {
    avatar: Brown.src,
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: Buckley.src,
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: Eddie.src,
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: Jones.src,
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: Loughnan.src,
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: Riewoldt.src,
    name: "John Doe",
    role: "Senior Producer",
  },
  {
    avatar: Underwood.src,
    name: "John Doe",
    role: "Senior Producer",
  },
];
const FutureColleaguesSlider = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render Swiper after component is mounted
  if (!mounted) {
    return null; // or a loading placeholder
  }

  console.log({ mounted });
  return (
    <div className={styles.sliderWrapper}>
      <Swiper
        scrollbar={{
          hide: true,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Virtual, Navigation, Pagination, Scrollbar]}
        virtual
        spaceBetween={20}
        slidesPerView={"auto"}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        className="mySwiper"
      >
        {collegues.map((collegue, index) => (
          <SwiperSlide
            style={{ width: "auto" }}
            key={`${collegue}`}
            virtualIndex={index}
          >
            <Card {...collegue} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FutureColleaguesSlider;
