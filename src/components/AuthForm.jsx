import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { addUser } from '../lib/db';

const AuthForm = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // Implement login logic
    } else {
      const newUser = await addUser({ username, password });
      onAuth(newUser);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit">{isLogin ? 'Login' : 'Sign Up'}</Button>
      <Button type="button" variant="link" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
      </Button>
    </form>
  );
};

export default AuthForm;