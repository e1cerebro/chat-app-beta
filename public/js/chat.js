const socket = io();


const $messages = document.getElementById('messages')
const $sidebar = document.getElementById('sidebar')

//Templates
const messageTemplate = document.getElementById('message-template').innerHTML
const locationTemplate = document.getElementById('location-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML

//Options

const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true})

socket.on('message', (data) => {
 
    const html = Mustache.render(messageTemplate, {
        message: data.message,
        createdAt: moment(data.createdAt).format('h:mm a'),
        username: data.username
    })
    $messages.insertAdjacentHTML('beforebegin', html)
})

socket.on('roomData', ({room, users}) => {
  
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebar.innerHTML =  html
 
})


socket.on('locationMessage', (url) => {
    const locationHtml = Mustache.render(locationTemplate, {
        url: url.url,
        createdAt: moment(url.createdAt).format('h:mm a'),
        username: url.username
    })
    $messages.insertAdjacentHTML('beforebegin', locationHtml)
    
});
 
//add event listener
document.getElementById('chat-form').addEventListener('submit', (e) => {
    e.preventDefault()
    let messageBody = document.getElementById('messageBody').value;
    socket.emit('sendMessage', messageBody, (acknowledgement) => {
        console.log(acknowledgement);

    });
})

document.getElementById('sharelocation').addEventListener('click', (e) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('sharelocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, (acknowledgement) => {
                console.log(acknowledgement);
            });

        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
});

socket.emit('join', {username, room}, (error) =>{
    if(error) {
        alert(error)
        location.href = "/"
    }
});