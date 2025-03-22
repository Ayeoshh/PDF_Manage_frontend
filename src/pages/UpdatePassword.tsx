import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { auth } from '../lib/api';

interface UpdatePasswordForm {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdatePasswordForm>();

  const onSubmit = async (data: UpdatePasswordForm) => {
    try {
      await auth.updatePassword(data);
      toast.success('Password updated successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Update Password</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="userId" className="sr-only">User ID</label>
              <input
                id="userId"
                type="text"
                {...register('userId', { required: 'User ID is required' })}
                className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="User ID"
              />
              {errors.userId && <p className="text-sm text-red-600">{errors.userId.message}</p>}
            </div>
            <div>
              <label htmlFor="oldPassword" className="sr-only">Old Password</label>
              <input
                id="oldPassword"
                type="password"
                {...register('oldPassword', { required: 'Old Password is required' })}
                className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Old Password"
              />
              {errors.oldPassword && <p className="text-sm text-red-600">{errors.oldPassword.message}</p>}
            </div>
            <div>
              <label htmlFor="newPassword" className="sr-only">New Password</label>
              <input
                id="newPassword"
                type="password"
                {...register('newPassword', { required: 'New Password is required' })}
                className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="New Password"
              />
              {errors.newPassword && <p className="text-sm text-red-600">{errors.newPassword.message}</p>}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
