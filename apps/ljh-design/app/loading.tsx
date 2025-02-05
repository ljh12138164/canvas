'use client';
export default function Loading() {
  return (
    <div className="fixed inset-0 flex bg-[#fff] dark:bg-background  items-center justify-center  backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <svg
            className="animate-draw absolute"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>加载中</title>
            <path
              d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-spin origin-center"
            />
            <path
              d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="28"
              strokeDashoffset="28"
              className="animate-draw-path"
            />
          </svg>
        </div>
        <p className="text-muted-foreground text-lg font-medium">设计加载中...</p>
      </div>
    </div>
  );
}
