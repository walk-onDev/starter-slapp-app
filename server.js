'use strict'

const express = require('express');
const Slapp = require('slapp');
const ConvoStore = require('slapp-convo-beepboop');
const Context = require('slapp-context-beepboop');

// use `PORT` env var on Beep Boop - default to 3000 locally
var port = process.env.PORT || 3000;

var slapp = Slapp({
  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context()
});

var HELP_TEXT = `
I will respond to the following messages:
\`help\` - to see this message.
\The only tool available in this app right now is the messagemany slash command 1 second timeout
`;

//*********************************************
// Setup different handlers for messages
//*********************************************

// response to the user typing "help"
slapp.message('help', ['mention', 'direct_message'], (msg) => {
  msg.say(HELP_TEXT);
});

slapp.command('/messagemany', '(.*)', (msg, text, question) => {
  msg.say('Which channel(s) would you like to post to?').route('handleWhichChannels',{ message: text }, 1);
  return;
});

slapp.route('handleWhichChannels', (msg, state) => {
    var arr = msg.channelsMentioned();

    if (arr.length === 0) {
      msg.say('Invalid response. Please give me a list of channel(s) to message.').route('handleWhichChannels', state, 1);
      return;
    }

    for (var i = 0; i < arr.length; i++) {
      msg.say({
      text: state.message,
        channel: arr[i]
      });
    }  
});

// attach Slapp to express server
var server = slapp.attachToExpress(express());

// start http server
server.listen(port, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log(`Listening on port ${port}`);
})