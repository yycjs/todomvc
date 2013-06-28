/*global can */
(function (namespace, undefined) {
	'use strict';

	// Basic Todo entry model
	// { text: 'todo', complete: false }
	var Todo = can.Model({
		findAll: function(params) {
			var deferred = can.Deferred();
			socket.emit('todo::findAll', function(data) {
		  	deferred.resolve(data);
		  });
		  return deferred;
		},
		create: function(data) {
			socket.emit('todo::create', data);
			var deferred = can.Deferred();
			deferred.resolve(data);
			return deferred;
		},
		update: function(id, data) {
			var deferred = can.Deferred();
			socket.emit('todo::update', data);
			deferred.resolve(data);
			return deferred;
		}
	}, {
		// Returns if this instance matches a given filter
		// (currently `active` and `complete`)
		matches : function () {
			var filter = can.route.attr('filter');
			return !filter || (filter === 'active' && !this.attr('complete')) ||
				(filter === 'completed' && this.attr('complete'));
		}
	});

	window.socket.on('todo created', function(todoData) {
		console.log('Triggering todo create', todoData);
		can.trigger(Todo, 'created', new Todo(todoData));
	});

	window.socket.on('todo updated', function(todoData) {
		console.log('Triggering todo update', todoData);
		can.trigger(Todo, 'updated', Todo.model(todoData));
	});

	// List for Todos
	Todo.List = can.Model.List({
		completed: function () {
			var completed = 0;

			this.each(function (todo) {
				completed += todo.attr('complete') ? 1 : 0;
			});

			return completed;
		},

		remaining: function () {
			return this.attr('length') - this.completed();
		},

		allComplete: function () {
			return this.attr('length') === this.completed();
		}
	});

	namespace.Models = namespace.Models || {};
	namespace.Models.Todo = Todo;
})(this);
