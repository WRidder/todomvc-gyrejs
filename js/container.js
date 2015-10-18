(function () {
	'use strict';

	app.getContainer = (AH) => React.createClass({
		childContextTypes: {
			AH: React.PropTypes.object.isRequired
		},
		getChildContext: function() {
			return {
				AH: AH
			};
		},
		componentDidMount: function () {
			var router = Router({
				'/': () => AH.dispatch("setShowing", app.ALL_TODOS),
				'/active': () => AH.dispatch("setShowing", app.ACTIVE_TODOS),
				'/completed': () => AH.dispatch("setShowing", app.COMPLETED_TODOS)
			});
			router.init('/');
		},
		render: function() {
			return this.props.children;
		}
	});
})();
