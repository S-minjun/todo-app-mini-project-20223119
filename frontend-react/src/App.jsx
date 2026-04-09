// frontend-react/src/App.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  const API_URL = "http://localhost:5000/api/todos";

  // GET: Todo 목록 불러오기
  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // POST: 새 Todo 추가
  const addTodo = async () => {
    if (!newTitle) return;
    try {
      const res = await axios.post(API_URL, { title: newTitle });
      setTodos([...todos, res.data]);
      setNewTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  // PUT: 완료 체크
  const toggleTodo = async (id, completed) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE: Todo 삭제
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="todo-container">
        <h1>Todo List</h1>

        {/* 입력폼 */}
        <div className="input-form">
          <input
            type="text"
            className="todo-input"
            placeholder="새 할 일을 입력하세요"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button
            onClick={addTodo}
            className="add-button"
          >
            추가
          </button>
        </div>

        {/* Todo 리스트 */}
        <div className="todo-list">
          {todos.map(todo => (
            <div
              key={todo._id}
              className="todo-item"
            >
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo._id, todo.completed)}
                  className="todo-checkbox"
                />
                <span className={`todo-title ${todo.completed ? "completed" : ""}`}>
                  {todo.title}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="delete-button"
              >
                삭제
              </button>
            </div>
          ))}
          {todos.length === 0 && (
            <p className="empty-message">등록된 Todo가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;