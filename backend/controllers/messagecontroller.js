import Message from "../models/messagemodel.js";
import User from "../models/usermodel.js";
import cloudinary from "../lib/cloudinary.js";
import { getReciverSocketId, io } from "../lib/socket.js";



export const getUser = async (req, res) => {
    try {
        const loggedInUser = req.user._id
        const filteredUser = await User.find({_id:{$ne:loggedInUser}}).select("-password");
        res.status(200).json(filteredUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }

}

export const getMessages = async (req, res) => {
    try {
       const {id:userToChatId}= req.params;
       const senderId = req.user._id
       const messages = await Message.find({
        $or:[
            {senderId:senderId,receiverId:userToChatId},
            {senderId:userToChatId,receiverId:senderId}
        ]
       })
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }

}

export const sendMessage = async (req,res) =>{
    try {
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id

        let imageUrl 
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        const newmessage = await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await newmessage.save()

       const receiverSocketId = getReciverSocketId(receiverId)
       if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newmessage)
        
       }

        res.status(201).json(newmessage);
    } 

        
     catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}