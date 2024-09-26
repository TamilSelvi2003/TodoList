import React, { useState, useEffect } from 'react';
import './App.css'; 
import Notify from './Notification/Notify';

const TodoListApp = () => {
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState([]);
  const [edit, setEdit] = useState(-1);
  const [notify, setNotify] = useState('');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem('tasks'));
    if (storedList) {
      setList(storedList);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(list));
  }, [list]);

  const handleAddTask = () => {
    if (!inputValue.trim()) {
      alert('Task cannot be empty... please note the task');
      return;
    }
    
    if (edit === -1) {
      const newList = { 
        id: Date.now(), 
        text: inputValue, 
        category, 
        dueDate, 
        completed: false 
      };
      setList([...list, newList]);
      setNotify('Task added successfully!');
    } else {
      const updatedList = list.map((list, index) =>
        index === edit ? { ...list, text: inputValue, category, dueDate } : list
      );
      setList(updatedList);
      setNotify('Task updated successfully!');
      setEdit(-1);
    }
    setInputValue('');
    setCategory('General');
    setDueDate('');
    setTimeout(() => setNotify(''), 3000); 
  };

  const handleDeleteTask = (id) => {
    setList(list.filter(list => list.id !== id));
    setNotify('Task deleted successfully!');
    setTimeout(() => setNotify(''), 3000);
  };

  const handleEditTask = (index) => {
    setEdit(index);
    setInputValue(list[index].text);
    setCategory(list[index].category);
    setDueDate(list[index].dueDate);
  };

  const handleToggleCompletion = (id) => {
    const updatedList = list.map(list => 
      list.id === id ? { ...list, completed: !list.completed } : list
    );
    setList(updatedList);
  };

  const handleSearch = () => {
    return list.filter(list => list.text.toLowerCase().includes(search.toLowerCase()));
  };

  const sortedList = handleSearch().sort((a, b) => {
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <>
      <Notify />
      <div className="container">
        <h2>To-Do List App</h2>
        {notify && <Notify message={notify} onClose={() => setNotify('')} />}
        <div className="app">
          <input
            type="text"
            placeholder="Note Your Task"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
          />           
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="General">General</option>
            <option value="Work">Professional</option>
            <option value="Personal">Personal</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <button onClick={handleAddTask}>{edit === -1 ? 'Add' : 'Update'}</button>

          <input
            type="text"
            placeholder="Search Tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
          />

          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Category</th>
                <th>Due Date</th>
                <th>Completed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedList.map((list, index) => (
                <tr key={list.id}>
                  <td>{list.text}</td>
                  <td>{list.category}</td>
                  <td>{list.dueDate}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={list.completed}
                      onChange={() => handleToggleCompletion(list.id)}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditTask(index)}>Edit</button>
                    <button onClick={() => handleDeleteTask(list.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TodoListApp;
