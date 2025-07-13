import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/hooks/useUser';
import { toast } from '@/hooks/use-toast';

export default function LoginRegisterModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { login, register, loading } = useUser();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', mobile: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await login(form.mobile);
    if (res.success) {
      toast({ title: 'Login successful!' });
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'Login failed');
      toast({ title: 'Login failed', description: res.error || 'Login failed', variant: 'destructive' });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await register(form.name, form.email, form.mobile);
    if (res.success) {
      toast({ title: 'Registration successful!' });
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'Registration failed');
      toast({ title: 'Registration failed', description: res.error || 'Registration failed', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tab === 'login' ? 'Login' : 'Register'} to Continue</DialogTitle>
          <DialogDescription>
            {tab === 'login' ? 'Login with your mobile number to access your account.' : 'Register a new account with your name, email, and mobile number.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 mb-4">
          <Button variant={tab === 'login' ? 'default' : 'outline'} onClick={() => setTab('login')} className="flex-1">Login</Button>
          <Button variant={tab === 'register' ? 'default' : 'outline'} onClick={() => setTab('register')} className="flex-1">Register</Button>
        </div>
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} required disabled={loading} />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required disabled={loading} />
            <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required disabled={loading} />
            <Input name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} required disabled={loading} />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 