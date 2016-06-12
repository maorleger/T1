var parseText = function(raw_text, regex) {
  let retVal = {
    full_match: '',
    parsed_value: ''
  };
  if (raw_text && raw_text.length > 0) {
    let match = regex.exec(raw_text);
    if (match && match.length > 0) {
      retVal.full_match = match[0];
      retVal.parsed_value = match[1];
    }
  }
  return retVal;
}

var buildDescription = function(raw_text, estimate_match, name_match) {
  return raw_text.
    replace(estimate_match.full_match, '').
    replace(name_match.full_match, '').
    replace(/\s+/g, ' ');;
}

var buildJson = function(raw_text = "") {
  let estimate = parseText(raw_text, /\best:([0-3])\b/g);
  let name = parseText(raw_text, /\bnm:(.*)\\nm\b/g);
  return {
      raw_text: raw_text,
      estimate: estimate.parsed_value,
      name: name.parsed_value,
      description: buildDescription(raw_text, estimate, name)
  };
}

var Tracker = React.createClass({
  getInitialState: function() {
    return {
      json: buildJson(),
      project_id: '',
      token: "20965d3a9adc21d4a816fb9dbf822108",
      baseTrackerUrl: "https://www.pivotaltracker.com/services/v5/projects/"
    };
  },
  handleTextChange: function(textValue) {
    this.setState({
      json: buildJson(textValue)
    });
  },
  handleOnClick: function(event) {
    var serverRequest = $.ajax(
      this.state.baseTrackerUrl + this.state.project_id + "/stories",
      {
        headers: {"X-TrackerToken": this.state.token},
        data: {
          estimate: this.state.json.estimate,
          description: this.state.json.description,
          name: this.state.json.name
        },
        dataType: "json",
        type: "POST"
      }
    )
    .done(function(projects) {
      this.setState({
        json: projects
      });
      //TODO: add something here, maybe show a link to the tracker story?
      }.bind(this));
  },
  handleDropdownChange: function(event) {
    this.setState({
      project_id: event.target.value
    })
  },
  render: function() {
    return (
      <div className="tracker">
        <TrackerProjectDropdown 
          url={this.state.baseTrackerUrl}
          token={this.state.token}
          onChange={this.handleDropdownChange}
        />
        <TrackerInput updateText={this.handleTextChange} />
        <TrackerOutput json={this.state.json} project_id={this.state.project_id}/>
        <TrackerProjectSubmit OnClick={this.handleOnClick}  />
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
        <textarea type="text" className="form-control" name="text" ref="text" onChange={this.handleTextChange} placeholder="Let's Track!" />
      </div>
    );
  }
});

var TrackerOutput = React.createClass({
  getInitialState: function() {
    return {
      json: this.props.json
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      json: nextProps.json
    });
  },
  render: function() {
    return (
      <div className="trackerOutput">
        <pre>{JSON.stringify(this.props.json, null, 2)}</pre>
        <div>project_id:{this.props.project_id}</div>
      </div>
    );
  }
});

var TrackerProjectDropdown = React.createClass({
  getInitialState: function() {
    return {
      projects: []
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
      });
    }.bind(this));
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  render: function() {
    return (
      <div className="trackerProjectDropdown">
        <select onChange={this.props.onChange}
          className="form-control">
          <option key="" value="">-- Please Select -- </option>
          {this.state.projects.map(function(project) {
            return <option key={project.id} value={project.id}>{project.name}</option>
          })}
        </select>
          
      </div>
    );
  }
});

var TrackerProjectSubmit = React.createClass({
  render: function() {
    return (
      <div className="trackerSubmit">
        <input type="submit" onClick={this.props.OnClick} value="submit!" />
      </div>
    );
  }
});

var TrackerProjectSelectOptions = 

ReactDOM.render(
  <Tracker />,
  document.getElementById('content')
);
