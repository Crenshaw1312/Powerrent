const { Plugin } = require('powercord/entities');
const commands = require('./commands');
const Settings = require('./components/Settings');
const Parser = require('rss-parser');
const data = require('./data.json')

module.exports = class Powerrent extends Plugin {

  constructor() {
		super();
    this.data  = {
      newCheckIntervalID: undefined
    }
	}
  
  startPlugin () {
    // register sub comands
    this.registerMain()
    // start the interval checker
    let id = setInterval(async () => {await this.dataCheck()}, 3600000);
    this.data.newCheckIntervalID = id

    // load in the settings
    powercord.api.settings.registerSettings('PowerrentSettings', {
      category: this.entityID,
      label: 'Powerrent',
      render: Settings
    });
  }

  pluginWillUnload () {
    powercord.api.settings.unregisterSettings('PowerrentSettings')
    powercord.api.commands.unregisterCommand('p')
    if (this.data.newsCheckIntervalID) clearInterval(this.data.newsCheckIntervalID)
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
      })
  }

  async newsCheck() {
    let tags = []
    let newArticles = []
    this.settings.get('tags', data.newsDefault).forEach(t => {if (t.enabled) tags.push(t.tag)})

    let FeedParser = new Parser()
    let TorrentFreak = await FeedParser.parseURL("https://torrentfreak.com/feed/")
    // use the settings to just save some data bc I'm lazy af
    let lastBuildDateSaved = this.settings.get('lastBuildDateSaved', TorrentFreak.lastBuildDate)
    if (lastBuildDateSaved == TorrentFreak.lastBuildDate) this.settings.set('lastBuildDateSaved', TorrentFreak.lastBuildDate)

    for (const article of TorrentFreak.items) {
      // date posted filter
      if (article.pubDate != lastBuildDateSaved) {
        // tag filter
        article.categories.forEach(tag => {
          if (tags.includes(tag.toLowerCase())) newArticles.push(article)
        })
      }else {
        this.settings.set('lastBuildDateSaved', TorrentFreak.lastBuildDate)
        break
      }
    }

    if (newArticles.length) {
      for (const article of newArticles) {
        powercord.api.notices.sendToast(`PowerrentNotif_${article.title}`, {
          header: article.title,
          content: this.settings.get('showSnippet', true) ? article.contentSnippet.replace("From: TF, for the latest news on copyright battles, piracy and more.", "") : undefined,
          timeout: 10e3,
          buttons: [ {
            text: 'Open Article', // required
            color: 'green',
            size: 'medium',
            look: 'outlined',
            onClick: () => window.open(article.link)
          }]
        })
      }
    }
    return newArticles
  }

}