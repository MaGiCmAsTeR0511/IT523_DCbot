const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const mysqlconfig = require('./mysql.json');
const utf8 = require('utf8');
const stdin = process.stdin;
const cf = require('./config.json');
const prefix = cf.prefix;
const MongoClient = require('mongodb').MongoClient;
const mysql = require('mysql');
const cron = require('node-cron');
const moment = require('moment')
var con = mysql.createConnection({
    host: mysqlconfig.host,
    port: mysqlconfig.port,
    user: mysqlconfig.username,
    pass: mysqlconfig.password,
    database: mysqlconfig.database,
    multipleStatements: true
});

var connection = con.connect();

client.on('ready', () => {
    console.log(`${client.user.tag} is ready!`);
});
client.login(auth.token);

var task = cron.schedule('0 * * * * 5', () => {
    var arraykvid = [];
    var text = "";
    getSqlresult("SELECT idkv_sudc from send_updates_to_dc GROUP BY idkv_sudc", function (result) {
        text = "Hallo Leute folgende Kurse wurden neu eingetragen: \n\n\n"
        result.forEach(function (k) {
            arraykvid.push(k.idkv_sudc);
        });

        getSqlresult("SELECT * from kurs_veranstaltungen where id_kv IN (" + arraykvid.join(',') + ")", function (result) {
            result.forEach(function (v) {
                var von = moment(v.von_kv).format('DD.MM.YYYY');
                var bis = moment(v.bis_kv).format('DD.MM.YYYY');

                text += "Kursnummer: " + v.id_kv + "\n Titel: " + v.titel_kv + "\n" + "Beschreibung: " + v.beschreibung_kv + "\n" + "VON - BIS: " + von + " - " + bis + "\n\n";
            })
            var kursechannel = client.channels.cache.find(channel => channel.id === '838739265021018112');
            if (!kursechannel) return;
            //send message to the channel
            kursechannel.send(text);
        });

    });

});




//task.start();


// Entscheidung was getan werden soll wenn eine Nachricht eingegeben wird 
client.on("message", function (message) {
    //console.log(message);
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;


    const commandBody = message.content.slice(prefix.length);
    //ausplitten der Argumente
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    }
    else if (command === "sum") {
        const numArgs = args.map(x => parseFloat(x));
        const sum = numArgs.reduce((counter, x) => counter += x);
        message.reply(`The sum of all the arguments you provided is ${sum}!`);
    }
    else if (command === "intro") {
        message.reply('Hello');
    }
    else if (command === "codcw") {
        message.reply('Hier ist mein battleTag für COD-COLDWAR:');
    }// direkte Nachricht an den User
    else if (command === "testme") {
        message.author.send('test');
        //message.reply('Hier ist mein battleTag für COD-COLDWAR:');
    }
    else if (command === "anmeldung") {
        if (args !== '') {
            var user = message.member;
            checkifkursveranstaltungexists(args[0], function (result1) {
                if (result1 === true) {
                    getAnmeldungen(user, args[0], function (result2) {
                        console.log(result2)
                        if (result2 === false) {
                            setAnmeldung(user, args[0], function (result3) {
                            });
                            message.reply('Du wurdest erfolgreich angemeldet!');
                        } else {
                            message.reply('Du bist bereits angemeldet für diesen Kurs!');
                        }
                    });
                } else {
                    message.reply('Diesen Kurs gibt es nicht!!!');
                }
            });

            /*
            con.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("discord");
                var myobj = { _user: user.toString(), datum: args[0] };
                dbo.collection("anmeldungen").insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    console.log("1 Dokument eingetragen!");
                    db.close();
                });
            });
            
            message.reply(`Deine Anmeldung wurde bestätigt 🤩`);
            */
        } else {
            message.reply('Du hast keine Kursnummer angegeben');
        }
    }
    else if (command === "abmelden") {
        if (args !== '') {
            var user = message.member;
            checkifkursveranstaltungexists(args[0], function (result1) {
                if (result1 === true) {
                    getAnmeldungen(user, args[0], function (result2) {
                        console.log(result2)
                        if (result2 === true) {
                            setAbmeldung(user, args[0], function (result3) {
                            });
                            message.reply('Du wurdest erfolgreich abgemeldet!');
                        } else {
                            message.reply('Du bist bereits abgemeldet für diesen Kurs!');
                        }
                    });
                } else {
                    message.reply('Diesen Kurs gibt es nicht!!!');
                }
            });

            /*
            con.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("discord");
                var myobj = { _user: user.toString(), datum: args[0] };
                dbo.collection("anmeldungen").insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    console.log("1 Dokument eingetragen!");
                    db.close();
                });
            });
            
            message.reply(`Deine Anmeldung wurde bestätigt 🤩`);
            */
        } else {
            message.reply('Du hast keine Kursnummer angegeben');
        }
    } else if (command === "befehle") {

        var user = message.member;
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("discord");
            dbo.collection("befehle").find({}).toArray(function (err, result) {
                if (err) throw err;
                var befehle = [];
                result.forEach(element => {
                    befehle.push(element.befehlcode);
                })
                message.channel.send("Das sind die nutzbaren befehle: " + befehle.join(", "));
                db.close();
            });
        });
        //message.reply(`Deine Anmeldung wurde bestätigt 🤩`);
    }
});

// Willkommen nachricht wenn neue Mitglieder dazu kommen
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'willkommen');
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Willkommen in der Drachenhoehle, ${member}`);
});

// Nachricht an alles wenn jemand den Server verlässt
client.on('guildMemberRemove', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'byebye');
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Der Drache wurde entfernt aus der Hoehle, ${member}`);
});




//zum beenden des prozesses mit strg+c
stdin.on('keypress', function (letter, key) {
    if (key
        && key.ctrl
        && key.name
        === 'c') {
        task.stop();
        process.exit();
    }
});

function getSqlresult(query, data) {
    con.query(query, function (err, result, fields) {
        if (err) {
            throw err;
        }
        return data(Object.values(JSON.parse(JSON.stringify(result))));
    });
}

function getAnmeldungen(user, kvid, data) {
    var queryresult = '';
    con.query("SELECT COUNT('id_ka') as 'exist' FROM kursanmeldungen where iddc_ka = " + user + " AND idkv_ka = " + kvid +" AND deleted_ka IS NULL ", function (err, result, fields) {
        if (err) {
            throw err;
        }
        queryresult = Object.values(JSON.parse(JSON.stringify(result)));
        if (queryresult[0].exist !== 0) {
            return data(true);
        } else {
            return data(false);
        }
    })
}

function checkifkursveranstaltungexists(kvid, data) {
    var queryresult = '';
    con.query("SELECT COUNT('id_kv') as 'exist' FROM kurs_veranstaltungen where id_kv = " + kvid + " AND deleted_kv = 0", function (err, result, fields) {
        if (err) {
            throw err;
        }
        queryresult = Object.values(JSON.parse(JSON.stringify(result)));
        if (queryresult[0].exist === 1) {
            return data(true);
        } else {
            return data(false);
        }
    })
}

function setAnmeldung(user, kvid, data) {
    con.query("Insert INTO kursanmeldungen ( iddc_ka , idkv_ka) VALUES ('" + user + "', " + kvid + ")", function (err, result, fields) {
        if (err) {
            throw err;
        }
    });
}

function setAbmeldung(user, kvid, data) {
    con.query("UPDATE kursanmeldungen SET deleted_ka =1 WHERE iddc_ka = '" + user + "' AND idkv_ka =  " + kvid + " AND deleted_ka IS NULL", function (err, result, fields) {
        if (err) {
            throw err;
        }
    });
}