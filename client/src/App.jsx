import { useEffect, useRef, useState } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const taskRef = useRef();


  const [todos, setTodos] = useState([]);
  const [taskInputValue, setTaskInputValue] = useState("");
  //first use effect
  
  // useEffect(() => {
  //     const response = fetch("http://localhost:3000/api/todos").then()
  //   },[]);

  useEffect(() => {
    async function fetchTodos() {
      try {
        // Make a fetch GET request to your API endpoint
        const response = await fetch("https://todoserver-h96u.onrender.com/api/todos");
        

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchTodos();
  }, []);   

  async function handleAddTodoSubmit(event) {
    event.preventDefault();
    try{
        const response = await fetch("https://todoserver-h96u.onrender.com/api/todos2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task: taskInputValue,
            is_completed: false
          }),
        });
        const data = await response.json()

      // Clear the input field after adding the task
      setTaskInputValue("");
      // setTodos((oldTodos) => ([...oldTodos, ...data]))
      setTodos((todos) => todos.concat(data));
       } catch (error) {
    
    }
  }

  async function deleteItem(id) {
    try {
      const response = await fetch(`https://todoserver-h96u.onrender.com/api/todos2/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        // Remove the deleted item from the local state (todos)
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

      } else {
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState("");


  function startEdit(id, taskText) {
    setEditTaskId(id);
    setEditedTaskText(taskText);
  }
  
  function cancelEdit() {
    setEditTaskId(null);
    setEditedTaskText("");
  }
  
  async function saveEdit(id) {
    try {
      const response = await fetch(`https://todoserver-h96u.onrender.com/api/todos2/${id}`, {
        method: "PUT", // Use PUT method to update the task
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: editedTaskText,
          is_completed: false, // You can set this based on your logic
        }),
      });
  
      if (response.ok) {
        // Update the task in the local state (todos)
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, task: editedTaskText } : todo
          )
        );
  
        // Reset edit state
        cancelEdit();
      } else {
        console.error("Failed to update todo");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }
  
  

  return (    
    <div className="max-w-xl mx-auto p-4">
  <h1 className="text-green-500 font-semibold text-4xl mt-4 mb-6">To-do List</h1>
  <form onSubmit={handleAddTodoSubmit} className="mb-4">
    <div className="flex">
      <input
        className="border p-2 flex-1 rounded-l"
        type="text"
        name="task"
        value={taskInputValue}
        onChange={(event) => {
          setTaskInputValue(event.target.value);
        }}
        placeholder="Add a task..."
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600"
      >
        Add
      </button>
    </div>
  </form>
  <ul className="list-disc pl-4">
  {todos.map((todo, i) => (
    <li key={i} className="flex items-center mb-2">
      <input
        type="checkbox"
        className="mr-2 form-checkbox h-5 w-5 text-green-500"
      />
      {editTaskId === todo.id ? (
        <>
          <input
            type="text"
            className="flex-1 border rounded p-1"
            value={editedTaskText}
            onChange={(event) => setEditedTaskText(event.target.value)}
          />
          <button
            type="button"
            onClick={() => saveEdit(todo.id)}
            className="text-blue-500 hover:text-blue-700 pl-2"
          >
            Save
          </button>
          <button
            type="button"
            onClick={cancelEdit}
            className="text-red-500 hover:text-red-700 pl-2"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <span className="flex-1">{todo.task}</span>
          <button
            type="button"
            onClick={() => startEdit(todo.id, todo.task)}
            className="text-green-500 hover:text-green-700 pr-5"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => deleteItem(todo.id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </>
      )}
    </li>
  ))}
</ul>
</div>
  )
}

export default App