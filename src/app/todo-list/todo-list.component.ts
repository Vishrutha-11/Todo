import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { Todo } from '../models/todo';
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  todos: Todo[] = [];
  newTodo = '';
editingId: number | null = null;
  constructor(private todoService: TodoService) {}
ngOnInit(): void {
  console.log('Component Loaded');
  this.loadTodos();
}
startEdit(id: number) {
  console.log('Edit clicked:', id);
  this.editingId = id;
}

updateTodo(todo: Todo) {

  this.todoService.updateTodo(todo.id, todo)
    .subscribe({
      next: () => {
        this.editingId = null;
        this.loadTodos();
      },
      error: (err) => {
        console.error(err);
      }
    });
}
toggleTodo(todo: Todo) {

  const updatedTodo = {
    ...todo,
    isCompleted: !todo.isCompleted
  };

  this.todoService
      .updateTodo(todo.id, updatedTodo)
      .subscribe({
        next: () => {

          todo.isCompleted = updatedTodo.isCompleted;

        },
        error: (err) => {
          console.error(err);
        }
      });
}
loadTodos() {
  this.todoService.getTodos().subscribe({
    next: (data) => {
      console.log('API Response:', data);
      this.todos = data;
    },
    error: (err) => {
      console.error('API Error:', err);
    }
  });
}

addTodo() {

  if (!this.newTodo.trim()) {
    return;
  }

  const todo = {
    title: this.newTodo,
    isCompleted: false
  };

  this.todoService.addTodo(todo)
    .subscribe(() => {

      this.newTodo = '';
      this.loadTodos();

    });
}

  deleteTodo(id: number) {

    this.todoService.deleteTodo(id)
      .subscribe(() => {

        this.loadTodos();
      });
  }
}
