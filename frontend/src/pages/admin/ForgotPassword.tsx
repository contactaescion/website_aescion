import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../../components/ui-kit/Card';
import { Input } from '../../components/ui-kit/Input';
import { Button } from '../../components/ui-kit/Button';
import { client } from '../../api/client';
import { Link } from 'react-router-dom';

export function ForgotPassword() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>();
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const onSubmit = async (data: { email: string }) => {
        try {
            await client.post('auth/forgot-password', data);
            setStatus('success');
        } catch (error) {
            console.error('Request failed', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <Card className="max-w-md w-full p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Check your email</h2>
                    <p className="text-gray-600 mb-6">
                        We have sent a password reset link to your email address.
                    </p>
                    <Link to="/admin/login" className="text-brand-blue hover:underline">
                        Back to Login
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="max-w-md w-full p-8">
                <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
                <p className="text-gray-600 mb-6">Enter your email to receive a reset link.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="admin@aescion.com"
                        {...register('email', { required: 'Email is required' })}
                        error={errors.email?.message}
                    />

                    {status === 'error' && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            Failed to send reset link. Please try again.
                        </div>
                    )}

                    <Button type="submit" fullWidth disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </Button>

                    <div className="text-center mt-4">
                        <Link to="/admin/login" className="text-sm text-gray-600 hover:text-brand-blue">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
}
