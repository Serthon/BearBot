const Eris = require('eris')
const commands = require('./commands.js')
var config = require('./config.json')
var bot = new Eris(config.info.token)
var prefix = config.info.prefix
var package = require('./package.json')

bot.on('ready', () => {
    bot.editGame({name: package.version})
    console.log(package.name + ' ' + package.version + ' has sucessfully booted up.')
});
bot.on('messageCreate', (msg) => {
    if (msg.content.startsWith(prefix)) {
        var base = msg.content.substr(prefix.length)
        var stub = base.split(' ')
        var name = stub[0]
        var suffix = base.substr(stub[0].length + 1)
        commands.cmd[name].fn(bot, msg, suffix)
        console.log(msg.author.username + ' has executed ' + name)
    }
})
bot.connect();
