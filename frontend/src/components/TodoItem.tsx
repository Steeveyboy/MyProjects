import React from 'react';
import { TodoItem as TodoItemModel } from '../models/TodoItem';

interface TodoItemProps {
  item: TodoItemModel;
  onDelete: () => void;
  onToggleCompletion: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ item, onDelete, onToggleCompletion }) => {
  return (
    <div className="p-1 py-2 border rounded-md">
      <h3 className="text-lg font-bold">{item.title}</h3>
      {item.description && <p>{item.description}</p>}
      <p>Status: {item.completed ? 'Completed' : 'Pending'}</p>
      <div className="flex space-x-2">
        <button onClick={onToggleCompletion} className="text-blue-500">
          {item.completed ? 'Undo' : 'Complete'}
        </button>
        <button onClick={onDelete} className="text-red-500">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
