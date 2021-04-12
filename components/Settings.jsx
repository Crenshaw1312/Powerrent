const { React } = require('powercord/webpack');
const { SwitchItem, TextInput, Category, SliderInput } = require('powercord/components/settings');
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
              <SliderInput
                note="The max number of search results to get"
                initialValue={ getSetting('searchMax', 25) }
                minValue={ 5 } maxValue={ 100 }
                markers={[ 5, 10, 15, 25, 50, 75, 100 ]}
                stickToMarkers={true}
                onValueChange={ v => updateSetting('searchMax', v) }
              >
                Max Search
              </SliderInput>

                <Category
                  name='Blacklist'
                  description={'Blacklist sites from being used in any command, including search'}
                  opened={this.state.category0Opened}
                  onChange={() => this.setState({ category0Opened: !this.state.category0Opened })}
                >
                  {TorrentSearchApi.getProviders().map(tsa => <SwitchItem
                    value={getSetting('blacklistedSites', ["ThePirateBay", "KickassTorrents", "Yts"]).includes(tsa.name)}
                    note={"Is Private: " + !tsa.public + "\nCategories: " + tsa.categories.join(" ")}
                    onChange={() => this._blacklistToggle(tsa.name)}
                  >
                  {tsa.name}
                  </SwitchItem>)}

                </Category>

                <Category
                  name='Account Information'
                  description='Enter your usernames and passwords to use private trackers, your data stays local'
                  opened={this.state.category1Opened}
                  onChange={() => this.setState({ category1Opened: !this.state.category1Opened })}
                >
                {TorrentSearchApi.getProviders().filter(tsa => !tsa.public).map(tsa =>
                <div>
                  <FormTitle>{tsa.name}</FormTitle>
                  <TextInput
                    note="Username"
                    defaultValue={getSetting(`${tsa.name}Username`, "")}
                    required={false}
                    onChange={val => updateSetting(`${tsa.name}Username`, val)}
                  >
                  </TextInput>
                  <TextInput
                    note="Password"
                    defaultValue={getSetting(`${tsa.name}Password`, "")}
                    required={false}
                    onChange={val => updateSetting(`${tsa.name}Password`, val)}
                  >
                  </TextInput>
                  <hr class="solid"></hr>
                </div>)}
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
