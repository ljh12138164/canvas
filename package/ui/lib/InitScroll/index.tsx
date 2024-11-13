import React, { useEffect, useRef } from "react";

interface InitScrollProps {
  children: React.ReactNode;
}
const useInfinScroll = ({ children }: InitScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("scroll", () => {
        console.log("scroll");
      });
    }
  }, []);
  const InfiniteComponent = () => {
    return (
      <div ref={ref}>
        {children}
        <div></div>
      </div>
    );
  };
  return { InfiniteComponent };
};

export default useInfinScroll;
