var Tracker = React.createClass({
  getInitialState: function() {
    return {
      text: ''
    };
  },
  handleTextChange: function(textValue) {
    this.setState({
      text: textValue
    });
  },
  render: function() {
    return (
      <div className="tracker">
        <TrackerInput updateText={this.handleTextChange} />
        <TrackerOutput text={this.state.text}/>
      </div>
    );
  }
});

var TrackerInput = React.createClass({
  handleTextChange: function() {
    var value= this.refs.text.value;
    this.props.updateText(value);
  },
  render: function() {
    return (
      <div className="trackerInput">
        <input type="text" name="text" ref="text" onChange={this.handleTextChange} placeholder="Let's Track!" />
      </div>
    );
  }
});

var TrackerOutput = React.createClass({
  getInitialState: function() {
    return {
      json: {
        raw_text: '',
        project_id: '',
        estimate: ''
      }
    };
  },
  componentWillReceiveProps: function(nextProps) {
    let theMatchOrEmptyString = function(match) {
      return match && match.length > 0 ? match[1] : '';
    }
    let parseProjectId = function(raw_text) {
      const regex = /pid:(\d+)/g;
      let match = regex.exec(raw_text);
      return theMatchOrEmptyString(match);
    }
    let parseEstimate = function(raw_text) {
      const regex = /est:(\d+)/g;
      let match = regex.exec(raw_text);
      return theMatchOrEmptyString(match);
    }
    this.setState({
      json: 
      {
        raw_text: nextProps.text,
        project_id: parseProjectId(nextProps.text),
        estimate: parseEstimate(nextProps.text)
      }
    });
  },
  render: function() {
    return (
      <div className="trackerOutput">
        <pre>{JSON.stringify(this.state.json)}</pre>
      </div>
    )
  }
});

ReactDOM.render(
  <Tracker />,
  document.getElementById('content')
);
