const { React, getModule, constants: { SpotifyEndpoints }, i18n: { Messages } } = require('powercord/webpack');
const { FormTitle, Button } = require('powercord/components');
const { Modal } = require('powercord/components/modal');
const { close: closeModal } = require('powercord/modal');

module.exports = class SearchResults extends React.PureComponent {

    constructor () {
        super();
    
        this.state = {
          results: [],
          search: ""
        };
      }
    
      async componentDidMount () {
        this.setState({ results: await this.props.results, search: await this.props.search });
      }

  render () {
    const { size16 } = getModule([ 'size16' ], false);
    const { marginBottom20 } = getModule([ 'marginBottom20' ], false);

    // format results
    const { results, search } = this.state;
    const resultsList = [];
    const amount = results.length
    results.forEach(result => {
      resultsList.push(
          <div className={`${size16} ${marginBottom20}`}>
              <FormTitle tag='h3'><a href={result.desc} target="_blank">{result.title}</a></FormTitle>
              Provider: {result.provider}<br></br>
              Size: {result.size} - Seeds: {result.seeds} - Peers: {result.peers}
              <hr class="rounded"></hr>
              { results[amount - 1] !== result ? "" : <div><br></br><a href="https://discord.com/invite/CgapbDJ8GX" tag="_blank">Support server</a><br></br>Made by Crenshaw#1312 and Team Pirate Haven</div>}
          </div>
        );
    });

    return (
      <Modal className='powercord-text'>
        <Modal.Header>
          <FormTitle tag='h4'>Search Results ({amount})</FormTitle>
          <Modal.CloseButton onClick={() => closeModal()}/>
        </Modal.Header>
        <Modal.Content>
            {resultsList}
        </Modal.Content>
        <Modal.Footer>
            {search}
        </Modal.Footer>
      </Modal>
    );

  }
}
