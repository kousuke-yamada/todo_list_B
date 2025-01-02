import { BrowserRouter, Routes, Route } from "react-router-dom";
import Top from  "./components/Top";
import Todo from "./components/todos/index";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/todos" element={<Todo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;