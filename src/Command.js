class Command {
    /**
     * @param {Eris.Client} client - Eris client
     * @param {Object} options - Command options
     */
    
    constructor(client, options) {
        if (!client) throw new Error('Invalid client provided.');
        if (!options || typeof options !== 'object' || Object.keys(options).length === 0) throw new Error('Invalid options.');
        if (!options.name) throw new Error('No command name was provided.');
        
        this.client = client;
        this.name = options.name;
        this.aliases = options.aliases || [];
        this.desc = options.desc || '';
        this.cooldown = options.cooldown || 0;
        this.guildOnly = options.guildOnly || true;
        this.usage = options.usage || '';
        this.ownerOnly = options.ownerOnly || false;
        this.category = options.category || 'Misc';
        this.perms = {
            bot: {
                role: options.perms.bot && options.perms.bot.role ? options.perms.bot.role : [],
                channel: options.perms.bot && options.perms.bot.channel ? options.perms.bot.channel : []
            },
            member: {
                role: options.perms.member && options.perms.member.role ? options.perms.member.role : [],
                channel: options.perms.member && options.perms.member.channel ? options.perms.member.channel : []
            }
        }
    }
}

module.exports = Command;
