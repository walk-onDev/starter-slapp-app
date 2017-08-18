# slack-tools-app

This is a proof of concept app that may increase in functionality over time. Currently the '_messagemany_' slash command is the only feature implemented in this app.

## /messagemany usage:
        
        /messagemany [message text]
        
The bot will then respond and ask the user which channel(s) they would like to message. The user should respond with a list of channels names prefixed with '#'. If the user doesn't respond within 60 seconds the conversation will timeout.

        #channela #channelb
