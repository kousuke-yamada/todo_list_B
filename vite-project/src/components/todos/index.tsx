import React, { useState } from 'react';

type Todo = {
  title: string;
  readonly id: number;
  completed_flg: boolean;
  delete_flg: boolean;
};

type Filter = 'all' | 'completed' | 'unchecked' | 'delete';
 
const Todo: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState<string>('');
  const [nextId, setNextId] = useState<number>(1);
  const [filter, setFilter] = useState<Filter>('all');

  const isFormDisabled = filter === 'completed' || filter === 'delete';

  const handleFilterChange = (filter: Filter) => {
    setFilter(filter);
  };

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

  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.delete_flg));
  }

  const getFilteredTodos = () => {
    switch(filter){
      case 'completed':
        return todos.filter((todo) => todo.completed_flg && !todo.delete_flg);
      case 'unchecked':
        return todos.filter((todo) => !todo.completed_flg && !todo.delete_flg);
      case 'delete':
        return todos.filter((todo) => todo.delete_flg);
      default:
        return todos.filter((todo) => !todo.delete_flg);
    }
  };

  return (
    <div className="todo-container">
      <select
       defaultValue="all"
       onChange={(e) => handleFilterChange(e.target.value as Filter)}
      >
        <option value="all">全てのタスク</option>
        <option value="completed">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="delete">ごみ箱</option>
      </select>
      {filter === 'delete' ? (
        <button onClick={handleEmpty}>
          ごみ箱を空にする
        </button>
      ):(
        filter !== 'completed' && (
          <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input 
              type="text"
              value={text}
              disabled={isFormDisabled}
              onChange={(e) => setText(e.target.value)}
              placeholder="タスクを入力してください"
            />
            <button className="insert-btn" type="submit">追加</button>
          </form>
        )
      )}
      <ul>
        {getFilteredTodos().map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed_flg}
              onChange={() => handleCheck(todo.id, !todo.completed_flg)}
            />
            <input
              type="text"
              value={todo.title}
              disabled={isFormDisabled}
              onChange={(e) => handleEdit(todo.id, e.target.value)}
            />
            <button onClick={() => handleRemove(todo.id, !todo.delete_flg)}>
              {todo.delete_flg ? '復元' : '削除'}
            </button>
          </li>
        ))}        
      </ul>
    </div>
  );
};

export default Todo;