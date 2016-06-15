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

var buildDescription = function(raw_text) {
  for (var i = 1; i < arguments.length; i++) {
    raw_text = raw_text.replace(arguments[i].full_match, '');
  }
  return raw_text.replace(/\s+/g, ' ');
}

var buildJson = function(raw_text = "") {
  let estimate = parseText(raw_text, /\best:([0-3])\b/g);
  let name = parseText(raw_text, /\bnm:(.*)\\nm\b/g);
  let story_type = parseText(raw_text, /\btype:(feature|bug|chore|release)\b/g);
  let integration_id = parseText(raw_text, /\bintid:(\d+)\b/g);
  let json = {
    description: buildDescription(raw_text, estimate, name, story_type, integration_id)
  };
  if (estimate.parsed_value) {
    json['estimate'] = estimate.parsed_value;
  }
  if (name.parsed_value) {
    json['name'] = name.parsed_value;
  }
  if (story_type.parsed_value) {
    json['story_type'] = story_type.parsed_value;
  }
  if (integration_id.parsed_value) {
    json['integration_id'] = integration_id.parsed_value;
  }
  return json;
}

var Tracker = React.createClass({
  getInitialState: function() {
    return {
      json: buildJson(),
      project_id: '',
      status: 'parser',
      story_url: ''
    };
  },
  handleTextChange: function(textValue) {
    this.setState({
      json: buildJson(textValue)
    });
  },
  handleOnClick: function(event) {
    var serverRequest = $.ajax(
      this.props.baseTrackerUrl + this.state.project_id + "/stories",
      {
        headers: {"X-TrackerToken": this.props.token},
        data: this.state.json,
        dataType: "json",
        type: "POST"
      }
    )
    .done(function(response) {
      this.setState({
        json: response,
        status: 'success',
        story_url: response['url']
      });
      }.bind(this))
    .error(function(response) {
      this.setState({
        json: response,
        status: 'error'
      });
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
          url={this.props.baseTrackerUrl}
          token={this.props.token}
          onChange={this.handleDropdownChange}
        />
        <TrackerInput updateText={this.handleTextChange} />
        <TrackerOutput json={this.state.json} project_id={this.state.project_id} status={this.state.status} story_url={this.state.story_url}/>
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
        <fieldset class="form-group">
          <label for="story-txt">Story data</label>
          <textarea type="text" className="form-control" 
                    name="text" ref="text" id="story-txt"
                    onChange={this.handleTextChange} 
                    placeholder="Let's Track!" />
        </fieldset>
      </div>
    );
  }
});

var TrackerOutput = React.createClass({
  render: function() {
    return (
      <div className="trackerOutput">
        <hr />
        <div><a href={this.props.story_url} target="_blank">{this.props.story_url}</a></div>
        <p><strong>{this.props.status} output:</strong></p>
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
        <fieldset class="form-group">
          <label for="project-ddl">Project</label>
          <select onChange={this.props.onChange}
            className="form-control" id="project-ddl">
            <option key="" value="">-- Please Select -- </option>
            {this.state.projects.map(function(project) {
              return <option key={project.id} value={project.id}>{project.name}</option>
            })}
          </select>
        </fieldset>
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

ReactDOM.render(
  <Tracker token="" baseTrackerUrl="https://www.pivotaltracker.com/services/v5/projects/"/>,
  document.getElementById('content')
);
