'use client';
export default function Loading() {
  return (
    <div className="fixed inset-0 flex bg-[#fff] dark:bg-background items-center justify-center backdrop-blur-sm">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
