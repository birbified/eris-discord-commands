const req = require('require-all');

const defaultErrorMessages = {
    missingPerms: {
        embed: {
            description: '**Missing Permissions**\n{missingPerms}'
        }
    },
    cooldown: 'This command is in a cooldown. Time Left: {cooldown}',
    ownerOnly: 'This command is owner-only. You cannot use it.'
};

class CommandManager {
    /**
     * @param {Eris.Client} client - Eris client
     * @param {Object} options - Options
     */
    
    constructor(client, ownerId) {
        if (!client) throw new Error('Invalid eris client.');
        if (!ownerId) throw new Error('Invalid owner id.');
        
        this.commands = [];
        this.errorMessages = {};
        this.client = client;
        this.registeredPath = false;
        this.registeredErrorMessages = false;
    }
    
    /**
     * @param {String} path - Directory path
     */
    
    registerCommandPath(path) {
        if (!path || typeof path !== 'string') throw new Error('Invalid command path.');
        
        const categories = req(path);
        for (const cat of Object.values(categories)) {
            for (const command of Object.values(cat)) {
                this.commands.push(new command(this.client));
            }
        }
        
        this.registeredPath = true;
        return this;
    }
    
    /**
     * @param {Object} [options=defaultErrorMessages]
     */
    
    registerErrorMessages(options) {
        if (!options) return this.errorMessages = defaultErrorMessages;
        if (typeof options !== 'object') throw new Error('Invalid options.');
        
        if (!options.missingPerms) options.missingPerms = defaultErrorMessages.missingPerms;
        if (!options.cooldown) options.cooldown = defaultErrorMessages.cooldown;
        if (!options.ownerOnly) options.ownerOnly = defaultErrorMessages.ownerOnly;
        
        this.errorMessages = options;
        this.registeredErrorMessages = true;
        return this;
    }
    
    /**
     * @param {Eris.Message} message - Eris message object
     * @param {String} prefix - Command prefix
     */
    
    handleCommands(message, prefix) {
        if (this.registeredPath === false) throw new Error('Command path must be registered.');
        if (this.registeredErrorMessages === false) throw new Error(`Command path must be registered. Use 'registerErrorMessages()' for default error messages.`);
    }
}

module.exports = CommandManager;
