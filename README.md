# Powerrent \  _ \
Powercord + Torrent

Made by Crenshaw#1312

Special thanks to: Team Pirate Haven for all the help!

> Disclaimer: Myself and Team Pirate Haven take no responsibility for any consequences, actions, events, lawsuits, crashes, discord ban/termination, or anything else that occur while using this plugin

## What is Powerrent?
Powerrent is a Powercord plugin that will satisfy all your pirating needs. As of now, Powerrent is in it's very early stages with only one command `search` (more below)
### Adding the plugin
Copy and paste the code below into the terminal for powercord's plugins folder
```
git clone https://github.com/Crenshaw1312/Powerrent
```
### Settings
**Max Search Results**

![PowerrentMaxSearchResults](https://hoodie.vip/uploads/b1215eff-59ca-4766-99c4-8d7ffb87d6a7/9Msy7AHB.png)
Max Search results specifies how many results you want to get on a search. Searches are organized by the amount of seeds so you get the best torrents first.
> Reccomeneded: 15 or 20

**Blacklist**

![PowerrentBlacklist](https://hoodie.vip/uploads/b1215eff-59ca-4766-99c4-8d7ffb87d6a7/gQ68sPYC.png)
Team Pirate Haven has selected some site that are default blacklist, like ThePirateBay and LimeTorrents.

By toggling on, you will blacklist that site from being used in any command, including search.

### Commands
May `\` represent your prefix.

I made it so it's all done in subcommands, so it won't completely flood your main command-autocomplete section

```
Name: search
Usage: \p search <search> [-cate <category>]
Description: searches your allowed trackers for torrents
```
the `cate` flag allows you to specify a category to search for in you trackers. Powerrent will automatically sort out any tracker that doesn't contain that category

![PowerrentSearchModal](https://hoodie.vip/uploads/b1215eff-59ca-4766-99c4-8d7ffb87d6a7/KmdHI3p4.png)

### Current Issues
Private Trackers don't work
> This will be done soon, a username and password field will be required. There will also be more private trackers added like RED and OPS.
