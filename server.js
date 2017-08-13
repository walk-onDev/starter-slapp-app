'use strict'

const express = require('express')
const Slapp = require('slapp')
const morgan = require('morgan')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')

// use `PORT` env var on Beep Boop - default to 3000 locally
var port = process.env.PORT || 3000

var slapp = Slapp({
  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context()
})

var app = express()
app.use(morgan('dev'))

app.route('/messagemany')

app.route('/beepboop')
  .get(function (req, res) {
    res.sendStatus(200)
  })
  .post(bodyParser.urlencoded({ extended: true }), function (req, res) {
    if (req.body.token !== VERIFY_TOKEN) {
      return res.sendStatus(401)
    }

    var message = 'boopbeep'

    // Handle any help requests
    if (req.body.text === 'help') {
      message = "Sorry, I can't offer much help, just here to beep and boop"
    }

    res.json({
      response_type: 'ephemeral',
      text: message
    })
  })

var HELP_TEXT = `
I will respond to the following messages:
\`help\` - to see this message.
`

//*********************************************
// Setup different handlers for messages
//*********************************************

// response to the user typing "help"
slapp.message('help', ['mention', 'direct_message'], (msg) => {
  msg.say(HELP_TEXT)
})

// attach Slapp to express server
var server = slapp.attachToExpress(app)

// start http server
server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${port}`)
})
