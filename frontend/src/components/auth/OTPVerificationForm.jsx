import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const OTPVerificationForm = ({ userId }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return setError('Please enter the OTP');
    if (otp.length !== 6) return setError('OTP must be 6 digits');

    setIsSubmitting(true);
    try {
      const response = await verifyOTP({ userId, otp });
      setUser(response.user);
      toast.success('Email verified successfully!');
      navigate('/feed');
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      await resendOTP(userId);
      setCanResend(false);
      setCountdown(30);
      toast.success('OTP resent successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
          Enter 6-digit OTP
        </label>
        <input
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          value={otp}
          onChange={handleChange}
          maxLength={6}
          placeholder="123456"
          className={`mt-1 block w-full rounded-md border bg-white px-3 py-2 text-center text-xl tracking-widest text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
          }`}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        <p className="mt-2 text-sm text-gray-500">
          A 6-digit OTP has been sent to your email address.
        </p>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center h-12 px-6 text-lg font-medium rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
                  1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            'Verify OTP'
          )}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={!canResend}
          className="text-sm font-medium text-green-600 hover:text-green-500 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {canResend ? 'Resend OTP' : `Resend OTP in ${countdown}s`}
        </button>
      </div>
    </form>
  );
};

export default OTPVerificationForm;
