import React,{ useState } from "react";

type Todo = {
  title: string;
  readonly id: number;
  completed_flg: boolean;
  delete_flg: boolean;
};

const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState<string>('');
  const [nextId, setNextId] = useState<number>(1);

  const handleSubmit = () => {
    // 入力チェック
    if(!text) return;   // フォーム未入力時は何もしない

    // 新規Todoの作成
    const newTodo: Todo = {
      title: text,
      id: nextId,
      completed_flg: false,
      delete_flg: false,
    };
    // Todo stateの更新
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setNextId(nextId + 1);
    // フォームのリセット
    setText('');
  };

  const handleEdit = (id: number, value: string) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id){
          return {...todo, title: value};
        }
        return todo;
      });
      // todos stateの更新
      return newTodos; 
    });
  };

  const handleCheck = (id: number, completed_flg: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if(todo.id === id){
          return {...todo, completed_flg };
        }
        return todo;
      });
      return newTodos;
    });
  };

  const handleRemove = (id: number, delete_flg: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if(todo.id === id){
          return {...todo, delete_flg};
        }
        return todo;
      });
      return newTodos;
    });
  };

  return (
    <div>
      <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input 
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="タスクを入力してください"
        />
        <button className="insert-btn" type="submit">追加</button>
      </form>
      <ul>
        {todos.map((todo) => {
          return (
            <li key={todo.id}>
              <input 
                type="checkbox"
                checked={todo.completed_flg}
                onChange={() => handleCheck(todo.id, !todo.completed_flg)}
              />
              <input
                type="text"
                value={todo.title}
                disabled={todo.completed_flg}
                onChange={(e) => handleEdit(todo.id, e.target.value)}
              />
              <button onClick={() => handleRemove(todo.id, !todo.delete_flg)}>
                {todo.delete_flg ? '復元' : '削除'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Todos;