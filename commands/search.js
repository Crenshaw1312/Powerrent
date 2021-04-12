const { open: openModal } = require('powercord/modal');
const { React } = require('powercord/webpack');
const SearchResults = require('../components/SearchResults');
const TorrentSearchApi = require('torrent-search-api');
const { flagParse } = require("../flagParse");

module.exports = {
    command: "search",
    description: "Search for torrents",
    executor: async (args, main) => {

        // need args
        if (!args[0]) return {send: false, result: "Please provide a search"}

            // enable providers
            TorrentSearchApi.enablePublicProviders()
            main.settings.get('blacklistedSites').forEach(provider => TorrentSearchApi.disableProvider(provider))

        // setup flags
        let flags = [
            {name: "site", args: ["string"]},
            {name: "cate", args: ["string"]},
            {name: "max", args: ["number"]}
        ]
        let parameters = await flagParse(flags, args.join(" "));

        // deal with category
        let category = 'All'
        let cate = parameters.get("cate")
        let noSearch = [];
        if (cate) {
            cate = cate[0]
            TorrentSearchApi.getActiveProviders().map((provider) => {
                if (provider.categories.find(category => category.toLowerCase() == cate.toLowerCase())) {
                    category = cate[0].toUpperCase() + cate.slice(1) // make it so it uses the provided category
                } else {
                    TorrentSearchApi.disableProvider(provider.name) // disable provider if it doesn't have it (to save speed)
                    noSearch.push(provider.name)
                }
            })
            await powercord.api.notices.sendToast('Powerrent', {
                header: `Could not search all trackers for the ${category.toLowerCase()} category`,
                content: noSearch.join(", "),
                timeout: 30e3
            })
        }

        // search
        const torrents = await TorrentSearchApi.search(parameters.get("noFlag").join(" "), category, main.settings.get('searchMax'));
        if (!torrents[0]) {
            return powercord.api.notices.sendToast('Powerrent', {
                header: `No results`,
                timeout: 5e3
            })
        }
        return openModal(() => React.createElement(SearchResults, {results: torrents, search: `Searched for \"${parameters.get("noFlag").join(" ")}\" in ${category} - \\  _ \\`}));

    }
}