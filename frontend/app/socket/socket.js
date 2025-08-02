"use client";

import { io } from "socket.io-client";


export const socket = io("onewordbackend.timhausl.com", {
  transports: ["websocket"]});