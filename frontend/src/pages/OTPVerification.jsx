import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import OTPVerificationForm from '../components/auth/OTPVerificationForm';
// import { BookOpen } from 'lucide-react';
import Logo from '../assets/image/Logo.png'

const OTPVerification = () => {
  const location = useLocation();
  const userId = location.state?.userId;

  if (!userId) {
    return <Navigate to="/register" />;
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="flex justify-center">
              <img src={Logo} alt="Logo" className="h-9 w-9" />
            {/* <BookOpen className="h-12 w-12 text-blue-600" /> */}
          </div>
          <h2 className="mt-6 text-3xl font-serif font-bold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification code to your email address.
          </p>
        </div>
        <div className="mt-8">
          <OTPVerificationForm userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
