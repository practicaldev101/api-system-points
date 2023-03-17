const { io } = require("socket.io-client");
const passport = require("passport");
require("../security/passport")

const controller = {};

controller.notify = (req, res)=>{
    
    const { type, message } = req.body;
    try {
        const socket = io(process.env.BOT_URL, {timeout: 5000});
        socket.emit("notification", JSON.stringify({type, message}));
        socket.on("notification", (message)=>{
            const { done } = JSON.parse(message);
            if (done){
                return res.status(200).json({status: "OK", message:"Message has been notified."});
            }
            res.status(400).json({status: "OK", message:"Message has not been notified."});
        })
    } catch (error) {
        res.status(400).json({status: "OK", message:"Something wrong has ocurred."})
    }
    
}
    

module.exports = controller;