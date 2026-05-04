import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import apiService from '@/services/api';
import ButtonLoader from '@/components/ButtonLoader';
import type { ApiError, LoginResponseData } from '@/types';

const Login = () => {
  const [email, setEmail] = useState<string>('admin@test.com');
  const [password, setPassword] = useState<string>('123456');
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiService.post<LoginResponseData>('/auth/login', {
        email,
        password,
      });
      console.log('Login response:', response);
      if (response?.success) {
        if (response?.data?.token) {
          login(response.data.token);
          navigate('/dashboard');
          toast.success('Login successful');
        } else {
          toast.error('Token not found in response');
          console.error('Login failed: Token not found in response');
        }
      } else {
        toast.error(response?.message || 'Login failed');
      }
    } catch (err) {
      const apiErr = err as ApiError;
      console.error(apiErr);
      toast.error(apiErr?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-8 rounded-xl w-96 space-y-4">
        <h2 className="text-2xl font-bold">Login</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-slate-800 rounded"
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-slate-800 rounded"
          placeholder="Password"
        />
        <button
          className="w-full bg-blue-600 p-2 rounded flex items-center justify-center gap-1"
          onClick={handleLogin}
          disabled={loading}
          type="button"
        >
          {loading ? <ButtonLoader /> : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Login;
