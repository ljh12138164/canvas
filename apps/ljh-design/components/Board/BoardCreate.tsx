import { useBoardUserQuery } from "@/hook/query/useBoardQuery";
import { FaArrowRight, FaStar } from "react-icons/fa6";
import { Button } from "../ui/button";

const BoardCreate = ({ userId }: { userId: string }) => {
  const { data } = useBoardUserQuery({ userid: userId });

  return (
    <section className="p-2 h-[200px] flex justify-center items-center">
      <div className=" bg-gradient-to-r grid  grid-cols-[168px,1fr] from-blue-700 to-blue-300 w-full h-full rounded-lg p-2">
        <header className="w-full h-full p-6 flex justify-center items-center">
          <div className="bg-white/50 rounded-full size-28  flex justify-center items-center ">
            <div className="bg-white rounded-full size-20 flex  justify-center items-center z-10">
              <FaStar className="text-yellow-500 text-[2rem] animate-pulse" />
            </div>
          </div>
        </header>
        <main className="flex flex-col justify-center gap-2">
          <div className="text-white text-2xl ">
            {data?.length ? "创建你的画布以开始使用" : "创建第一个画布"}
          </div>
          <Button
            variant="outline"
            className="w-fit flex items-center gap-2 justify-center"
          >
            <span>开始</span>
            <FaArrowRight />
          </Button>
        </main>
      </div>
    </section>
  );
};

export default BoardCreate;
