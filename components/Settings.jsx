const { React } = require('powercord/webpack');
const { SwitchItem, TextInput, Category, SliderInput } = require('powercord/components/settings');
const { FormTitle } = require('powercord/components');
const TorrentSearchApi = require('torrent-search-api');
const data = require('../data.json')

module.exports = class PowerrentSettings extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { 
      category0Opened: false,
      category1Opened: false,
      category2Opened: false,
    }
	}

	render() {
		const { getSetting, updateSetting } = this.props;
    let tags = getSetting('tags', data.newsDefault)
    if (data.newsDefault.length != tags) tags = data.newsDefault

		return (
            <>
            <FormTitle>Made by <a href="https://discord.com/invite/Qx2hyttRsU" target="_blank">Crenshaw#1312</a> and <a href="https://disboard.org/server/766672915441385472" target="_blank">Team Pirate Haven</a></FormTitle>
            <br></br><br></br>
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

              <SliderInput
                note="Amount of links to make direct magnets, from top down"
                initialValue={ getSetting('magnatize', 5) }
                minValue={ 1 } maxValue={ 100 }
                markers={[ 1, 5, 10, 15, 25, 50, 75, 100 ]}
                stickToMarkers={true}
                onValueChange={ v => updateSetting('magnatize', v) }
              >
                Magnatize
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
                    onChange={val => updateSetting(`${tsa.name}Username`, val ? val.trim() : "")}
                  >
                  </TextInput>
                  <TextInput
                    note="Password"
                    defaultValue={getSetting(`${tsa.name}Password`, "")}
                    required={false}
                    onChange={val => updateSetting(`${tsa.name}Password`, val ? val.trim() : "")}
                  >
                  </TextInput>
                  <hr class="solid"></hr>
                </div>)}
              </Category>

              <Category
                name='News'
                description='Manage news categories'
                opened={this.state.category2Opened}
                onChange={() => this.setState({ category2Opened: !this.state.category2Opened })}
              >
                <>
                  <SwitchItem
                    value={getSetting('showSnippet', true)}
                    onChange={(val) => updateSetting('showSnippet', val)}
                  >
                    Show Article Snippet
                  </SwitchItem>
                  <hr class="solid"></hr>
                  <br></br>
                  {tags.map((category, index) => <SwitchItem
                    value={category.enabled}
                    note={<><a href={"https://torrentfreak.com/tag/" + category.tag} target="_blank">{"https://torrentfreak.com/tag/" + category.tag}</a></>}
                    onChange={val => {
                      tags[index].enabled = val
                      updateSetting('tags', tags)
                  }}
                  >
                  {category.name}
                  </SwitchItem>)}
                  </>
              </Category>
            </>
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