(function () {
	'use strict';

	app.getContainer = (gyre) => React.createClass({
		childContextTypes: {
			gyre: React.PropTypes.object.isRequired
		},
		getChildContext: function() {
			return {
				gyre
			};
		},
		componentDidMount: function () {
			var router = Router({
				'/': () => gyre.issue("setShowing", app.ALL_TODOS),
				'/active': () => gyre.issue("setShowing", app.ACTIVE_TODOS),
				'/completed': () => gyre.issue("setShowing", app.COMPLETED_TODOS)
			});
			router.init('/');
		},
		render: function() {
			return this.props.children;
		}
	});

	app.ReactHoC = (projection, Component) => {
		return React.createClass({
			displayName: "GyreJS-HoC",
			contextTypes: {
				gyre: React.PropTypes.object
			},
			componentWillMount() {
				this.unRegisterListener = this.context.gyre.addListener(projection, this.handleNewData);
			},
			componentWillUnmount() {
				this.unRegisterListener();
			},
			handleNewData(data) {
				this.setState(data);
			},
			render() {
				// Render wrapped component with current props and state as props.
				return (
					(!this.state) ?
						false :
						<Component {...this.props} {...this.state}/>
				);
			}
		})
	};
})();
