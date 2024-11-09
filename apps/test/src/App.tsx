import { useEffect } from "react";
import { client } from "./lib";

function App() {
  useEffect(() => {
    const socket = client.ws.$ws();
    socket.onmessage = (event) => {
      console.log(event.data);
    };
  }, []);
  return <></>;
}

export default App;
