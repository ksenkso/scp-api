# SCP Foundation Objects API

This API parses the [SCP Foundation site](http://scpfoundation.net/) to get objects.
Frontends for this - a [web client](https://github.com/ksenkso/scp-dictionary) and a [Telegram bot](https://github.com/ksenkso/scp-telegram-bot). Both frontends are currently inactive.

## Routes description

 - `/pull` - Parse all objects available on [SCP Foundation site](http://scpfoundation.net/).
 - `/objects` - Get a list of all objects
 - `/objects/:number` - Get an object by its number.
 - `/stats` - Get a number of objects and date of the last `pull`.
 
