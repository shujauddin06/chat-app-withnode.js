let socket =  io()

let $form = document.querySelector('#form')
let $input = $form.querySelector('input')
let $location = document.querySelector('#location')
let $message = document.querySelector('#message')
let $message_template = document.querySelector('#message-template').innerHTML
let $location_template = document.querySelector('#location-template').innerHTML
let $sidebar_template = document.querySelector('#sidebar-template').innerHTML

let {username , room} = Qs.parse(location.search, {ignoreQueryPrefix:true})

let scroll = () => {
    // new message element
    const $newMessage = $message.lastElementChild
    // height of new message with its margin
    const newmessagestyle = getComputedStyle($newMessage)
    const newmessagemargin = parseInt(newmessagestyle.marginBottom)
    const newmessageheight = $newMessage.offsetHeight + newmessagemargin
    // visible height
    const visibleheight = $message.offsetHeight
    // height of messages container
    const containerheight = $message.scrollHeight
    // how far have i scrolled from top
    const scrolloffset = $message.scrollTop + visibleheight

    if ( containerheight - newmessageheight <= scrolloffset){
        $message.scrollTop = $message.scrollHeight
    }

}


socket.on('message' , (msg)=> {
    console.log(msg);
    let html = Mustache.render($message_template , {
        username:msg.username,
        message:msg.text,
        createdAt:moment(msg.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend' , html)
    scroll()
})

socket.on('location-message' , (url) => {
    console.log(url);
    let html = Mustache.render($location_template, {
        username:url.username,
        url:url.url,
        createdAt:moment(url.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend' , html)
    scroll()
})
socket.on('userData' , ({room , users}) => {
    let html = Mustache.render($sidebar_template,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
    
})
$form.addEventListener('submit' , (e) => {
    e.preventDefault()
    let message = e.target.elements.message.value
    socket.emit('sentmessage' , message , (error) => {
        if(error) {
            return console.log(error);
            
        }
        console.log('message delivered!');
        $input.value = ''
        $input.focus();
        
    })
})

$location.addEventListener('click',(e)=> {
    e.preventDefault();
    if(!navigator.geolocation){
        return alert('your brouser dont support the geolocation ')
    }
    navigator.geolocation.getCurrentPosition((position)=> {
        socket.emit('sharelocation', `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}` , () => { console.log(`location shared`);
        })
    })
})

socket.emit('join' , {username , room} , (error) => {
        if(error) {
            alert(error)
            location.href = '/'
        }
})