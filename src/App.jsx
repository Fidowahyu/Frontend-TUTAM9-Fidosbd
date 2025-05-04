import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [page, setPage] = useState('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [logoClicked, setLogoClicked] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Gagal memuat todos:', err);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/todos', { title });
      setTitle('');
      fetchTodos();
    } catch (err) {
      console.error('Gagal menambahkan todo:', err);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/todos/${id}`, {
        completed: !currentStatus,
      });
      fetchTodos();
    } catch (err) {
      console.error('Gagal mengubah status todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error('Gagal menghapus todo:', err);
    }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isLogin) {
      const user = registeredUsers.find((u) => u.email === email && u.password === password);
      if (user) {
        setPage('todo');
      } else {
        alert('Email atau password salah!');
      }
    } else {
      const alreadyExists = registeredUsers.some((u) => u.email === email);
      if (alreadyExists) {
        alert('Email sudah terdaftar. Silakan login.');
      } else {
        setRegisteredUsers([...registeredUsers, { email, password }]);
        alert('Registrasi berhasil! Silakan login.');
        setIsLogin(true);
      }
    }
  };

  const handleLogoClick = () => {
    setLogoClicked(true);
    setTimeout(() => {
      setLogoClicked(false);
    }, 1200);
  };

  useEffect(() => {
    if (page === 'todo') fetchTodos();
  }, [page]);

  return (
    <AnimatePresence mode="wait">
      {page === 'auth' ? (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white relative"
        >
          <div className="flex justify-between items-center px-6 py-4 absolute top-0 w-full z-10">
            <div onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
              <motion.img
                src="/LogoTodo.png"
                alt="Logo"
                className="w-10 h-10"
                animate={logoClicked ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
                transition={{ duration: 1 }}
              />
              <span className="text-xl font-bold">TodoFido</span>
            </div>
            <button
              onClick={() => document.getElementById('auth-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-full hover:bg-indigo-100 transition"
            >
              Get Started
            </button>
          </div>

          <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-24">
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={logoClicked ? { scale: [1, 1.3, 1], opacity: [0, 1, 0.8] } : { scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 via-pink-200 to-indigo-200 drop-shadow-lg mb-4"
            >
              Plan Less. Do More.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl max-w-2xl"
            >
              TodoFido helps you manage your tasks with elegance and ease. ✨
            </motion.p>
          </div>

          <div id="auth-form" className="flex justify-center pb-24 px-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
              <h2 className="text-2xl font-bold mb-4 text-center text-cyan-300">
                {isLogin ? 'Login to TodoFido' : 'Register for TodoFido'}
              </h2>
              <form onSubmit={handleAuth} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded bg-black/30 border border-cyan-300/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded bg-black/30 border border-cyan-300/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-xl transition"
                >
                  {isLogin ? 'Login' : 'Register'}
                </button>
              </form>
              <p className="text-sm text-center mt-4">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  className="text-cyan-400 hover:underline"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="todo"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
          className="min-h-screen bg-gradient-to-bl from-[#1A1F36] to-[#2B2D42] p-6 text-white"
        >
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-cyan-300 drop-shadow">🧠 TodoFido Dashboard</h1>
              <button
                onClick={() => setPage('auth')}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-pink-500/50"
              >
                Logout
              </button>
            </div>

            <form onSubmit={addTodo} className="flex gap-3 mb-6">
              <input
                type="text"
                className="flex-1 bg-black/30 border border-cyan-400/30 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                placeholder="Add a new task..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-cyan-500/40 transition font-semibold">
                Add
              </button>
            </form>

            <ul className="space-y-4">
              {todos.map((todo) => (
                <motion.li
                  key={todo._id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-cyan-300/20 shadow"
                >
                  <span
                    onClick={() => toggleComplete(todo._id, todo.completed)}
                    className={`flex-1 cursor-pointer text-lg font-medium ${
                      todo.completed ? 'line-through text-green-400' : 'text-white'
                    }`}
                  >
                    {todo.title}
                  </span>
                  <button
                    className="text-pink-400 hover:text-pink-600 text-xl ml-4"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    ✖
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}