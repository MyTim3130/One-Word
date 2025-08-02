"use client";

import { io } from "socket.io-client";


export const socket = io("85.215.231.160:3002", {
  transports: ["websocket"]});