import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import { useNavigate } from 'react-router-dom';

/***** "Todo"型の定義 *****/
type Todo = {
  title: string;
  readonly id: number;
  completed_flg: boolean;
  delete_flg: boolean;
};

type Filter = 'all' | 'completed' | 'unchecked' | 'delete';

/***** "Todo"コンポーネントの定義 *****/
const Todo: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState<string>('');
  const [nextId, setNextId] = useState<number>(1);
  const [filter, setFilter] = useState<Filter>('all');
  const navigate = useNavigate();

  const isFormDisabled = filter === 'completed' || filter === 'delete';


  useEffect(() => {
    localforage.getItem('todo-20240622').then((values) => {
      if(values){
        setTodos(values as Todo[]);
      }
    });
  }, []);
  useEffect(() => {
    localforage.setItem('todo-20240622', todos);
  }, [todos]);

  // フィルタリング変更時のステート更新処理
  const handleFilterChange = (filter: Filter) => {
    setFilter(filter);
  };

  // タスク追加ボタン押下時の処理
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

  // タスク更新時のステート更新処理
  const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
    id: number,
    key: K,
    value: V
  ) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id){
          return {...todo, [key]: value};
        }else{
          return todo;
        }
      });
      return newTodos;
    });
  };

  // タスク物理削除時の処理
  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.delete_flg));
  }

  // フィルタリングされたタスクリストを取得
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
      <button
        className="back-button"
        onClick={() => navigate('/')}
        title="Topページに戻る"
      >
        ⇦ 戻る
      </button>
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
              onChange={() => handleTodo(todo.id, 'completed_flg', !todo.completed_flg)}
            />
            <input
              type="text"
              value={todo.title}
              disabled={isFormDisabled}
              onChange={(e) => handleTodo(todo.id, 'title', e.target.value)}
            />
            <button onClick={() => handleTodo(todo.id, 'delete_flg', !todo.delete_flg)}>
              {todo.delete_flg ? '復元' : '削除'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;