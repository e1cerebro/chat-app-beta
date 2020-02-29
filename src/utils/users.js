const users = [];

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
    //clean data -
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate data
    if(!username || !room) return { error: 'Username and room are required!'}

    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    //validate username
    if(existingUser) return { error: 'Username is in use!'}

    //store user
    const user = { id, username, room }

    users.push(user)

    return {user}

}


const removeUser = (id) => {

    const index = users.findIndex(user => {
        return user.id === id;
    })

    if(index !== -1){
        return users.splice(index, 1)[0]
    }

}



const getUser = (id) => { 

    const user = users.find(user => {
        return user.id === id
    })

    if(user) return user;

    return undefined;

}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const user = users.filter(user => {
        return user.room === room
    })

    return user
}

module.exports = {
    getUsersInRoom,
    getUser,
    removeUser,
    addUser
}