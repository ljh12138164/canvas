"use client";
import useUser from "@/hook/useUser";
import { Skeleton } from "../ui/skeleton";
import { useUserQuery } from "@/hook/query/useUserQuery";
import ChangeUserData from "./ChangeUserData";
const UserData = () => {
  const { isLoading } = useUser();
  const { data, isLoading: userDataLoading } = useUserQuery();
  return (
    <div className="h-full w-full flex flex-col gap-5">
      {!isLoading && !userDataLoading && data ? (
        <ChangeUserData data={data} />
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
