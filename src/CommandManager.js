const req = require('require-all');

class CommandManager {
    /**
     * @param {Eris.Client} client - Eris client
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
}

module.exports = CommandManager;
