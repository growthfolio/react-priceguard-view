import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Loader personalizável
interface CandleLoaderProps {
  transparent?: boolean;
  size?: string;
  backgroundColor?: string;
  opacity?: string;
}

const CandleLoader: React.FC<CandleLoaderProps> = ({
  transparent = false,
  size = "w-32 h-32",
  backgroundColor = "",
  opacity = "bg-opacity-90",
}) => {
  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        transparent ? "bg-transparent" : `${backgroundColor} ${opacity}`
      }`}
    >
      <div className={size}>
        <DotLottieReact
          src="https://lottie.host/6ff49c3f-25f2-42b4-82c0-a0381ab6a2e3/kAw9kQZCKc.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default CandleLoader;