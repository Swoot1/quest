var React = require("react"),
	LinkContainer = require("react-router-bootstrap").LinkContainer,
	IndexLinkContainer = require("react-router-bootstrap").IndexLinkContainer,
	Button = require("react-bootstrap").Button,
	NavItem = require("react-bootstrap").NavItem,
	Nav = require("react-bootstrap").Nav,
	ButtonGroup = require("react-bootstrap").ButtonGroup;

var Navigation = React.createClass({
	displayName: "Navigation",
    render: function() {
        return (
			<div>
				<Nav bsStyle="pills">
						<IndexLinkContainer to="/"><NavItem>Home</NavItem></IndexLinkContainer>
						<NavItem disabled>Help</NavItem>
				</Nav>

			</div>
		);
	}
});

module.exports = Navigation;