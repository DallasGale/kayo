import { useLottie } from "lottie-react";
import animationData from "../../assets/lotti/confetti.json";

const Confetti = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { View, animationContainerRef } = useLottie(defaultOptions);
  return (
    <div>
      <div ref={animationContainerRef} />
    </div>
  );
};
export default Confetti;
