const { open: openModal } = require('powercord/modal');
const { React } = require('powercord/webpack');
const NewsResults = require('../components/NewsResults.jsx');
const Parser = require('rss-parser');

module.exports = {
    command: "news",
    description: "Get important news from TorrentFreak",
    executor: async (args, main) => {
        let FeedParser = new Parser()
        let TorrentFreak = await FeedParser.parseURL("https://torrentfreak.com/feed/");

        console.log(main.settings.get('sources'));
        return openModal(() => React.createElement(NewsResults, {results: TorrentFreak.items}))
    }
}