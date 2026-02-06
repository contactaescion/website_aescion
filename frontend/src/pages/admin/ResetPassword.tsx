import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../../components/ui-kit/Card';
import { Input } from '../../components/ui-kit/Input';
import { Button } from '../../components/ui-kit/Button';
import { client } from '../../api/client';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

export function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<{ newPassword: string; confirmPassword: string }>();
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <Card className="max-w-md w-full p-8 text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Request</h2>
                    <p className="text-gray-600 mb-6">No reset token provided.</p>
                    <Link to="/admin/login" className="text-brand-blue hover:underline">Return to Login</Link>
                </Card>
            </div>
        );
    }

    const onSubmit = async (data: { newPassword: string }) => {
        try {
            await client.post('auth/reset-password', { token, newPassword: data.newPassword });
            setStatus('success');
            setTimeout(() => navigate('/admin/login'), 3000);
        } catch (error) {
            console.error('Reset failed', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <Card className="max-w-md w-full p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-green-600">Password Reset</h2>
                    <p className="text-gray-600 mb-6">Your password has been reset successfully.</p>
                    <p className="text-sm text-gray-500">Redirecting to login...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="max-w-md w-full p-8">
                <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                <p className="text-gray-600 mb-6">Enter your new password below.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="New Password"
                        type="password"
                        placeholder="********"
                        {...register('newPassword', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Must be at least 6 characters' }
                        })}
                        error={errors.newPassword?.message}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="********"
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (val) => {
                                if (watch('newPassword') != val) {
                                    return "Your passwords do not match";
                                }
                            }
                        })}
                        error={errors.confirmPassword?.message}
                    />

                    {status === 'error' && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            Failed to reset password. The link may have expired.
                        </div>
                    )}

                    <Button type="submit" fullWidth disabled={isSubmitting}>
                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
