import * as React from "react";
import "./Dashboard.css";
import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import Table from "../Table/Table";
import AuthContext from "../../contexts/auth";
import DashboardContext from "../../contexts/dashboard";
import ButtonInvite from "../ButtonInvite/ButtonInvite";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [todoEditing, setTodoEditing] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Auth context
  const { userContext } = useContext(AuthContext)
  const [ user, setUser ] = userContext

  // Dashboard context
  const { logContext } = useContext(DashboardContext)
  const [ logs, setLogs ] = logContext

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

  // Table Elements
  const columnLabelArr = ["LOG ID", "action", "USER", "ITEM ID", "INVENTORY ID", "CREATEDAT"];
  const tableLabel = "Latest Editions"
  
  const containerVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: { delay: 0.3, duration: 0.3 }
    },
    exit: {
        opacity: 0,
        transition: { ease: 'easeInOut' }
    }
  }

  return (
      <motion.div
          variants={containerVariants}
          initial={"hidden"}
          animate={"visible"}
          exit={"exit"}
          className="dashboard">
      <div className="dashboard-header">
        <div className="greeting">
          <h2 className="welcome"> Welcome Back, {user.firstName}</h2>
        </div>
        <div className="invite">
          <ButtonInvite/>
        </div>
      </div>
      <div className="dashboard-body">
        <div className="announcements-container">
          <Announcements />
        </div>
        <div className="checklist-container">
          <Checklist handleSubmit={handleSubmit} todos={todos} todo={todo} setTodo={setTodo} deleteTodo={deleteTodo} todoEditing={todoEditing} 
          toggleComplete={toggleComplete} submitEdits={submitEdits} setTodoEditing={setTodoEditing} setEditingText={setEditingText}/>
        </div>
      </div>
      <div className="table-container">
        <Table tableElementArray={logs.length ? logs : []} tableColumnLabelArray={columnLabelArr} tableLabel={tableLabel}/>                    
      </div>
    </motion.div>
  );
}


function Checklist({handleSubmit, todo, todos, setTodo, deleteTodo, toggleComplete, 
                  submitEdits, setTodoEditing, setEditingText, todoEditing}) {
  return (
    <div 
    className="content">
      <div className="header">
       <h2 className="title"> Checklist </h2>
      </div>
      <div className="body">
        <div className="check-items">
          <form className="checkbox" onSubmit={handleSubmit}>
            <input
              className="list-form"
              type="text"
              name="checklist"
              onChange={(e) => setTodo(e.target.value)}
              value={todo}
              placeholder="Enter a new list item..."
            />
            <button type="submit" className="submit-items">
              +
            </button>
          </form>
          {todos.map((todo) => (
            <div key={todo.id} className="checkmark">
              <div className="textTodo">
                <input
                  className="list-form"
                  type="checkbox"
                  id="completed"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                />
                {todo.id === todoEditing ? (
                  <input
                    className="listForm"
                    type="text"
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                ) : (
                  <div className="todo-text">{todo.text}</div>
                )}
              </div>
              <div className="extraEditing">
                {todo.id === todoEditing ? (
                  <button
                    className="more-items"
                    onClick={() => submitEdits(todo.id)}
                  >
                    Submit Edits
                  </button>
                ) : (
                  <button
                    className="more-items"
                    onClick={() => setTodoEditing(todo.id)}
                  >
                    Edit
                  </button>
                )}

                <button
                  className="more-items"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Announcements() {
  return (
    <div className="content">
      <div className="header">
       <h2 className="title"> Announcements </h2>
      </div>
      <div className="body">
      <input
        className="announcement-form"
        name="label"
        placeholder="Make an announcement here..."
      />
      </div>
    </div>
  );
}