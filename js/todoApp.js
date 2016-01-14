(function (window) {
	'use strict';
	var TodoFooter = app.TodoFooter;
	var TodoItem = app.TodoItem;
	var ENTER_KEY = 13;

	app.TodoApp = React.createClass({
		contextTypes: {
			gyre: React.PropTypes.object.isRequired
		},
		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = ReactDOM.findDOMNode(this.refs.newField).value.trim();

			if (val) {
				this.context.gyre.issue("addTodo", val);
				ReactDOM.findDOMNode(this.refs.newField).value = '';
			}
		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			this.context.gyre.issue("toggleAll", checked);
		},

		toggle: function (todo) {
			this.context.gyre.trigger("todoToggled", todo.id);
		},

		destroy: function (todo) {
			this.context.gyre.trigger("todoRemoved", todo.id);
		},

		edit: function (todo) {
			this.context.gyre.issue("setEditing", todo.id);
		},

		save: function (todo, text) {
			this.context.gyre.trigger("todoSaved", todo.id, text);
		},

		cancel: function () {
			this.context.gyre.issue("setEditing", null);
		},

		clearCompleted: function () {
			this.context.gyre.trigger("completedTodosCleared");
		},

		render: function () {
			var footer;
			var main;
			const self = this;
			const {todos, nowShowing, editing} = this.props;

			var shownTodos = todos.filter(todo => {
				switch (nowShowing) {
					case app.ACTIVE_TODOS:
						return !todo.completed;
					case app.COMPLETED_TODOS:
						return todo.completed;
					default:
						return true;
				}
			});

			var activeTodoCount = todos.reduce(function (accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);

			var completedCount = todos.size - activeTodoCount;

			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={nowShowing}
						onClearCompleted={this.clearCompleted}
						/>;
			}

			if (todos.length > 0) {
				main = (
					<section className="main">
						<input
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeTodoCount === 0}
							/>
						<ul className="todo-list">
							{shownTodos.map(function(todo) {
								return <TodoItem
									key={todo.id}
									todo={todo}
									onToggle={self.toggle.bind(self, todo)}
									onDestroy={self.destroy.bind(self, todo)}
									onEdit={self.edit.bind(self, todo)}
									editing={editing === todo.id}
									onSave={self.save.bind(self, todo)}
									onCancel={self.cancel}
								/>
							})}
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
