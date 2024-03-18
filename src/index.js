const path = require('path')
const http = require('http')

const express = require('express')
const socketio = require('socket.io')
// const Filter = require('bad-words')

const {generateMessage , generateLocation} = require('./utils/messages')
const {addUser,removeUser,getUser,getUserRoom } = require('./utils/users')

let publicPath = path.join(__dirname , '../public')

let app = express()
let server = http.createServer(app)
let io = socketio(server)
app.use(express.static(publicPath))

io.on('connection' , (socket) => {
    console.log(`new connection`);
    
    socket.on('join' , (object , cb) => {
        let {error , user} = addUser({id: socket.id , ...object })
        if(error) {
            return cb(error)
        }
        socket.join(user.room)
        socket.emit('message' , generateMessage('Welcome!'));

        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} as joined the room`))
        io.to(user.room).emit('userData' , {
            room:user.room,
            users:getUserRoom(user.room)
        })
        cb()

    })



  
    
    socket.on('sentmessage', (msg ,cb) => {
        let user = getUser(socket.id)
        // let filter = new Filter()
        // if(filter.isProfane(msg)){
        //     return cb('proganity is not allowed!')
        // }
        io.emit('message' ,generateMessage(user.username,msg))
        cb()
    })
    socket.on('sharelocation', (location , cb) => {
        let user = getUser(socket.id)

        io.emit('location-message' , generateLocation(user.username,location))
        cb();
    })

    socket.on('disconnect' , () => {

        let user = removeUser(socket.id)
        if(user){
            io.to(user[0].room).emit('message' , generateMessage(`${user[0].username} has left!`))
            io.to(user[0].room).emit('userData' , {
                room:user[0].room,
                users:getUserRoom(user[0].room)
            })
            
 }
    })

})

let port = process.env.PORT || 3000

server.listen(port , () => {
    console.log(`server is running on port ${port}`);
    
})