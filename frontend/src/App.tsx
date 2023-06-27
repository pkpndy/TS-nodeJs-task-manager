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
  const [checkedTodos, setCheckedTodos] = useState<Record<string, boolean>>({});


  useEffect(() => {
    // Fetch todos from the server or MongoDB
    fetch('http://localhost:5000/api/v1/tasks')
  .then(response => response.json())
  .then(data => {
    if (Array.isArray(data.task)) {
      setTodos(data.task);
    } else {
      console.error('Invalid todos data:', data);
    }
  })
  .catch(error => console.log(error));
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  // const handleAddTodo = () => {
  //   if (newTodo.trim() === '') return;

  //   // Send a POST request to add a new todo to the server or MongoDB
  //   fetch('http://localhost:5000/api/v1/tasks', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ name: newTodo, completed: false })
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       setTodos([...todos, data]);
  //       setNewTodo('');
  //     })
  //     .catch(error => console.log(error));
  // };

  const handleAddTodo = () => {
    if (newTodo.trim() === '') return;
  
    const newTask = {
      name: newTodo,
      completed: false,
      _id: '',
      __v: 0
    };
  
    // Update the UI state with the new task immediately
    setTodos([...todos, newTask]);
    setNewTodo('');
  
    // Send a POST request to add the new task to the server or MongoDB
    fetch('http://localhost:5000/api/v1/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    })
      .then(response => response.json())
      .then(data => {
        // Update the UI state with the response from the server
        const updatedTask = { ...newTask, _id: data._id, __v: data.__v };
        setTodos([...todos.filter(todo => todo !== newTask), updatedTask]);
      })
      .catch(error => console.log(error));
  };
  
  

  const handleDeleteTodo = (id: string) => {
    fetch(`http://localhost:5000/api/v1/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      })
      .catch(error => console.log(error));
  };

  const handleToggleComplete = (id: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo._id === id) {
        const updatedTodo = { ...todo, completed: !todo.completed };
        // Update the task in the MongoDB database
        fetch(`http://localhost:5000/api/v1/tasks/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTodo)
        })
          .catch(error => console.log(error));
        return updatedTodo;
      }
      return todo;
    });
  
    setTodos(updatedTodos);
  };
  


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Todo App</h1>
      <div>
        <input type="text" value={newTodo} 
        onChange={handleInputChange} 
        style={{ 
          width: '300px', 
          height: '40px', 
          borderRadius: '8px', 
          marginRight: '10px'}} />
        <button 
          onClick={handleAddTodo} 
          style={{
            width: '100px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: 'green',
            color: 'white',
            cursor:'pointer'
          }}
        >Add Todo</button>
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

