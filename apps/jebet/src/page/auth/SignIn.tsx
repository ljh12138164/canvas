import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function App() {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return <div>loading</div>;
  if (isSignedIn) return <Navigate to="/dashboard" />;
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
