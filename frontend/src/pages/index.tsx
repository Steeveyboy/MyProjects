import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import TodoList from '../components/TodoList';
import AddTodoForm from '../components/AddTodoForm';
import { TodoItem } from '../models/TodoItem';
import { todoService } from '../services/todoService';

const IndexPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Only fetch todos if authenticated
    if (status === 'authenticated') {
      // Fetch todos on component mount
      const fetchTodos = async () => {
        try {
          setLoading(true);
          const todos = await todoService.getAllTodos();
          setTodos(todos);
          setError(null);
        } catch (err) {
          setError('Failed to load todos. Please try again later.');
          // Fallback to sample data if API fails
          setTodos([
            { id: '1', title: 'Learn TypeScript', completed: false },
            { id: '2', title: 'Build a Todo App', description: 'Use Next.js and Tailwind CSS', completed: false },
          ]);
        } finally {
          setLoading(false);
        }
      };

      fetchTodos();
    }
  }, [status]);

  const addTodo = async (todo: Omit<TodoItem, 'id'>) => {
    try {
      setLoading(true);
      const newTodo = await todoService.addTodo(todo);
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setError(null);
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      // Fallback to client-side addition if API fails
      setTodos(prevTodos => [...prevTodos, {
        ...todo,
        id: Date.now().toString() // Generate a temporary ID
      } as TodoItem]);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setLoading(true);
      await todoService.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      // Proceed with UI removal even if API fails
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const toggleTodoCompletion = async (id: string) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;

      setLoading(true);
      const updatedTodo = await todoService.toggleTodoCompletion(id, !todoToUpdate.completed);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? updatedTodo : todo
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      // Fallback to client-side update if API fails
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // If loading auth status, show loading spinner
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect via useEffect)
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="flex justify-center bg-gray-100">
      <div className="w-50 max-w-[66vw] p-1 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Todo List</h1>
          <div className="flex items-center">
            {session?.user?.image && (
              <img 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <span className="font-medium mr-3">{session?.user?.name}</span>
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <AddTodoForm onAddTodo={addTodo}/>
        <br></br>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <TodoList items={todos} onDeleteTodo={deleteTodo} onToggleTodoCompletion={toggleTodoCompletion} />
        )}
      </div>
    </div>
  );
};

export default IndexPage;
