import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { auth } from '../../api/auth';
import { Button } from '../../components/ui-kit/Button';
import { Input } from '../../components/ui-kit/Input';
import { Mail, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui-kit/Card';

interface ForgotPasswordFormData {
    email: string;
}

export function ForgotPassword() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setSuccessMessage(null);
        try {
            await auth.forgotPassword(data.email);
            // Always show success message for security reasons (don't reveal if email exists)
            setSuccessMessage('If an account exists with this email, you will receive a password reset link shortly.');
        } catch (error: any) {
            console.error('Forgot password error', error);
            setSuccessMessage('If an account exists with this email, you will receive a password reset link shortly.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your email to receive a reset link
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {successMessage ? (
                        <div className="rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Mail className="h-5 w-5 text-green-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">Check your email</h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p>{successMessage}</p>
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            to="/admin/login"
                                            className="text-sm font-medium text-green-600 hover:text-green-500 flex items-center"
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-1" />
                                            Back to Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                label="Email address"
                                type="email"
                                // autoComplete="email" - Removed this line per previous feedback in similar contexts? No, keep it standard.
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                error={errors.email?.message}
                                placeholder="Enter your email"
                            />

                            <div>
                                <Button
                                    type="submit"
                                    fullWidth
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                                </Button>
                            </div>

                            <div className="flex items-center justify-center">
                                <Link to="/admin/login" className="text-sm font-medium text-brand-blue hover:text-blue-500">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
}
