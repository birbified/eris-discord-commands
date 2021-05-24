# eris-discord-commands
A simple eris command manager.
## Setting up
Registering commands and error messages.
```js
const { Client } = require('eris');
const path = require('path');
const CommandManager = require('eris-discord-commands');
const client = new Client();
client.command = new CommandManager(client, 'your discord user id');

client.command
    .registerCommandPath(`${path.join(__dirname, 'commands')}`)
    .registerErrorMessages({
        missingPerms: 'You are missing these permissions: {missingPerms}',
        cooldown: 'You are on a cooldown.',
        ownerOnly: 'Only the owner can use this command.'
    }); // leave empty for default
    
client.on('messageCreate', (message) => client.command.handleCommands(message, '.')); // Second param is for the prefix, if you have a custom prefix system. Otherwise just use your default prefix.

client.connect();
```

## Creating your commands
Example
```js
const { Command } = require('eris-discord-commands');

class TestCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'test', // command name
            desc: 'test command yes', // command description
            aliases: ['e', 'monke'], // aliases
            cooldown: 3000, // cooldown in ms
            guildOnly: true, // self explanatory
            ownerOnly: false, // also self explanatory
            usage: 'No Usage',
            category: 'Test',
            perms: { // permissions
                member: {
                    role: ['manageGuild']
                }
            }
        });
    }
    
    run(message, args) {
        message.channel.createMessage('Hello')
    }
}
```

That's it yes.
