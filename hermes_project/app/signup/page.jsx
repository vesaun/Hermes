'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    birthday: '',
    hometown_state: '',
    hometown_city: '',
    hometown_address: '',
    hometown_zip: '',
    hometown_country: '',
    instagram_handle: '',
    highschool: '',
    grad_year: '',
    student_id: '',
    gpa: '',
    major: '',
    is_active: false,
    fraternity: '',
    signed_cob_form: '',
    hs_activities: '',
    hs_accomplishments: '',
    rush_interest: '',
    headshot: null,
    emergency_contact_number: ''
  });
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Email is invalid';
    if (!formData.password || formData.password.length < 6) tempErrors.password = 'Password must be at least 6 characters long';
    if (!formData.first_name || !formData.last_name) tempErrors.name = 'First and last name are required';
    if (!formData.hometown_state || !formData.hometown_city) tempErrors.hometown = 'Hometown is required';
    if (!formData.highschool) tempErrors.highschool = 'High school is required';
    if (formData.gpa && (isNaN(formData.gpa) || formData.gpa < 0 || formData.gpa > 5.0)) tempErrors.gpa = 'GPA must be a number between 0 and 5.0';
    if (!formData.phone_number) tempErrors.phone_number = 'Phone number is required';
    if (!formData.birthday) tempErrors.birthday = 'Birthday is required';
    if (!formData.hometown_address || !formData.hometown_zip || !formData.hometown_country) tempErrors.address = 'Complete home address is required';
    if (!formData.grad_year) tempErrors.grad_year = 'Graduation year is required';
    if (!formData.student_id) tempErrors.student_id = 'Student ID is required';
    if (!formData.signed_cob_form) tempErrors.signed_cob_form = 'Please indicate if you signed a COB form';
    if (!formData.headshot) tempErrors.headshot = 'Please upload a headshot photo';
    if (!formData.emergency_contact_number) tempErrors.emergency_contact_number = 'Emergency contact is required';
    setErrors(tempErrors);
    return tempErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await sendEmailVerification(userCredential.user);
  
      // Prepare user data
      const dataToSave = { ...formData, admin: false, ifc_admin: false};
      delete dataToSave.password;
  
      // Save to Firestore
      const saveUserToFirestore = async () => {
        await setDoc(doc(db, 'users', formData.email), dataToSave);
        alert('Account created! A verification email has been sent.');
        router.push('/login');
      };
  
      if (formData.headshot instanceof File) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          dataToSave.headshot = reader.result;
          await saveUserToFirestore();
        };
        reader.readAsDataURL(formData.headshot);
      } else {
        await saveUserToFirestore();
      }
  
    } catch (err) {
      console.error('Firebase error:', err);
      setErrorMsg(err.message);
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#4338CA] to-[#6366F1] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border-4 border-yellow-500 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-center">
          <h1 className="text-4xl font-bold text-white uppercase tracking-wider">Account Information</h1>
        </div>
        <div className="p-8 space-y-6">
          {errorMsg && <p className="text-red-600 font-medium text-center">{errorMsg}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

            {/* Email */}
            <div>
               <label className="block text-blue-900 font-semibold mb-2">
                 EMAIL <span className="text-red-500">*</span>
               </label>
               <input
                className="text-black w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-blue-300 focus:ring-2 focus:ring-blue-500"
                type="email"
                name="email"
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-blue-900 font-semibold mb-2">
                PASSWORD <span className="text-red-500">*</span>
              </label>
              <input
                className="text-black w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-blue-300 focus:ring-2 focus:ring-blue-500"
                type="password"
                name="password"
                onChange={handleChange}
              />
            </div>

            {/* First fields */}
            {['first_name', 'last_name', 'phone_number', 'birthday'].map((field) => (
              <div key={field}>
                <label className="block text-blue-900 font-semibold mb-2">
                  {field.replace('_', ' ').toUpperCase()} <span className="text-red-500">*</span>
                </label>
                <input
                  className="text-black w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-blue-300 focus:ring-2 focus:ring-blue-500"
                  type={field === 'birthday' ? 'date' : 'text'}
                  name={field}
                  onChange={handleChange}
                />
              </div>
            ))}

            {/* Hometown */}
            {/* Address fields except state */}
            {['hometown_address', 'hometown_city', 'hometown_zip', 'hometown_country'].map((field) => (
              <div key={field}>
                <label className="block text-blue-900 font-semibold mb-2">
                  {field.replace('_', ' ').toUpperCase()} <span className="text-red-500">*</span>
                </label>
                <input
                  className="text-black w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-blue-300 focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name={field}
                  onChange={handleChange}
                />
              </div>
            ))}

            {/* State dropdown */}
            <div>
              <label className="block text-blue-900 font-semibold mb-2">
                HOMETOWN STATE <span className="text-red-500">*</span>
              </label>
              <select
                name="hometown_state"
                onChange={handleChange}
                className="text-black w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-blue-300 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Select State --</option>
                {[
                  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
                  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
                  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
                  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
                  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
                ].map((abbr) => (
                  <option key={abbr} value={abbr}>{abbr}</option>
                ))}
              </select>
            </div>


            {/* Academic Info */}
            {['highschool', 'grad_year', 'gpa', 'major', 'instagram_handle', 'student_id', 'emergency_contact_number'].map((field) => (
              <div key={field}>
                <label className="block text-blue-900 font-semibold mb-2">
                {field.replace(/_/g, ' ').toUpperCase()}
                <span className="text-red-500">*</span>
                </label>
                <input
                  className="text-black w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-blue-300 focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name={field}
                  onChange={handleChange}
                />
              </div>
            ))}

            {/* COB Form Signed */}
            <div>
              <label className="block text-blue-900 font-semibold mb-2">
                Signed COB Form? <span className="text-red-500">*</span>
              </label>
              <select
                name="signed_cob_form"
                onChange={handleChange}
                className="text-black w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-blue-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>


            {/* Activities / Accomplishments / Rush Interest */}
            {['hs_activities', 'hs_accomplishments', 'rush_interest'].map((field) => (
              <div className="col-span-2" key={field}>
                <label className="block text-blue-900 font-semibold mb-2">
                  {field.replace('_', ' ').toUpperCase()} <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="text-black w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-blue-300 focus:ring-2 focus:ring-blue-500"
                  name={field}
                  rows={3}
                  onChange={handleChange}
                ></textarea>
              </div>
            ))}

            {/* Headshot Upload */}
            <div className="col-span-2">
              <label className="block text-blue-900 font-semibold mb-2">
                Upload Headshot <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-300 bg-gray-100"
                type="file"
                name="headshot"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            {/* Submit */}
            <div className="col-span-2 mt-4">
              <button
                type="submit"
                className="w-full py-4 bg-yellow-500 text-blue-900 font-bold uppercase tracking-wider rounded-xl hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
              >
                Sign Up
              </button>
            </div>
          </form>            
        </div>
      </div>
    </div>
  );
}







