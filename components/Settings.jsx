const { React } = require('powercord/webpack');
const { SwitchItem, TextInput, Category } = require('powercord/components/settings');
const { FormTitle, Button } = require('powercord/components');
const TorrentSearchApi = require('torrent-search-api');

module.exports = class PowerrentSettings extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { category0Opened: false, category1Opened: false };
	}

	render() {
		const { getSetting, toggleSetting, updateSetting } = this.props;

		return (
            <div>
              <FormTitle>Made by Crenshaw#1312 and <a href="https://disboard.org/server/766672915441385472" target="_blank">Team Pirate Haven</a><br></br>There is no support server for Powerrent as of now</FormTitle>
                <TextInput
                  note='Max amount of search results to get'
                  defaultValue={getSetting('searchMax', 20)}
                  required={true}
                  onChange={val => 
                    updateSetting('searchMax', !val.match(/\A\d+$/i) ? 20 : val)}
                >
                Max Search Results
                </TextInput>

                <Category
                  name='Blacklist'
                  description={'Blacklist sites from being used in any command, including search'}
                  opened={this.state.categoryOpened}
                  onChange={() => this.setState({ categoryOpened: !this.state.categoryOpened })}
                >
                  {TorrentSearchApi.getProviders().map(tsa => <SwitchItem
                    value={this.props.getSetting('blacklistedSites', ["ThePirateBay", "KickassTorrents", "Yts"]).includes(tsa.name)}
                    note={"Is Private: " + !tsa.public + "\nCategories: " + tsa.categories.join(" ")}
                    onChange={() => this._blacklistToggle(tsa.name)}
                  >
                  {tsa.name}
                  </SwitchItem>)}
                </Category>
            </div>
		);
	}

  _blacklistToggle (name) {
    const blacklistedSites = this.props.getSetting('blacklistedSites', []);

    if (!blacklistedSites.includes(name)) {
      this.props.updateSetting('blacklistedSites', [ ...blacklistedSites, name ]);
    } else {
      this.props.updateSetting('blacklistedSites', blacklistedSites.filter(t => t !== name));
    }
  }

};
