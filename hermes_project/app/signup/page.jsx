'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    // password: '',
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
    headshot: null
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const validate = () => {
    let tempErrors = {};

    if (!formData.email)
      tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email is invalid";

    if (!formData.first_name || !formData.last_name)
      tempErrors.name = "First and last name are required";

    if (!formData.hometown_state || !formData.hometown_city)
      tempErrors.hometown = "Hometown is required";

    if (!formData.highschool)
      tempErrors.highschool = "High school is required";

    if (formData.gpa && (isNaN(formData.gpa) || formData.gpa < 0 || formData.gpa > 5.0))
      tempErrors.gpa = "GPA must be a number between 0 and 4.0";

    if (!formData.phone_number)
      tempErrors.phone_number = "Phone number is required";

    if (!formData.birthday)
      tempErrors.birthday = "Birthday is required";

    if (!formData.hometown_address || !formData.hometown_zip || !formData.hometown_country)
      tempErrors.address = "Complete home address is required";

    if (!formData.grad_year)
      tempErrors.grad_year = "Graduation year is required";

    if (!formData.student_id)
      tempErrors.student_id = "Student ID is required";

    if (!formData.signed_cob_form)
      tempErrors.signed_cob_form = "Please indicate if you signed a COB form";

    if (!formData.headshot)
      tempErrors.headshot = "Please upload a headshot photo";

    setErrors(tempErrors);
    return tempErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    console.log("Form data at submit:", formData);
    if (Object.keys(validationErrors).length > 0) {
      console.error("Validation errors:", validationErrors);
      return;
    }

    const submissionData = { ...formData };
    if (formData.headshot) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        submissionData.headshot = reader.result;
        await submitForm(submissionData);
      };
      reader.readAsDataURL(formData.headshot);
    } else {
      await submitForm(submissionData);
    }
  };

  const submitForm = async (data) => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
      if (response.ok) {
        // 🚀 Redirect user to a page saying:
        // "Please check your email and verify before logging in."
        alert("Registration successful! Please verify your email.");
        router.push("/verify-instructions"); 
      } else {
        console.error("Backend responded with:", result);
        alert(JSON.stringify(result, null, 2));  // Show backend message        
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#4338CA] to-[#6366F1] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border-4 border-yellow-500 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-center">
          <h1 className="text-4xl font-bold text-white uppercase tracking-wider">
            Account Information
          </h1>
        </div>
        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {['email', 'first_name', 'last_name', 'phone_number', 'birthday'].map((field) => (
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

          {/* Hometown Address */}
          {['hometown_address', 'hometown_city', 'hometown_state', 'hometown_zip', 'hometown_country'].map((field) => (
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

          {/* Academic Info */}
          {['highschool', 'grad_year', 'gpa', 'major', 'instagram_handle', 'student_id'].map((field) => (
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
