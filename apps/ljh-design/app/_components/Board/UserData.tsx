"use client";
import useUser from "@/app/_hook/useUser";
import { Skeleton } from "../ui/skeleton";
import ChangeUserData from "./ChangeUserData";
// import ChangeUserData from './ChangeUserData';
const UserData = () => {
  const { user, loading } = useUser({ redirects: true });
  return (
    <div className="h-full w-full flex flex-col gap-5">
      {!loading && user ? (
        <ChangeUserData data={user} />
      ) : (
        <>
          <Skeleton className="w-full h-[220px]" />
          <Skeleton className="w-full h-[220px]" />
          <Skeleton className="w-full h-[220px]" />
          <Skeleton className="w-full h-[220px]" />
        </>
      )}
    </div>
  );
};

export default UserData;
