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
        <TrackerProjectDropdown 
          url="https://www.pivotaltracker.com/services/v5/projects" 
          token="20965d3a9adc21d4a816fb9dbf822108"
        />
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
    );
  }
});

var TrackerProjectDropdown = React.createClass({
  getInitialState: function() {
    return {
      projects: [
        {id: 98, name: "Learn About the Force"},
        {id: 99, name: "Death Star"}
      ]
    }
  },
  componentDidMount: function() {
    var serverRequest = $.ajax(
      this.props.url,
      {
        headers: {"X-TrackerToken": this.props.token}
      }
    )
    .done(function(projects) {
      this.setState({
        projects: projects
      })
    }.bind(this));
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  render: function() {
    return (
      <div className="TrackerProjectDropdown">
        <select
          className="form-control">
          {this.state.projects.map(function(project) {
            return <option key={project.id} value={project.id}>{project.name}</option>
          })}
        </select>
          
      </div>
    );
  }
});

var TrackerProjectSelectOptions = 

ReactDOM.render(
  <Tracker />,
  document.getElementById('content')
);
