//Requirements - discord.js (obviously), express (for web server), 
//fetch (to get owl-o-rama), and fs (to load Discord Bot auth token)
const express = require('express');
const Discord = require('discord.js')
const fetch = require("node-fetch")
const fs = require('fs')

//sets up Express and Discord
const app = express();
const client = new Discord.Client()

//getOwl method - calls the owl-o-rama API to get the URL of an owl image, 
//then gets the URL from the JSON response
const getOwl = async () => {
    return await fetch('https://us-central1-petting-zoo-v1.cloudfunctions.net/owl-o-rama')
        .then(response => response.json())
        .then(json => json.url);
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
    switch (message.content) {
        case '.owl':
            //API WAY V1
            getOwl()
            .then(res => {
                console.log('Summoning Owl: ' + res)                    
                message.channel.send(res);
            })
            break;
    }
})

//Logs in using Discord Bot OAuth token
client.login(fs.readFileSync('./data/auth', 'ascii'))
