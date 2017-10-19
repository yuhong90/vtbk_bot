'use strict';

var http = require("http");
var port = process.env.PORT || 443,
    host = '0.0.0.0',  // probably this change is not required
    externalUrl = process.env.CUSTOM_ENV_VARIABLE || 'https://my-app.herokuapp.com';  //This is used because we are deploying to heroku
const Telegram = require('telegram-node-bot');
const Config = require('./config');
const Store = require('./components/Store');
const Replies = require('./components/Replies');
const Reminders = require('./components/Reminders');
const announcements = require('./components/Announcements.js').announcements;
const CustomFilterCommand = require('./node_modules/telegram-node-bot/lib/routing/commands/CustomFilterCommand')
const async = require('async');
const TelegramBaseController = Telegram.TelegramBaseController;
const RegexpCommand = Telegram.RegexpCommand;
const cluster = require('cluster')
const telegramBot = new Telegram.Telegram(Config.telegram, {      
    webAdmin: {
        host: host,
        port: port
    },
    workers: 1
});

if(cluster.isMaster){
    console.log("initializing value");
    let count = 0;
    var countInt = 0;
    
    Reminders.handleAutomaticReminders(function(id, result) {
        telegramBot.api.sendMessage(id, result);
    });
}

async.series([Store.setAuth,
              Store.getInfoAndWorksheets,
              (next) => {
                Store.readSheets(announcements,next);
              }], 
             function(err){
                if( err ) {
                    console.log('Error: ' + err);
                }
                console.log("Message Read!");
            });

class OtherwiseController extends TelegramBaseController {
    handle($) {
        $.sendMessage('Ar? Please only use `vtbk pin`, `vtbk remind`');
    }
}

class PingController extends TelegramBaseController {
    pingMessage($) {
        // var randInt = Math.floor(Math.random() * 
        // ((ansArr.length-1) - 0 + 1) + 0);
        let randInt = count += 1;
        let reply = Replies[randInt];
        $.sendMessage(reply[0]);

        if (reply.length > 1) {
            setTimeout(function() {
                $.sendMessage(reply[1]);
            }, 5000);
        }
        if (count == Replies.length) {
            count = 0;
        }
    }

    pinMessage($) {
        var stringToAdd = $.message.text.substring('vtbk pin '.length);    
        let newItem = {
            message: stringToAdd,
            date: (new Date()).toString(),
        };
        if (announcements[$.message.chat.id] == undefined) {
            announcements[$.message.chat.id] = [];
        }
         let chatGrpReminders = announcements[$.message.chat.id];
        chatGrpReminders.push(newItem);
        
        if (chatGrpReminders != undefined && chatGrpReminders.length > 0) {
            async.series([
                Store.setAuth,
                Store.getInfoAndWorksheets,
                (next) => {
                    Store.updateSheets(announcements, next)
                }
            ], function(err){
                if( err ) {
                    console.log('Error: ' + err);
                }
                $.sendMessage('Your message has been added!');
            })
        }
    }

    remindMessage($) {
        let chatGrpReminders = announcements[$.message.chat.id];
        if (chatGrpReminders != undefined && chatGrpReminders.length > 0) {
            let result = Reminders.generateReminders(chatGrpReminders);
            $.sendMessage(result);
        } else {
            $.sendMessage('No Announcement Yet! Please try later');
        }
    }

    get routes() {
        return {
            'pingCommand': 'pingMessage',
            'pinCommand': 'pinMessage',
            'remindCommand': 'remindMessage',
        };
    }
}

telegramBot.router
    .when(
        new RegexpCommand(/^vtbk pin /i, 'pinCommand'),
        new PingController()
    )
    .when(
        new RegexpCommand(/^vtbk remind/i, 'remindCommand'),
        new PingController()
    )
    .when(      
        new CustomFilterCommand($ => { 
            if($.message.text != undefined && $.message.text.match(/vtbk/i) && !$.message.text.match(/vtbk pin/i) && !$.message.text.match(/vtbk remind/i)){
                return true;
            }
            var caption = $.message.caption;
                if (caption != undefined && caption.toLowerCase().indexOf("vtbk") >= 0) {
                    return true;
                }
            }, 'pingCommand'),
        new PingController()
    )