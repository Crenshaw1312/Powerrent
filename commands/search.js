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
        if (!args[0]) {
            return powercord.api.notices.sendToast('Powerrent', {
                header: `Please provide a search`,
                timeout: 3e3
            })
        }
        // enable providers
        // enable any PTs that there's a username and password for
        TorrentSearchApi.getProviders().filter(p => !p.public).map((provider) => {
            try {
                TorrentSearchApi.enableProvider(provider.name, main.settings.get(`${provider.name}Username`), main.settings.get(`${provider.name}Password`))
            } catch (error) {
                console.log(`Failed to log into ${provider.name}`)
            }
        })
       TorrentSearchApi.enablePublicProviders()
       for (let provider of (main.settings.get('blacklistedSites') || ["ThePirateBay", "KickassTorrents", "Yts"])) {
           TorrentSearchApi.disableProvider(provider)
       }

        // setup flags
        let flags = [
            {name: "site", args: ["string"]},
            {name: "cate", args: ["string"]},
            {name: "max", args: ["number"]}
        ]
        let parameters = await flagParse(flags, args.join(" "));

        // deal with site
        let tracker = parameters.get('site')
        if (tracker) {
            try {
            tracker = TorrentSearchApi.getProvider(tracker[0])
                TorrentSearchApi.disableAllProviders()
                TorrentSearchApi.enableProvider(tracker.name)
            } catch (err) {
                return powercord.api.notices.sendToast('Powerrent', {
                    header: `Invalid site/tracker name`,
                    timeout: 3e3
                })
            }

        }

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

            // show notif for not-search trackers
            if (noSearch[0]) {
                await powercord.api.notices.sendToast('Powerrent', {
                    header: `Could not search all trackers for the ${category.toLowerCase()} category`,
                    content: noSearch.join(", "),
                    timeout: 30e3
                })
            }
        }

        // search
        const torrents = await TorrentSearchApi.search(parameters.get("noFlag").join(" "), category, parameters.get('max') ? parameters.get('max')[0] : main.settings.get('searchMax'));
        // no results
        if (!torrents[0]) {
            return powercord.api.notices.sendToast('Powerrent', {
                header: `No results`,
                timeout: 3e3
            })
        }
        return openModal(() => React.createElement(SearchResults, {results: torrents, search: `Searched for \"${parameters.get("noFlag").join(" ")}\" in ${category} - \\  _ \\`}));

    }
}