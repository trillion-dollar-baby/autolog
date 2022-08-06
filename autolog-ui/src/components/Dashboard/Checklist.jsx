import * as React from "react";
import "./Dashboard.css";
import DashboardContext from "../../contexts/dashboard";
import { useState, useEffect, useContext, useRef } from "react";
import { ToastContext } from "../../contexts/toast";

export default function Checklist() {
  const [todo, setTodo] = useState("");
  const [todoEditing, setTodoEditing] = useState(null);
  const [item, setItemUpdate] = useState("");
  const [is_checked, setStatus] = useState(false)
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
    checklistUpdateStatusContext
  } = useContext(DashboardContext);
  const [createList] = checklistCreateContext;
  const [updateChecklist]= checklistUpdateContext;
  const [todos, setTodos] = checklistContext;
  const [fetchList] = checklistGetContext;
  const [deleteCheckListItem] = checklistDeleteContext
  const [updateStatus] = checklistUpdateStatusContext;

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
        item: todo,
        is_checked: false,
      };
      setTodos([...todos].concat(newTodo));
      setTodo("");
      todoInput.current.focus();
    } else {
      notifyError(error);
    }
  }


  useEffect(() => {
    todoInput.current.focus();
  }, []);


  //delete items once they are completed
  async function toggleComplete(id) {

    const updatedTodos = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.is_checked = !todo.is_checked;
      }
      return todo;
    });
    setIsProcessing(true);
    const { data, error } = await deleteCheckListItem(id);
    setIsProcessing(false);
    if(data){
      setTodos(updatedTodos);
    }

  }
  

  //handle edited todo checklist
  async function submitEdits(id) {
    const updatedTodos = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.item = item;
      }
      return todo;
    });

    setIsProcessing(true);

    const { data, error } = await updateChecklist(id, item);
    setIsProcessing(false);

    if(data){
    setTodos(updatedTodos);
    setTodoEditing(null);
  }
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
                  checked={todo.is_checked}
                  onChange={() => toggleComplete(todo.id)}
                />
                {todo.id === todoEditing ? (
                  <input
                    className="listForm"
                    type="text"
                    onChange={(e) => setItemUpdate(e.target.value)}
                  />
                ) : (
                  <div className="todo-text">{todo.item}</div>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}