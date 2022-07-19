import * as React from 'react';
import './Dashboard.css'
import emptyCheckbox from '../../assets/empty-checkbox.png'
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState("");
    const [todoEditing, setTodoEditing] = useState(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        const json = localStorage.getItem("todos");
        const loadedTodos = JSON.parse(json);
        if (loadedTodos) {
          setTodos(loadedTodos);
        }
      }, []);

      useEffect(() => {
        const json = JSON.stringify(todos);
        localStorage.setItem("todos", json);
      }, [todos]);

      function handleSubmit(e) {
        e.preventDefault();
    
        const newTodo = {
          id: new Date().getTime(),
          text: todo,
          completed: false,
        };
        setTodos([...todos].concat(newTodo));
        setTodo("");
      }

      function toggleComplete(id) {
        let updatedTodos = [...todos].map((todo) => {
          if (todo.id === id) {
            todo.completed = !todo.completed;
          }
          return todo;
        });
        setTodos(updatedTodos);
      }

      function submitEdits(id) {
        const updatedTodos = [...todos].map((todo) => {
          if (todo.id === id) {
            todo.text = editingText;
          }
          return todo;
        });
        setTodos(updatedTodos);
        setTodoEditing(null);
      }

      function deleteTodo(id) {
        let updatedTodos = [...todos].filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      }

    return (
        <div className="dashboard">
            <div className="head">
                <div className="hello">
                    <h2 className="hey"> Welcome Back, </h2>
                </div>
                <div className="invite-bttn">
                    <button className="invite"> Invite </button>
                </div>
            </div>
            <div className="display">
                <div className="announcements">
                    <label className="title"> Announcements </label>
                    <input className="announcement-form" name="label" placeholder="Make an announcement here..."/>
                </div>
                <div className="checklist">
                    <label className="title"> Checklist </label>
                    <div className="check-items">
                        <form className="checkbox" onSubmit={handleSubmit}>
                            <img className="img" src={emptyCheckbox}></img>
                            <input className="list-form" type="text"name="checklist" onChange={(e) => setTodo(e.target.value)} value={todo} placeholder="Enter a new list item..."/>
                            <button type="submit" className='more-items'>+</button>
                        </form>
                        <div className="checkbox">
                            <img className="img" src={emptyCheckbox}></img>
                            <input className="list-form" type="text" name="checklist" placeholder="Enter a new list item..."/>
                        </div>
                        <div className="checkbox">
                            <img className="img" src={emptyCheckbox}></img>
                            <input className="list-form" type="text" name="checklist" placeholder="Enter a new list item..."/>
                        </div>
                        <button className="more-items">+</button>
                    </div>
                </div>
                </div> 
                <div className="logs">
                    <label className="title2">Latest Editions</label>
                </div>
                <div className="column-name"> 
                <table>
                    <thead>
                        <tr className='column-label'>
                            <th className='num1'>ID</th>
                            <th className='num1'>Date</th>
                            <th className='num1'>User</th>
                            <th className='num2'>Item ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="rows">
                            <td>12345</td>
                            <td>01-23-45</td>
                            <td>MoeElias</td>
                            <td>145678</td>      
                        </tr>
                    </tbody>
                </table>
                </div>

              
        </div>
    )
}

//checklist
//announcemnts
//log table