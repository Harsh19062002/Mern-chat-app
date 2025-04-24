import express from 'express'
import dotenv from "dotenv";
import router from './routes/auth.js'
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/messageroute.js";
import cors from 'cors'
import {app,server} from './lib/socket.js'

import path from "path";



dotenv.config()

app.use(express.json({ limit: '50mb' }));
const PORT = process.env.PORT
const _dirname = path.resolve();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use('/auth',router)
app.use("/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.get('/',(req,res)=>{
    res.send('Backend Is Working')
})

server.listen(PORT,()=>{
    console.log('Server is running on Port',PORT)
    connectDB()
})