import { io } from "socket.io-client";

const URL = import.meta.env.VITE_HOST;

const socket = io.connect(URL);

socket.on("socketId", (socketID) => {
  console.log(socketID);
});

export default socket;
