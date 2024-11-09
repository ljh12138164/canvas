"use client";

import { useBoardEditQuery } from "@/hook/query/useBoardQuery";

import Link from "next/link";
import { Loader2, TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import Canvas from "./Canvas";

export default function Edit({
  userId,
  params,
}: {
  userId: string;
  params: string;
}) {
  const { isLoading, error, data } = useBoardEditQuery({ id: params, userId });

  if (isLoading)
    return (
      <main className="h-full w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-700" />
      </main>
    );
  if (error || data?.length === 0) {
    return (
      <div className="h-full w-full flex flex-col gap-y-5 items-center justify-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <p className="text-muted-foreground">获取不到画布信息</p>
        <Button variant="secondary">
          <Link href="/board">返回</Link>
        </Button>
      </div>
    );
  }
  if (data?.length) {
    return (
      <>
        <Canvas userId={userId} data={data[0]} />
        {/* // <div className='h-full w-full flex flex-col '>
        //   <div className='w-full h-[64px] ' />
        //   <div className='w-full grid grid-cols-[99px,1fr] h-full'>
        //     <div className=' h-full'></div>
        //     <div className='flex'>
        //       <div className='flex flex-col'>
        //         <div className='h-[52px]'></div>
        //         <div className='flex-1 '></div>
        //         <div className='h-[52px]'></div>
        //       </div>
        //     </div>
        //   </div>
        // </div> */}
      </>
    );
  }
}
