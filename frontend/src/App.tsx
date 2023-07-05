import React, { useState, useEffect } from 'react';
import './appstyle.css';

interface Todo {
  completed: boolean;
  _id: string;
  name: string;
  __v: number;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/tasks');
      const data = await response.json();
      if (Array.isArray(data.task)) {
        setTodos(data.task);
      } else {
        console.error('Invalid todos data:', data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() === '') return;

    const newTask = {
      name: newTodo,
      completed: false,
    };

    try {
      const response = await fetch('http://localhost:5000/api/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      const updatedTask = { ...newTask, _id: data.task._id, __v: data.task.__v };
      setTodos([...todos, updatedTask]);
      setNewTodo('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/v1/tasks/${id}`, { method: 'DELETE' });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleComplete = async (id: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo._id === id) {
        const updatedTodo = { ...todo, completed: !todo.completed };
        updateTaskInDatabase(updatedTodo);
        return updatedTodo;
      }
      return todo;
    });

    setTodos(updatedTodos);
  };

  const updateTaskInDatabase = async (updatedTodo: Todo) => {
    try {
      await fetch(`http://localhost:5000/api/v1/tasks/${updatedTodo._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Todo App</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={handleInputChange}
          style={{
            width: '300px',
            height: '40px',
            borderRadius: '8px',
            marginRight: '10px',
          }}
        />
        <button
          onClick={handleAddTodo}
          style={{
            width: '100px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: 'green',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Add Todo
        </button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo._id)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.name}
            </span>
            <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
