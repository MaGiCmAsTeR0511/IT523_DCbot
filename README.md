# discordbot

#### This repository for an School project od the [Ferdinand Porsche FernFH](https://www.fernfh.ac.at/). It uses [discordjs](https://discord.js.org/#/) to interact with Discord.

## requirements
to use this bot you have to install [nodejs](https://nodejs.org/en/download/) and it is neccessary to install <b>npm</b>. Npm is included in nodejs. 

### Creation of an Bot for your Discord Channel
You need to setup some Things before you can use this Bot. Everything you need to know is described in the first half of this [Article](https://www.freecodecamp.org/news/create-a-discord-bot-with-python/). 
But it also shows you how to write an Bot in Python. 


### Authentication 
To use that Bot for your Applikation you have to generate an auth.json file where you have to set Following attributes:
```javascript
{
  "token": "Token_from_the_Bot",
  "channelid": 'the_ChannelId_where_the_Bot_should_answer'
}
```


### Database
for use with the Mysql Database you have to generate a file that's named <b> mysql.json</b> in the root directory.
This file must have this structure:
```javascript
{
    "host" : "******",
    "port" : ******,
    "username" : "********",
    "password" : "******",
    "database" : "******"
}
```

## How it works

The Bot is an simple Example from that what a Bot can do. The Bot writes periodically all Courses that where written in the Database form the WebApplication into the Channel that is mentioned in the <b>auth.json</b> File.

Every command has to beginn with an <b>!</b> and then the wanted <b>command_name</b> some of the Commands can pass threw <b>arguments</b> this can be done when the command seperated with an space between command_name and argument for Example !details 1

#### List of available Commands

Command | What it does
--------|-------------
ping| returns how long the message needs to be processed by the Server
intro| the bot greets you ^^
anmelden [coursenumber]| sign in for the Course
abmelden [coursenumber]| sign out for the Course
details [coursenumber]| sends you an private Message with the Details of the course



