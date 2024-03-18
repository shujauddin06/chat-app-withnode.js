let generateMessage = (username , text) => {
    return {
        username,
        text,
        createdAt:new Date().getTime()
    }
}

let generateLocation = (username,url) => {
    return {
        username,
        url:url,
        createdAt:new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocation
}