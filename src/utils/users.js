let users = []

// create user
let addUser = ({id , username , room }) => {
    // clear data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    // validate empty data
    if(!username || !room) {
        return {
            error:'username and room required'
        }
    }
    // boolean existing user
    let existinguser = users.find((user)=> {
        return user.username === username && user.room === room
    })
    // error existing user
    if(existinguser) {
        return {
            error:'user is in use'
        }
    }
    // store user
    let user = {id , username , room}
    users.push(user)
    // return user
    return {user}
}

// remove user
let removeUser = (id)=> {
    let index = users.findIndex((user) => 
        user.id === id
)
    if(index !== -1){
        return users.splice(index,1)
    }
}

// getuser 
let getUser = (id) => {
    return users.find((user) => 
        user.id === id
)
}
// getUserRoom
let getUserRoom = (room) => {
    room = room.trim().toLowerCase()
return users.filter((user) => user.room === room) ;
} 

module.exports = {
    addUser,
    getUser,
    removeUser,
    getUserRoom
}

