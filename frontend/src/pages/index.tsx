import React, { useState } from 'react';
import TodoList from '../components/TodoList';
import AddTodoForm from '../components/AddTodoForm';
import { TodoItem } from '../models/TodoItem';

const IndexPage: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', title: 'Learn TypeScript', completed: false },
    { id: '2', title: 'Build a Todo App', description: 'Use Next.js and Tailwind CSS', completed: false },
  ]);

  const addTodo = (todo: TodoItem) => {
    setTodos((prevTodos) => [...prevTodos, todo]);
  };

  const deleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const toggleTodoCompletion = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="flex justify-center bg-gray-100">
      <div className="w-50 max-w-[66vw] p-1 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-1">Todo List</h1>
        <AddTodoForm onAddTodo={addTodo}/>
        <br></br>
        <TodoList items={todos} onDeleteTodo={deleteTodo} onToggleTodoCompletion={toggleTodoCompletion} />
      </div>
    </div>
  );
};

export default IndexPage;
