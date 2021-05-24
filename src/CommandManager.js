const req = require('require-all');

class CommandManager {
    /**
     * @param {Eris.Client} client - Eris client
     * @param {Object} options - Options
     */
    
    constructor(client) {
        if (!client) throw new Error('Invalid eris client.');
        
        this.commands = [];
        this.client = client;
        this.registeredPath = false;
    }
    
    /**
     * @param {String} path - Directory path
     */
    
    registerCommandPath(path) {
        if (!path || typeof path !== 'string') throw new Error('Invalid command path.');
        
        const categories = req(path);
        for (const cat of Object.values(categories)) {
            for (const command of Object.values(cat)) {
                this.commands.push(command);
            }
        }
        
        this.registeredPath = true;
        return this;
    }
    
    /**
     * @param {Eris.Message} message - Eris message object
     * @param {String} prefix - Command prefix
     */
    
    handleCommands(message, prefix) {
        if (this.registeredPath === false) throw new Error('Command path must be registered.');
    }
}

module.exports = CommandManager;
