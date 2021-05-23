# Powerrent \  _ \
Powercord + Torrent

Made by Crenshaw#1312

Special thanks to: Team Pirate Haven for all the help!

Join the support server: https://discord.gg/CgapbDJ8GX (none atm)

> Disclaimer: Myself and Team Pirate Haven take no responsibility for any consequences, actions, events, lawsuits, crashes, discord ban/termination, or anything else that occur while using this plugin

## What is Powerrent?
Powerrent is a Powercord plugin that will satisfy all your pirating needs. As of now, Powerrent is in it's very early stages with only one command `search` (more below)> POwerrent is built completely by people talking together about what they do, and putting their ideas into a working product. If you think you're really good at what you do and want to help, DM me.
### Adding the plugin
Copy and paste the code below into the terminal for powercord's plugins folder
```
git clone https://github.com/Crenshaw1312/Powerrent
cd Powerrent
npm i
```
### Settings
**Max Search Results**

Max Search results specifies how many results you want to get on a search. Searches are organized by the amount of seeds so you get the best torrents first.
> Reccomeneded: 15 or 20

**Blacklist**
efault blacklist, like ThePirateBay and LimeTorrents.

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


### Current Issues
Private Trackers don't work
> This will be done soon, a username and password field will be required. There will also be more private trackers added like RED and OPS.
