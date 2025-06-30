import React, { useState } from 'react';
import { TodoItem } from '../models/TodoItem';

interface AddTodoFormProps {
  onAddTodo: (todo: Omit<TodoItem, 'id'>) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setIsSubmitting(true);

    const newTodo: Omit<TodoItem, 'id'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
    };

    try {
      await onAddTodo(newTodo);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setIsSubmitting(false);
    }
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
      <button
        type="submit"
        className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  );
};

export default AddTodoForm;
