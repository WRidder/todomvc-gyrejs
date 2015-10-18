(function (window) {
	var IMap = Immutable.Map;
	app.localActions = {
		"setShowing": (state, value) =>
			state.set("nowShowing", value),

		"setEditing": (state, value) =>
			state.set("editing", value),

		"todo:add": (state, value) =>
			state.set("todos", state.get("todos").push(IMap({
				id: app.Utils.uuid(),
				title: value,
				completed: false
			}))),

		"todo:toggle": (state, id) =>
			state.map((value, key) =>
				key === "todos"
					? value.map(todo =>
						todo.get("id") === id
					 		? todo.set("completed", !todo.get("completed"))
							: todo
					)
					: value
			),

		"todo:save": (state, id, text) =>
			state.map((value, key) => {
				if (key === "todos") {
					return value.map(todo => {
						if (todo.get("id") === id) {
							todo = todo.set("title", text);
						}
						return todo;
					});
				}
				if (key === "editing") {
					return null;
				}
				return value;
			}),

		"todo:toggleAll": (state, checked) =>
			state.map((value, key) =>
				key === "todos"
					? value.map(todo => todo.set("completed", checked))
					: value
			),

		"todo:clearCompleted": (state) =>
			state.map((value, key) =>
				key === "todos"
					? value.filter(todo => !todo.get("completed"))
					: value
			),

		"todo:remove": (state, id) =>
			state.map((value, key) =>
				key === "todos"
					? value.filter(todo => todo.get("id") === id)
					: value
			)
	};
})(window);
