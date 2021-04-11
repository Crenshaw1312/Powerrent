const { React } = require('powercord/webpack');
const { TextInput, SwitchItem, Category } = require('powercord/components/settings');

module.exports = ({ getSetting, updateSetting, toggleSetting, setState }) => (
  <div>

    <TextInput
      note='Where to put torrented files'
      defaultValue={getSetting('dlPath', 'C:\\Users\\HP\\Downloads')}
      required={true}
      onChange={val => updateSetting('dlPath', val)}
    >
      File Path
    </TextInput>

    <Category
      name='Blacklist'
      description={'Blacklist sites from being used in any command, including search'}
      opened={this.state.categoryOpened}
      onChange={() => setState({ categoryOpened: !this.state.categoryOpened })}
    >
        <SwitchItem
          note='Test'
          value={getSetting('send', false)}
          onChange={() => toggleSetting('send')}
        >
            Send Link
        </SwitchItem>
    </Category>
  </div>
);
