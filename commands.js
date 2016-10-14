var config = require('./config.json')
const ytnode = require('youtube-node')
const YouTube = new ytnode()
YouTube.setKey(config.info.ytapi)
var prefix = config.info.prefix
var cmd = {
    myinfo: {
        fn: function(bot, msg) {
            var messageArray = []
            messageArray.push('Info for user ' + msg.author.username + '.'); // i just dont fucking know why it errors as ytapi of undefined
            messageArray.push('```diff\n+ Joined at: ' + new Date(msg.author.createdAt))
            if (msg.member.game !== null) messageArray.push('+ ' + checkGame(msg.member.game.type, msg.member.game.name))
            messageArray.push('+ Status: ' + msg.member.status) // hoiven
            messageArray.push('- ID: ' + msg.member.id + '```')
            bot.createMessage(msg.channel.id, messageArray.join('\n'))
        }
    },
  ban: {
      fn: function (bot, msg, suffix) {
        if (msg.channel.guild.members.get(bot.user.id).permission.json['banMembers']) {
          if (msg.member.permission.json['banMembers']) {
            if (msg.mentions.length === 1) {
              if (suffix.startsWith('confirm')) {
                bot.banGuildMember(msg.channel.guild.id, msg.mentions[0].id, 1).then(() => {
                  bot.createMessage(msg.channel.id, '**' + msg.mentions[0].username + '** has been banned! :eyes: :hammer:')
                }).catch(() => {
                  bot.createMessage(msg.channel.id, ':x: Couldn\'t ban **' + msg.mentions[0].username + '**, most likely person\'s role is higher than bot\'s!')
                })
              } else {
                bot.createMessage(msg.channel.id, ':warning: **Confirmation**\nConfirm your action by typing in `' + prefix + 'ban confirm @\u200Bmention`\n**THIS ACTION IS IRREVERSIBLE!**')
              }
            } else {
              bot.createMessage(msg.channel.id, "You didin't mention anyone!")
            }
          } else {
            bot.createMessage(msg.channel.id, 'Your role does not have enough permissions!')
          }
        } else {
          bot.createMessage(msg.channel.id, 'The bot\'s role has no sufficient permissions!')
        }
      }
  },
    kick: {
      fn: function(bot, msg, suffix) {
        if (msg.member.permission.json['kickMembers']) {
          if (msg.mentions.length === 1) {
            bot.deleteGuildMember(msg.channel.guild.id, msg.mentions[0].id)
            bot.createMessage(msg.channel.id, 'The user should now be kicked, if I had the permissions for it!')
          }
        } else {
          bot.createMessage(msg.channel.id, 'Your role does not have enough permissions!')
        }
      }
    },
  youtube: {
    fn: function(bot, msg, suffix) {
      YouTube.search(suffix, 4, function(error, result) {
        if (error) {
          console.log(error)
        } else {
          var rand = Math.floor(Math.random() * (3 - 0 + 0)) + 0
          if (result.items[rand] === undefined) {
            try {
              return bot.createMessage(msg.channel.id, 'Something went wrong searching the query!')
            } catch (e) {

            }
          }
          bot.createMessage(msg.channel.id, 'https://www.youtube.com/watch?v=' + result.items[rand].id.videoId)
        }
      })
    }
  },
  ping: {
    fn: function(bot, msg, suffix) {
      var pingArray = ['Ping!', 'Peng!', 'Pang!', 'Pong!', 'Poot!', 'Noot!', 'Bong!']
      var random = Math.floor(pingArray.length * Math.random())
      if (random > pingArray.length) {
        random = 3
      }
      var time1 = new Date()
      bot.createMessage(msg.channel.id, '\u200B' + pingArray[random]).then(message => {
        var final = new Date() - time1
        bot.editMessage(msg.channel.id, message.id, '\u200B' + pingArray[random] + ' Time taken: ' + final + 'ms.')
      })
    }
  },
  say: {
    fn: function(bot, msg, suffix) {
      bot.createMessage(msg.channel.id, '\u200B' + suffix)
    }
  },
  shutdown: {
    fn: function(bot, msg) {
      if (msg.author.id == '154578730809819136') {
        process.exit()
      } else {
        bot.createMessage(msg.channel.id, "You don't have permission to run this command.")
      }
    }
  },
  eval: {
    fn: function(bot, msg, suffix) {
      if (msg.author.id == '154578730809819136') {
        bot.createMessage(msg.channel.id, '\u200B**Evaluating...**').then((message) => {
          try {
            var result = eval(suffix) // eslint-disable-line
            if (typeof result !== 'object') {
              bot.editMessage(msg.channel.id, message.id, `**Result:**\n${result}`)
            }
          } catch (e) {
            bot.editMessage(msg.channel.id, message.id, `**Result:**\n\`\`\`js\n${e.stack}\`\`\``)
          }
        })
      } else {
        bot.createMessage(msg.channel.id, "You don't have permission to run this command.")
      }
    }
  },

}
function checkGame (type, game) {
  if (type === 0) return 'Playing: ' + game
  if (type >= 1) return 'Streaming: ' + game
}
exports.cmd = cmd
