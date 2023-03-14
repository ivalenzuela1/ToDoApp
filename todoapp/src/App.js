import './App.css';
import React, { useState, useEffect } from "react";
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completeTodos, setCompleteTodos] = useState([]);

  const handleAddTodo = () => {
    if(!newTitle){
      toast.error("Please add a title to continue",{
        toastId: 'title',
    });
      return;
    }

    if(!newDescription){
      toast.warning("Please add a description to continue",{
        toastId: 'description',
    });
      return;
    }

    let newTodoItem = {
      title: newTitle,
      description: newDescription
    }

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);

    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
  }

  const handleDeleteTodo = (index) => {
    let reduceTodo = [...allTodos];
    reduceTodo.splice(index, 1);
    setTodos(reduceTodo);

    localStorage.setItem('todolist', JSON.stringify(reduceTodo));
  }

  const handleDeleteCompletedTodo = (index) => {
    let reduceCompletedTodo = [...completeTodos];
    reduceCompletedTodo.splice(index, 1);
    setCompleteTodos(reduceCompletedTodo);

    localStorage.setItem('completedTodos', JSON.stringify(reduceCompletedTodo));
  }

  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let hr = now.getHours();
    let min = now.getMinutes();
    let sec = now.getSeconds();

    let completedDate = dd + '-' + mm + '-' + yyyy + ' at ' + hr + ':' + min + ':' + sec;

    let filteredItem = { ...allTodos[index], completedOn: completedDate };

    let updatedCompleteArr = [...completeTodos];
    updatedCompleteArr.push(filteredItem);
    setCompleteTodos(updatedCompleteArr);

    localStorage.setItem('completedTodos', JSON.stringify(updatedCompleteArr));

    handleDeleteTodo(index);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddTodo();
    }
  };

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    if (savedTodo) {
      setTodos(savedTodo);
    }

    let savedCompleteTodo = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedCompleteTodo) {
      setCompleteTodos(savedCompleteTodo);
    }
  }, [])

  return (
    <div className="App">
      <ToastContainer position="bottom-center"/>
      <h1>My Todos</h1>

      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={handleKeyDown} placeholder="What's the task title?" />
          </div>
          <div className='todo-input-item'>
            <label>Description</label>
            <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} onKeyDown={handleKeyDown} placeholder="What's the task description?" />
          </div>
          <div className='todo-input-item'>
            <button type="button" onClick={handleAddTodo} className="primaryBtn">Add</button>
          </div>
        </div>

        <div className='btn-area'>
          <button className={`secondaryBtn ${isCompleteScreen === false && 'active'}`} onClick={() => setIsCompleteScreen(false)}>Todo</button>
          <button className={`secondaryBtn ${isCompleteScreen === true && 'active'}`} onClick={() => setIsCompleteScreen(true)}>Completed</button>
        </div>

        <div className='todo-list'>

          {isCompleteScreen === false && allTodos.map((item, index) => {
            return (
              <div className='todo-list-item' title={index} key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <div>
                  <AiOutlineDelete className='delete-icon' onClick={() => handleDeleteTodo(index)} title="delete task" />
                  <BsCheckLg className='check-icon' onClick={() => handleComplete(index)} title="complete task" />
                </div>
              </div>
            )
          })}

          {isCompleteScreen === true && completeTodos.map((item, index) => {
            return (
              <div className='todo-list-item' title={index} key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p>{item.completedOn}</p>
                </div>

                <div>
                  <AiOutlineDelete className='delete-icon' onClick={() => handleDeleteCompletedTodo(index)} title="delete task" />
                </div>
              </div>
            )
          })}


        </div>
      </div>
    </div>
  );
}

export default App;
