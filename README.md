# About vtbk Bot
vtbk Bot is a Telegram bot that replies motivational message when it detects a vtbk within the message.

A new intended feature is to use it as a reminder bot where user can pin reminders and it will automatically remind users in a certain interval.

# Usage
1. Git clone the repository
2. run `npm install`
3. run `node index.js`
4. Create a telegram bot using telegram botfather
5. In `config/index` folder, use the generated token from the botfather and to fill up the key


To use the feature to save reminders to Google sheets, 
1. You have to create a google sheet 
2. Take the spreadsheet key from the URL of your google sheet and fill it in `config/index`
3. For authentication of writing to Google sheets using a service account, follow the setup instructions below.

**Setup Instructions**

1. Go to the Google Developers Console
2. Select your project or create a new one (and then select it)
3. Enable the Drive API for your project
4. Create a service account for your project
5. Save your generated JSON key file as `vtbk-bot.json` in the config folder.

# Features
## vtbk pin [reminder]
Allows you to pin a reminder for reference later. These messages will then be automatically sent to user once around 9am everyday from Monday to Friday.

## vtbk remind
Shows you a list of whatever you have pinned.

## any other text that containts 'vtbk'
Allows the bot to reply you with a motivational message.

# Wish List

- [ ] Will read from google spreadsheet each time reminder function is called
- [ ] Proper reading/writing into google sheet using google spreadsheet library
- [ ] Pinned message will be automatically removed after 5 days
- [ ] Error Handling
- [ ] Unit Tests 

# Sources
For information on how to setup a telegram bot:
https://core.telegram.org/bots

Telegram library used to develop telegram bot:
https://github.com/Naltox/telegram-node-bot

Google Spreadsheet library used to save reminders:
https://github.com/theoephraim/node-google-spreadsheet