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
  parseText: function(raw_text, regex) {
    let retVal = '';
    if (raw_text && raw_text.length > 0) {
      let match = regex.exec(raw_text);
      retVal = match && match.length > 0 ? match[1] : '';  
    }
    return retVal;
  },
  buildJson: function(raw_text = "") {
    return {
      raw_text: raw_text,
      project_id: this.parseText(raw_text, /pid:(\d+)/g),
      estimate: this.parseText(raw_text, /est:([0-3])/g)
    };
  },
  getInitialState: function() {
    return {
      json: this.buildJson()
    };
  },
  componentWillReceiveProps: function(nextProps) {
    
    this.setState({
      json: this.buildJson(nextProps.text)
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
