//Requirements - discord.js (obviously), express (for web server), 
//fetch (to get owl-o-rama), and fs (to load Discord Bot auth token)
const express = require('express');
const Discord = require('discord.js')
const fetch = require("node-fetch")
const fs = require('fs')

//sets up Express and Discord
const app = express();
const client = new Discord.Client()

//getOwl method - calls the owl-o-rama API to GET the URL of an owl image, 
//then gets the URL from the JSON response
const getOwl = async () => {
    return await fetch('https://us-central1-petting-zoo-v1.cloudfunctions.net/owl-o-rama-v2test')
        .then(response => response.json())
        .then(json => json.url);
}

//postOwl method - takes input URL and POSTS to owl-o-rama API
//then returns the response (success/fail)
const postOwl = async (url) => {
    let message = `url=${url}`
    //console.log(sending)
    return await fetch ('https://us-central1-petting-zoo-v1.cloudfunctions.net/owl-o-rama-v2test', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        //mode: 'cors', // no-cors, *cors, same-origin
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        //redirect: 'follow', // manual, *follow, error
        //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: message // body data type must match "Content-Type" header
    })
    .then (res => res.text())
}


//Web Server required for Cloud Run
app.get('/', (req, res) => {
    res.send('There\'s no owls here!');
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`helloworld: listening on port ${port}`);
});

//Discord Bot Client
client.on('ready', () => {
    console.log(`Logged in as
${client.user.tag}!`)
})
client.on('message', message => {
    //GET Owl functionality - if message is ".owl", retrieve and send an owl
    if (message.content == '.owl') {
        getOwl()
            .then(res => {
                console.log('Summoning Owl: ' + res)                    
                message.channel.send(res);
            })
    }
    //POST Owl functionality - if message meets owl requirements (".owlAdd [url]", add an owl to the rookery
    if (message.content.startsWith('.owlAdd ')) {
        //Data Validation steps to get clean URL
        console.log('Message = ' + message.content)
        let url = message.content.replace('.owlAdd','').replace(/\s/g,'')
        console.log('URL = ' + url)
        
        //POST Owl command - make a function for this!
        postOwl(url)
        //THEN return the response in a message
        .then(res => {
            console.log('Attempted to add Owl. Result: ' + res)
            message.channel.send(res);
        })
                
    }
})

//Logs in using Discord Bot OAuth token
client.login(fs.readFileSync('./data/auth', 'ascii'))
