import API from "./api";

export const getTodos = (params) => API.get("/todos", { params });
export const getTodoById = (id) => API.get(`/todos/${id}`);
export const createTodo = (data) => API.post("/todos", data);
export const updateTodo = (id, data) => API.put(`/todos/${id}`, data);
export const deleteTodo = (id) => API.delete(`/todos/${id}`);
export const markAllCompleted = () => API.patch("/todos/mark-all-completed");