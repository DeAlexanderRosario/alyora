'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await api.login(email.trim(), password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup() {
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter your email and a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.signup(email.trim(), password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Link href="/" style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 6, color: '#6b7d83', fontSize: 14 }}>
        <ArrowLeft size={16} />
        <span>Back to site</span>
      </Link>

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 16,
          padding: 40,
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 10px 30px rgba(21, 53, 69, 0.08)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#103143', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={22} color="#ffffff" />
          </div>
        </div>

        <h2 className="serif" style={{ color: '#153545', fontSize: 26, fontWeight: 700, textAlign: 'center' }}>
          Admin Panel
        </h2>
        <p style={{ color: '#6b7d83', fontSize: 13, textAlign: 'center', marginTop: 6, marginBottom: 28 }}>
          Sign in to manage your properties
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dde4e5', borderRadius: 8, padding: '0 14px', height: 48, gap: 10 }}>
            <Mail size={18} color="#6b7d83" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#153545' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dde4e5', borderRadius: 8, padding: '0 14px', height: 48, gap: 10 }}>
            <Lock size={18} color="#6b7d83" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#153545' }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              {showPassword ? <EyeOff size={18} color="#6b7d83" /> : <Eye size={18} color="#6b7d83" />}
            </button>
          </div>

          {error && <div style={{ color: '#c0392b', fontSize: 13 }}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#103143',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              height: 48,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Please wait...' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              color: '#3c70b8',
              fontSize: 13,
              cursor: 'pointer',
              marginTop: 10,
            }}
          >
            Create new admin account
          </button>
        </form>
      </div>
    </div>
  );
}
