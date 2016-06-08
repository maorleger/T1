/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


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
        raw_text: '' 
      }
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      json: {
        raw_text: nextProps.text
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
