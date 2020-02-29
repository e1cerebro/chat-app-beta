const generateMessage = (username = '', message) => {
    return {
        message: message,
        createdAt: new Date().getTime(),
        username
    };
}

const generateLocationMessage = (username,url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    };
}

module.exports = {
    generateMessage,generateLocationMessage
}