var React = require("react"),
	ReactDOM = require("react-dom"),
	ReactRedux = require("react-redux"),
	actions = require("./../actions"),
	constants = require("./../constants"),
	messageGen = require("./messagegen"),
	proptypes = React.PropTypes,
	Input = require("react-bootstrap").Input;

var PlayerBar = React.createClass({
	displayName: "PlayerBar",
	propTypes: {
		input: proptypes.string.isRequired,
		prevInput: proptypes.string.isRequired,
		showMessage: proptypes.func.isRequired,
		setName: proptypes.func.isRequired,
		setInputExpected: proptypes.func.isRequired
	},
	componentDidMount: function() {
 		this.input.getInputDOMNode().focus();
	},
	getInitialState: function() {
		return { text: "" };
	},
	handleChange: function(event) {
		this.setState({ text: event.target.value });
	},
	handleSubmit: function(event) {
		if (event.keyCode == 13) { // If it's enter key
			if (this.state.text) {
				this.validateAndSendInput(this.state.text);
				this.setState({ text: "" });
			}
		}
	},
	validateAndSendInput: function(input) {
		switch (this.props.input) {
			case constants.DISABLED:
				break; // Should not be doing anything
			case constants.EXPECTING_NAME:
				// Validate the length of the name
				var message;
				if (input.length > constants.MAX_NAME_LENGTH || input.length < constants.MIN_NAME_LENGTH) {
					message = { speaker: "Wizard", line: "Hmmm... are you sure about that? Around here, names are usually between " + constants.MIN_NAME_LENGTH +
						" and " + constants.MAX_NAME_LENGTH + " characters in length! How about trying again?" };
				} else {
					message = { speaker: "Wizard", line: constants.NAME + " you say? Weird name... are you sure about that?" };
					this.props.setName(input);
					this.props.setInputExpected(constants.EXPECTING_CONF);
				}
				this.props.showMessage(message); // Display the message
				break;
			case constants.EXPECTING_CONF:
				var message;
				if (input.toUpperCase() === "YES" || input.toUpperCase() === "Y") {
					message = messageGen.getConfirmMessage(this.props.prevInput);
					switch (this.props.prevInput) {
						// TODO
						default:
							this.props.setInputExpected(constants.DISABLED);
							break;
					}
				} else if (input.toUpperCase() === "NO" || input.toUpperCase() === "N") {
					message = messageGen.getDenyMessage(this.props.prevInput);
					this.props.setInputExpected(this.props.prevInput);
				} else {
					message = messageGen.getFailMessage(this.props.prevInput);
				}
				this.props.showMessage(message); // Display the message
				break;
			default:
				break;;
		}
	},
	render: function() {
		return (
			<Input type="text" placeholder="Type here!" ref={(ref) => this.input = ref} disabled={this.props.input === constants.DISABLED}
				value={this.state.text} onChange={this.handleChange} onKeyDown={this.handleSubmit} />
		);
	}
});

var mapStateToProps = function (state) {
	return { input: state.input.awaiting, prevInput: state.input.previous };
};

var mapDispatchToProps = function (dispatch) {
	return {
		showMessage: function(message) {
			dispatch(actions.showMessage(message));
		},
		setName: function(name) {
			dispatch(actions.setName(name));
		},
		setInputExpected: function(inputType) {
			dispatch(actions.setInputExpected(inputType));
		}
	}
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PlayerBar);