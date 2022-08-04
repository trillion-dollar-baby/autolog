import * as React from "react";
import "./Dashboard.css";
import DashboardContext from "../../contexts/dashboard";
import { useState, useEffect, useContext, useRef } from "react";
import { ToastContext } from "../../contexts/toast";

export default function Checklist() {
  const [todo, setTodo] = useState("");
  const [todoEditing, setTodoEditing] = useState(null);
  const [editingText, setEditingText] = useState("");
  const todoInput = useRef();
  // Dashboard context
  const {
    logContext,
    checklistCreateContext,
    checklistUpdateContext,
    checklistDeleteContext,
    checklistGetContext,
    checklistContext,
    processingContext,
  } = useContext(DashboardContext);
  const [createList] = checklistCreateContext;
  const [todos, setTodos] = checklistContext;
  const [fetchList] = checklistGetContext;

  const [isProcessing, setIsProcessing] = processingContext;
  //toast context
  const { notifyError, notifySuccess } = useContext(ToastContext);

  //handle submitted checklist
  async function handleSubmit(e) {
    e.preventDefault();
    setIsProcessing(true);
    const { data, error } = await createList(todo);
    setIsProcessing(false);
    if (data) {
      const newTodo = {
        id: new Date().getTime(),
        text: todo,
        completed: false,
      };
      setTodos([...todos].concat(newTodo));
      setTodo("");
      todoInput.current.focus();
    } else {
      notifyError(error);
    }
  }

  // // async function handleSubmit(e) {
  //   e.preventDefault();
  //   setIsProcessing(true);
  //   const {data, error} = await createList(todo);
  //   setIsProcessing(false);
  //   if(data){
  //   const newTodo = {
  //     id: new Date().getTime(),
  //     text: todo,
  //     completed: false,
  //   };
  //   setTodos([...todos].concat(newTodo));
  //   setTodo("");
  //   todoInput.current.focus();
  // }
  // }

  useEffect(() => {
    todoInput.current.focus();
  }, []);

  // get the details of the item
  //    useEffect(() => {
  //     const fetchItem = async () => {
  //         const {data, error} = await fetchList(itemId);

  //         if(data) {
  //             setTodos(data.item);
  //         } else{
  //           console.error("Error getting items, message:", error)
  //         }

  //     }

  //     fetchItem();
  // }, [])

  //handle completed checklist
  function toggleComplete(id) {
    let updatedTodos = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    setTodos(updatedTodos);
  }

  //handle edited todo checklist
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
  //handle deleted todo item
  function deleteTodo(id) {
    let updatedTodos = [...todos].filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  }

  return (
    <div className="content">
      <div className="header">
        <h2 className="title"> Checklist </h2>
      </div>
      <div className="body">
        <div className="check-items">
          <form className="checkbox" onSubmit={handleSubmit}>
            <input
              className="list-form"
              id="todos"
              type="text"
              name="todos"
              onChange={(e) => setTodo(e.target.value.toLowerCase())}
              value={todo}
              ref={todoInput}
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
  );
}
