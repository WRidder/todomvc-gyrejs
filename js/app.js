(function (window) {
	'use strict';
	const TodoAppContainer = app.getContainer(app.todosGyre);
	const TodoApp = app.ReactHoC("todos", app.TodoApp);

	ReactDOM.render(
		<TodoAppContainer><TodoApp/></TodoAppContainer>,
		document.getElementsByClassName('todoapp')[0]
	);

})(window);
