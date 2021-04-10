const { Plugin } = require('powercord/entities');
const commands = require('./commands');
const Settings = require('./Settings');

module.exports = class Powerrent extends Plugin {

    startPlugin () {
        this.registerMain();

        powercord.api.settings.registerSettings('Powerrent', {
          category: this.entityID,
          label: 'Powerrent',
          render: Settings
        });
    }

    pluginWillUnload () {
      powercord.api.settings.unregisterSettings('Powerrent')
      powercord.api.commands.unregisterCommand('p')
    }

    registerMain () {
        powercord.api.commands.registerCommand({
          command: 'p',
          description: 'Use Powerrent commands',
          usage: '{c} p <subcommand> [args]',
          executor: (args) => {
            // Running the subcommand
            const subcommand = commands[args[0]]
            // invalid subcommand
            if (!subcommand) {
              return {
                send: false,
                result: `\`${args[0] || " "}\` is not a valid subcommand`
              };
            }
            
            // actually running the command
            return subcommand.executor(args.slice(1), this)
          },
          // autocomplete table
          autocomplete: (args) => {
            if (args[0] !== void 0 && args.length === 1) {
              return {
                commands: Object.values(commands).filter(({ command }) => command.includes(args[0].toLowerCase())),
                header: 'Powerrent subcommands'
              };
            }
    
            const subcommand = commands[args[0]];
            if (!subcommand || !subcommand.autocomplete) {
              return false;
            }
    
            return subcommand.autocomplete(args.slice(1), this.settings)
          }
        });
      }

}