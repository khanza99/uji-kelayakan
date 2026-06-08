import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { register } from '@/api/authApi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const response = await register(form);
      const { token, user } = response.data;
      setAuth(token, user);
      toast.success('Account created! Welcome to TixEvent 🎉');
      navigate('/concerts');
    } catch (error) {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
      else toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-3xl border border-surface-100 p-8 sm:p-10"
          style={{ boxShadow: '0 4px 40px rgba(37,99,235,0.08), 0 1px 8px rgba(0,0,0,0.06)' }}>

          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-md shadow-primary-600/25 group-hover:bg-primary-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <span className="text-xl font-bold font-display text-surface-900 tracking-tight">
                Tix<span className="text-primary-600">Event</span>
              </span>
            </Link>
            <h1 className="text-2xl font-black font-display text-surface-900 mb-1.5">
              Create your account
            </h1>
            <p className="text-sm text-surface-500">
              Join TixEvent and start booking your favourite concerts
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name?.[0]}
              required
              placeholder="John Doe"
              autoComplete="name"
            />
            <Input
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email?.[0]}
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password?.[0]}
              required
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            <Input
              label="Confirm Password"
              type="password"
              value={form.password_confirmation}
              onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
              required
              placeholder="Repeat your password"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="cta"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-3 !rounded-2xl !py-3 font-bold"
            >
              Create Free Account
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-surface-100" />
            <span className="text-xs text-surface-400">or</span>
            <div className="flex-1 h-px bg-surface-100" />
          </div>

          <p className="text-center text-sm text-surface-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-surface-400 mt-6">
          By creating an account, you agree to our{' '}
          <Link to="#" className="underline hover:text-surface-600">Terms</Link> and{' '}
          <Link to="#" className="underline hover:text-surface-600">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
