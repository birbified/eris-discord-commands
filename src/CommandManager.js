const req = require('require-all');

const defaultErrorMessages = {
    missingPerms: 'Missing Permissions: {missingPerms}',
    cooldown: 'This command is in a cooldown.',
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
        this.cooldowns = [];
        this.ownerId = ownerId;
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
        if (!message) throw new Error('No message object was provided.');
        if (!prefix || typeof prefix !== 'string') throw new Error('Invalid prefix.');
        
        if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
        
        const split = message.content.split(' ');
        const cmd = split[0];
        const args = split.slice(1);
        const command = this.commands.find(x => x.name.toLowerCase() === cmd.slice(prefix.length).toLowerCase()) || this.commands.find(x => x.aliases.includes(cmd.slice(prefix.length).toLowerCase()));
        if (!command) return;
        
        if (command.guildOnly === true && message.channel.type === 1) return;
        if (command.guildOnly === false && message.channel.type === 0) return;
        
        const cooldown = this.cooldowns.find(x => x.command.toLowerCase() === command.name.toLowerCase() && x.user === message.author.id);
        if (cooldown) return message.channel.createMessage(`${this.errorMessages.cooldown}`);
        
        if (command.ownerOnly && message.author.id !== this.ownerId) return message.channel.createMessage(this.errorMessages.ownerOnly);
        
        for (const rolePerm of command.perms.bot.role) {
            if (!message.channel.guild.members.get(this.client.user.id).permissions.has(rolePerm)) return message.channel.createMessage(this.errorMessages.missingPerms.replace(/{missingPerms}/gi, `${command.perms.bot.role.map(x => `\`${x}\``)}`)); 
        }
        
        for (const channelPerm of command.perms.bot.channel) {
            if (!message.channel.permissionsOf(this.client.user.id).has(channelPerm)) return message.channel.createMessage(this.errorMessages.missingPerms.replace(/{missingPerms}/gi, `${command.perms.bot.channel.map(x => `\`${x}\``)}`));
        }
        
        for (const rolePerm of command.perms.member.role) {
            if (!message.channel.guild.members.get(message.author.id).permissions.has(rolePerm)) return message.channel.createMessage(this.errorMessages.missingPerms.replace(/{missingPerms}/gi, `${command.perms.member.role.map(x => `\`${x}\``)}`)); 
        }
        
        for (const channelPerm of command.perms.member.channel) {
            if (!message.channel.permissionsOf(message.author.id).has(channelPerm)) return message.channel.createMessage(this.errorMessages.missingPerms.replace(/{missingPerms}/gi, `${command.perms.member.channel.map(x => `\`${x}\``)}`));
        }
        
        command.run(message, args);
        
        if (command.cooldown !== 0) {
            this.cooldowns.push({
                command: command.name,
                user: message.author.id
            });
            setTimeout(() => {
                this.cooldowns = this.cooldowns.filter(x => x.command !== command.name && x.user !== message.author.id);
            }, command.cooldown);
        }
    }
}

module.exports = CommandManager;
