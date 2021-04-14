const { open: openModal } = require('powercord/modal');
const { React, getModule } = require('powercord/webpack');
const SearchResults = require('../components/SearchResults');
const TorrentSearchApi = require('torrent-search-api');
const { flagParse } = require("../flagParse");

module.exports = {
    command: "search",
    description: "Search for torrents",
    executor: async (args, main) => {

        // setup flags
        let flags = [
            {name: "site", args: ["string"]},
            {name: "cate", args: ["string"]},
            {name: "max", args: ["number"]},
            {name: "pres", args: ["booleen"]}
        ]
        let parameters = await flagParse(flags, args.join(" "));

        // need args
        if (!parameters.get("noFlag") && !parameters.get("pres")) {
            return powercord.api.notices.sendToast('PowerrentNotif', {
                header: `Please provide a search`,
                timeout: 3e3
            })
        }

        // presence flag / setting up search
        let search;
        let category = 'All';
        if (parameters.get('pres')) {
            let activityStore = await getModule(["getActivities"],)
            let activity = activityStore.getActivities(getModule(['getCurrentUser'], false).getCurrentUser().id)
            if (activity = activity.find(act => act.type == 2)) {
                search = activity.details
                category = "Music"
            }
        } else {
            search = parameters.get("noFlag").join(" ")
        }

        // enable any PTs that there's a username and password for
        TorrentSearchApi.getProviders().filter(p => !p.public).map((provider) => {
            let username = main.settings.get(`${provider.name}Username`)
            let password = main.settings.get(`${provider.name}Password`)
            if (username == "" || password == "" || !username || !password) return // if there is no password
            // attempt to login and enable
            try {
                TorrentSearchApi.enableProvider(provider.name, username, password)
            } catch (error) {
                // failed
                powercord.api.notices.sendToast('PowerrentNotif', {
                    header: `Failed to log into ${provider.name}`,
                    content: `(Username: ${username}) (Password: ${password})`,
                    timeout: 10e3
                })
            }
        })
        // enable providers
        TorrentSearchApi.enablePublicProviders()
        for (let provider of (main.settings.get('blacklistedSites') || ["ThePirateBay", "KickassTorrents", "Yts"])) {
           TorrentSearchApi.disableProvider(provider)
        }

        // deal with site flag
        let tracker = parameters.get('site')
        if (tracker) {
            try {
                tracker = TorrentSearchApi.getProvider(tracker[0])
                TorrentSearchApi.disableAllProviders()
                TorrentSearchApi.enableProvider(tracker.name)
            } catch (err) {
                return powercord.api.notices.sendToast('PowerrentNotif', {
                    header: `Invalid site/tracker name`,
                    timeout: 3e3
                })
            }

        }

        // deal with category
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
                powercord.api.notices.sendToast('PowerrentNotif', {
                    header: `Could not search all trackers for the ${category.toLowerCase()} category`,
                    content: noSearch.join(", "),
                    timeout: 10e3
                })
            }
        }

        // search
        const torrents = await TorrentSearchApi.search(search, category, parameters.get('max') ? parameters.get('max')[0] : main.settings.get('searchMax'));
        // no results
        if (!torrents[0]) {
            return powercord.api.notices.sendToast('PowerrentNotif', {
                header: `No results for \"${search}\" in ${category}`,
                timeout: 3e3
            })
        }
        return openModal(() => React.createElement(SearchResults, {results: torrents, search: `Searched for \"${search}\" in ${category} - \\  _ \\`}));

    }
}