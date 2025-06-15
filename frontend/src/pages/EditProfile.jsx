import React from 'react';
import EditProfileForm from '../components/profile/EditProfileForm';

const EditProfile = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">
          Edit Profile
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <EditProfileForm />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;