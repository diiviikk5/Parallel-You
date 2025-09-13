import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseclient';
import logo from '../assets/logo.png';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; 

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    try {
      const { error } = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async (response) => {
    setError('');
    try {
      const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        token: response.credential, // Use the token provided by Google OAuth
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID"> {/* Wrap with GoogleOAuthProvider */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f001d] via-[#1a0033] to-black text-white font-sans">
        <div className="bg-[#1a001f]/80 border border-pink-500 rounded-2xl p-10 shadow-[0_0_20px_#ff00ff80] backdrop-blur-md w-full max-w-md">

          {}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Parallel You Logo" className="h-30 drop-shadow-[0_0_10px_#ff00ff80]" />
          </div>

          <h1 className="text-4xl font-bold text-center mb-8 text-pink-300 font-orbitron neon-text">
            {isLogin ? 'Login' : 'Create Account'}
          </h1>

          {error && (
            <div className="text-red-400 text-sm mb-4 text-center">{error}</div>
          )}

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 bg-[#2e003f]/70 border border-pink-500 rounded-xl text-white placeholder-pink-300 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 bg-[#2e003f]/70 border border-pink-500 rounded-xl text-white placeholder-pink-300 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleAuth}
              className="w-full bg-gradient-to-br from-pink-500 to-purple-700 hover:scale-105 transition-all px-4 py-2 rounded-xl font-bold shadow-md"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </div>

          {/* Google Login Button */}
          <div className="mt-6">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={(error) => setError(error.message)}
              useOneTap
            />
          </div>

          <p className="text-center mt-6 text-pink-300 text-sm">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              className="underline hover:text-white transition-colors"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Auth;
