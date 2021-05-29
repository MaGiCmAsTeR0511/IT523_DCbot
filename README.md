<p align="center">
        <img src=".\readme_images\symbolApplikation.png">
</p>


# discordbot

#### This repository is for an University project of the [Ferdinand Porsche FernFH](https://www.fernfh.ac.at/). It uses [discordjs](https://discord.js.org/#/) to interact with Discord.

## requirements
This Bot needs [nodejs](https://nodejs.org/en/download/) and <b>npm</b> to work properly. <b>npm</b> is included in nodejs. 

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
 The Bot writes periodically all Courses that where created in the WebApplication. This courses are send into the Channel that is mentioned in the <b>auth.json</b> File. Every Discord user can register or cancel via Discord for an course. This can be done with simple commands.
Every command has to beginn with an <b>!</b> and then the wanted <b>command_name</b> some of the Commands can pass threw <b>arguments</b> this can be done when the command seperated with an space between command_name and argument for Example <b>!details 1</b>

#### List of available Commands

Command | What it does
--------|-------------
ping| returns how long the message needs to be processed by the Server
intro| the bot greets you ^^
anmelden [coursenumber]| sign in for the Course
abmelden [coursenumber]| sign out for the Course
details [coursenumber]| sends you an private Message with the Details of the course



