(function (window) {
	'use strict';

	app.ALL_TODOS = 'all';
	app.ACTIVE_TODOS = 'active';
	app.COMPLETED_TODOS = 'completed';
	var TodoFooter = app.TodoFooter;
	var TodoItem = app.TodoItem;
	var ENTER_KEY = 13;

	app.TodoApp = React.createClass({
		contextTypes: {
			AH: React.PropTypes.object.isRequired
		},
		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = ReactDOM.findDOMNode(this.refs.newField).value.trim();

			if (val) {
				this.context.AH.dispatch("todo:add", val);
				ReactDOM.findDOMNode(this.refs.newField).value = '';
			}
		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			this.context.AH.dispatch("todo:toggleAll", checked);
		},

		toggle: function (todo) {
			this.context.AH.dispatch("todo:toggle", todo.get("id"));
		},

		destroy: function (todo) {
			this.context.AH.dispatch("todo:remove", todo.get("id"));
		},

		edit: function (todo) {
			this.context.AH.dispatch("setEditing", todo.get("id"));
		},

		save: function (todo, text) {
			this.context.AH.dispatch("todo:save", todo.get("id"), text);
		},

		cancel: function () {
			this.context.AH.dispatch("setEditing", null);
		},

		clearCompleted: function () {
			this.context.AH.dispatch("todo:clearCompleted");
		},

		render: function () {
			var footer;
			var main;
			var todos = this.props.data.todos;
			console.log("the todos", todos);

			var shownTodos = todos.filter(function (todo) {
				switch (this.props.data.nowShowing) {
					case app.ACTIVE_TODOS:
						return !todo.get("completed");
					case app.COMPLETED_TODOS:
						return todo.get("completed");
					default:
						return true;
				}
			}, this);

			var todoItems = shownTodos.map(function (todo) {
				return (
					<TodoItem
						key={todo.get("id")}
						todo={todo}
						onToggle={this.toggle.bind(this, todo)}
						onDestroy={this.destroy.bind(this, todo)}
						onEdit={this.edit.bind(this, todo)}
						editing={this.props.data.editing === todo.get("id")}
						onSave={this.save.bind(this, todo)}
						onCancel={this.cancel}
						/>
				);
			}, this);

			var activeTodoCount = todos.reduce(function (accum, todo) {
				return todo.get("completed") ? accum : accum + 1;
			}, 0);

			var completedCount = todos.size - activeTodoCount;

			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={this.props.data.nowShowing}
						onClearCompleted={this.clearCompleted}
						/>;
			}

			if (todos.size) {
				main = (
					<section className="main">
						<input
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeTodoCount === 0}
							/>
						<ul className="todo-list">
							{todoItems}
						</ul>
					</section>
				);
			}

			return (
				<div>
					<header className="header">
						<h1>todos</h1>
						<input
							ref="newField"
							className="new-todo"
							placeholder="What needs to be done?"
							onKeyDown={this.handleNewTodoKeyDown}
							autoFocus={true}
							/>
					</header>
					{main}
					{footer}
				</div>
			);
		}
	});

})(window);
