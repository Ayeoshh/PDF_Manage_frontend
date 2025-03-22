import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { auth } from '../lib/api';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await auth.resetPassword(data.email);
      setSubmitted(true);
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error sending reset email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Forgot Password?</h2>
        <p className="text-center text-sm text-gray-600">Enter your email and we’ll send you a reset link.</p>

        {submitted ? (
          <p className="text-center text-green-600">Check your email for reset instructions.</p>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
