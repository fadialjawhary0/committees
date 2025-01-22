import React, { useContext, useState } from 'react';

import styles from './Login.module.scss';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context';

const Login = () => {
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dummyUser = {
    username: 'fadialjohari',
    password: '123456',
  };

  const handleLogin = e => {
    e.preventDefault();

    if (username === dummyUser.username && password === dummyUser.password) {
      setUser(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({ username }));
      navigate('/');
    } else {
      alert('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleLogin}>
        <h6>ادخل الى حسابك</h6>
        <div>
          <input type='text' placeholder='اسم المستخدم' onChange={e => setUsername(e.target.value)} />
        </div>
        <div>
          <input type='password' placeholder='كلمة السر' onChange={e => setPassword(e.target.value)} />
        </div>
        <button type='submit' className={styles.loginButton}>
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
};

export default Login;
