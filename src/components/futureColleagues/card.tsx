import { useSpring, a } from "@react-spring/web";
import styles from "./styles.module.scss";

export interface CardProps {
  name: string;
  role: string;
  avatar: string;
}

const Card = ({ name, role, avatar }: CardProps) => {
  return (
    <>
      <div className={styles.card}>
        {/* <div className={styles.cardInner}> */}
        <picture className={styles.cardFront}>
          <img src={avatar} alt={name} className={styles.avatar} />
        </picture>

        {/* <div className={styles.cardBack}>
          <h1>John Doe</h1>
          <p>Architect & Engineer</p>
          <p>We love that guy</p>
        </div> */}
      </div>
      {/* </div> */}
      <h2 className="display-3">{name}</h2>
      <p>{role}</p>
    </>
  );
};
export default Card;

// import { useSpring, a } from "@react-spring/web";
// import styles from "./styles.module.scss";
// import { useState } from "react";

// export interface CardProps {
//   name: string;
//   role: string;
//   avatar: string;
// }

// const Card = ({ name, role, avatar }: CardProps) => {
//   const [flipped, set] = useState(false);

//   console.log({ flipped });
//   const { transform, opacity } = useSpring({
//     opacity: flipped ? 1 : 0,
//     transform: `perspective(1000px) rotateY(${flipped ? 180 : 0}deg)`,
//     config: { mass: 5, tension: 500, friction: 80 },
//   });
//   return (
//     <>
//       <div
//         className={styles.card}
//         onMouseEnter={() => set((state) => !state)}
//         onMouseLeave={() => set((state) => !state)}
//       >
//         <a.div
//           className={`${styles.c} ${styles.cardFront}`}
//           style={{
//             opacity: opacity.to((o) => 1 - o),
//             transform,
//           }}
//         >
//           <div className={styles.cardFront}>
//             <img src={avatar} alt={name} className={styles.avatar} />
//           </div>
//         </a.div>
//         <a.div
//           className={`${styles.cardBack}`}
//           style={{
//             opacity,
//             transform,
//             rotateX: "180deg",
//           }}
//         >
//           <h1>John Doe</h1>
//           <p>Architect & Engineer</p>
//           <p>We love that guy</p>
//         </a.div>
//       </div>
//       <h2 className="display-3">{name}</h2>
//       <p>{role}</p>
//     </>
//   );
// };
// export default Card;
