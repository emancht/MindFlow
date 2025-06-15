import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
// import { BookOpen } from 'lucide-react';
import Logo from '../assets/image/Logo.png'

const Login = () => {
  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="flex justify-center">
              <img src={Logo} alt="Logo" className="h-9 w-9" />
            {/* <BookOpen className="h-12 w-12 text-blue-600" /> */}
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
