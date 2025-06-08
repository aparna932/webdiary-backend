import React, { useState } from 'react';
import API from '../../api/axios';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users/register', form);
      console.log('Registered:', res.data);
    } catch (err) {
      console.error('Register error:', err.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" onChange={handleChange} />
      <input name="email" onChange={handleChange} />
      <input name="password" type="password" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
