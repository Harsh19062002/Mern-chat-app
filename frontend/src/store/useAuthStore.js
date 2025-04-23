import axios from "axios";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const BASE_URL= import.meta.env.MODE === "development" ? "http://localhost:5000" : "https://mern-chat-app-t7iz.onrender.com";

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile:false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket:null,

  checkAuth: async () =>{
    try {
        const respone = await axiosInstance.get("/auth/check")

        set({authUser:respone.data})

        
    } catch (error) {
        console.log(error)
        set({authUser:null})
        get().connectSocket()
        
    }
    finally{
        set({isCheckingAuth:false})
    }
  },

 signup: async(data) =>{
    set({ isSigningUp: true });
    try {
       const response = await axiosInstance.post("/auth/signup",data)
       set({authUser:response.data})
        toast.success("Account Created Successfully")
        get().connectSocket()
        
    } catch (error) {
        toast.error(error.response.data.message);
        
    }
    finally{
        set({ isSigningUp: false });
    }
 },

 login: async(data)=>{
    set({isLoggingIn:true})
    try {
        const response = await axiosInstance.post("/auth/login",data)
        set({authUser:response.data})
        toast.success("Logged In Successfully")
        get().connectSocket()
        
    } catch (error) {
        toast.error(error.response.data.message)
        
    }
    finally{
        set({isLoggingIn:false})
    }
 },

 logout: async () =>{
    try {
        await axiosInstance.post("/auth/logout")
        set({authUser:null})
        toast.success("Logged Out Successfully")
        get().disconnectSocket();
        
    } catch (error) {
        toast.error(error.response.data.message)

        
    }
 },

 updateProfile: async (data)=>{
    set({isUpdatingProfile:true})
    try {
        const response = await axiosInstance.put("/auth/update",data)
        set({authUser:response.data})
        toast.success("Profile Updated Successfully")
        
    } catch (error) {
        toast.error(error.response.data.message)
        
    }
    finally{
        set({isUpdatingProfile:false})
    }
 },

 connectSocket:  () =>{
    const {authUser} = get()
    if (!authUser || get().socket?.connected) return;
 const socket = io(BASE_URL,{query:{
    userId:authUser._id,
 },
})
 socket.connect()

 set({socket:socket})
 socket.on("getOnlineUsers", (userIds)=>{
    set({onlineUsers:userIds})


 })

 

 },

 disconnectSocket: () =>{
    if(get().socket?.connected) get().socket.disconnect();


 },

 




}));