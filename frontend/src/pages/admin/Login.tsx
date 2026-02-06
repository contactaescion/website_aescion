import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui-kit/Button';
import { Input } from '../../components/ui-kit/Input';
import { Card } from '../../components/ui-kit/Card';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../api/auth';
import { useState } from 'react';

export function Login() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onSubmit = async (data: any) => {
        try {
            setError('');
            const result = await auth.login(data.email, data.password);
            localStorage.setItem('access_token', result.access_token);
            navigate('/admin/dashboard');
        } catch (err: any) {
            console.error('Login failed', err);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                    <p className="text-gray-500 text-sm mt-2">Sign in to manage the website</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Email Address"
                        type="email"
                        {...register('email', { required: true })}
                    />
                    <Input
                        label="Password"
                        type="password"
                        {...register('password', { required: true })}
                    />

                    <div className="flex justify-end">
                        <Link to="/admin/forgot-password" className="text-sm text-brand-blue hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" fullWidth disabled={isSubmitting}>
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>
            </Card>

            <a href="/" className="fixed top-4 left-4 text-gray-600 hover:text-gray-900 text-sm font-medium">
                &larr; Back to Website
            </a>
        </div>
    );
}
