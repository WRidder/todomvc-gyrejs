(function (window) {
	'use strict';

	// Create local gyre
	const localGyre = GyreJS.createGyre("local");
	localGyre.addActions(app.localActions);
	localGyre.setState(Immutable.Map({
		nowShowing: app.ALL_TODOS,
		todos: Immutable.List(),
		editing: null
	}));

	// Logger middleWare
	localGyre.use(GyreJS.middleWare.dispatchLogger);

	const TodoAppContainer = app.getContainer(localGyre);
	const TodoApp = localGyre.reactHoC(["nowShowing", "todos", "editing"], app.TodoApp);

	ReactDOM.render(
		<TodoAppContainer><TodoApp/></TodoAppContainer>,
		document.getElementsByClassName('todoapp')[0]
	);

})(window);
