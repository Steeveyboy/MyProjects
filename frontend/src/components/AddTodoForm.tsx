import React, { useState } from 'react';
import { TodoItem } from '../models/TodoItem';

interface AddTodoFormProps {
  onAddTodo: (todo: TodoItem) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
    };
    onAddTodo(newTodo);
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1 p-2 border rounded shadow-md">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-1 border rounded"
        required
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-1 border rounded"
        style={{ resize: 'vertical' }}
      />
      <button type="submit" className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
        Add Todo
      </button>
    </form>
  );
};

export default AddTodoForm;
