import React from 'react';
import TodoItem from './TodoItem';
import { TodoItem as TodoItemModel } from '../models/TodoItem';

interface TodoListProps {
  items: TodoItemModel[];
  onDeleteTodo: (id: string) => void;
  onToggleTodoCompletion: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ items, onDeleteTodo, onToggleTodoCompletion }) => {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <TodoItem
          key={item.id}
          item={item}
          onDelete={() => onDeleteTodo(item.id)}
          onToggleCompletion={() => onToggleTodoCompletion(item.id)}
        />
      ))}
    </div>
  );
};

export default TodoList;
