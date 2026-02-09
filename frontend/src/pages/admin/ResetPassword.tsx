import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../../api/auth';
import { Button } from '../../components/ui-kit/Button';
import { Input } from '../../components/ui-kit/Input';
import { CheckCircle } from 'lucide-react';
import { Card } from '../../components/ui-kit/Card';

interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

export function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = async (data: ResetPasswordFormData) => {
        setSuccessMessage(null);
        setErrorMessage(null);

        if (!token) {
            setErrorMessage('Invalid or missing reset token.');
            return;
        }

        try {
            await auth.resetPassword(token, data.password);
            setSuccessMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/admin/login');
            }, 3000);
        } catch (error: any) {
            console.error('Reset password error', error);
            setErrorMessage(error.response?.data?.message || 'Failed to reset password. The link may have expired.');
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <Card className="p-6 text-center">
                        <h3 className="text-lg font-medium text-red-600 mb-2">Invalid Link</h3>
                        <p className="text-gray-600 mb-4">This password reset link is invalid or missing.</p>
                        <Link to="/admin/login" className="text-brand-blue hover:underline">Return to Login</Link>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Set new password
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {successMessage ? (
                        <div className="rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">Success</h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p>{successMessage}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            {errorMessage && (
                                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                                    {errorMessage}
                                </div>
                            )}

                            <Input
                                label="New Password"
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                })}
                                error={errors.password?.message}
                                placeholder="••••••••"
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (val: string) => {
                                        if (watch('password') != val) {
                                            return "Your passwords do not match";
                                        }
                                    }
                                })}
                                error={errors.confirmPassword?.message}
                                placeholder="••••••••"
                            />

                            <div>
                                <Button
                                    type="submit"
                                    fullWidth
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                                </Button>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
}
