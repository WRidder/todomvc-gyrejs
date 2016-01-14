(function (window) {
	// Constants
	app.ALL_TODOS = 'all';
	app.ACTIVE_TODOS = 'active';
	app.COMPLETED_TODOS = 'completed';

	// Commands
	const commands = {
		"setShowing": (gyre, mode) => {
			if ([app.ALL_TODOS, app.ACTIVE_TODOS, app.COMPLETED_TODOS].indexOf(mode) === -1) {
				throw new Error(`cmd:setShowing: Invalid mode ${mode} given`);
			}
			gyre.getAggregate("posts-showing").setShowing(mode);
		},
		setEditing: (gyre, value) => {
			gyre.trigger("editingTodo", value);
		},
		addTodo: (gyre, title) => {
			gyre.trigger("todoAdded", app.Utils.uuid(), title);
		}
	};

	// Events
	const events = {
		"updatedShowing": (value) => ({showing: value}),
		"editingTodo": (id) => ({id}),
		"todoAdded": ["id", "title"],
		"todoToggled": ["id"],
		"todoSaved": ["id", "title"],
		"todoRemoved": ["id"],
		"allTodosToggled": ["checked"],
		"completedTodosCleared": []
	};

	const aggregates = {
		"posts-showing": {
			eventFilter: (event) => true,
			methods: {
				setShowing: (state, gyre, mode) => {
					if (mode !== state.showing) {
						gyre.trigger("updatedShowing", mode);
					}
				}
			},
			reducer: (state = {showing: app.ALL_TODOS}, {type, showing}) => {
				switch (type) {
					case "updatedShowing": {
						return Object.assign({}, state, {
							showing: showing
						});
					}
					default: {
						return state;
					}
				}
			}
		}
	};

	const initialTodosState = {
		nowShowing: app.ALL_TODOS,
		editing: null,
		todos: []
	};
	const projections = {
		todos: (state = initialTodosState, event) => {
			switch (event.type) {
				case "updatedShowing":
					return Object.assign({}, state, {
						nowShowing: event.showing
					});
				case "editingTodo":
					return Object.assign({}, state, {
						editing: event.id
					});
				case "todoAdded":
					return Object.assign({}, state, {
						todos: [
							{
								id: event.id,
								title: event.title,
								completed: false
							},
							...state.todos
						]
					});
				case "todoToggled":
					return Object.assign({}, state, {
						todos: state.todos.map(todo =>
								todo.id === event.id ?
									Object.assign({}, todo, { completed: !todo.completed }) :
									todo
						)
					});
				case "todoSaved":
					return Object.assign({}, state, {
						todos: state.todos.map(todo =>
								todo.id === event.id ?
									Object.assign({}, todo, { title: event.title }) :
									todo
						)
					});
				case "todoRemoved":
					return Object.assign({}, state, {
						todos: state.todos.filter(todo =>
							todo.id !== event.id
						)
					});
				case "allTodosToggled":
					const areAllMarked = state.todos.every(todo => todo.completed);
					return Object.assign({}, state, {
						todos: state.todos.map(todo => Object.assign({}, todo, {
							completed: !areAllMarked
						}))
					});
				case "completedTodosCleared":
					return Object.assign({}, state, {
						todos: state.todos.filter(todo => todo.completed === false)
					});
				default:
					return state;
			}
		}
	};

	// Create local gyre
	app.todosGyre = GyreJS.createGyre({
		commands,
		events,
		aggregates,
		projections
	});
})(window);
