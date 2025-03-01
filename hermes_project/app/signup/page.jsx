'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        hometown_state: '',
        hometown_city: '',
        instagram_handle: '',
        highschool: '',
        gpa: '',
        major: '',
        is_active: false,
        fraternity: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.email) tempErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email is invalid";
        
        if (!formData.password) tempErrors.password = "Password is required";
        else if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
        
        if (!formData.name) tempErrors.name = "Name is required";
        if (!formData.hometown) tempErrors.hometown = "Hometown is required";
        if (!formData.highschool) tempErrors.highschool = "High school is required";
        
        if (formData.gpa && (isNaN(formData.gpa) || formData.gpa < 0 || formData.gpa > 4.0)) {
            tempErrors.gpa = "GPA must be a number between 0 and 4.0";
        }
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Here you would typically send the data to your API
            console.log("Form submitted:", formData);
            alert("Sign up successful!");
            // Redirect to login or dashboard
            // router.push('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#4338CA] to-[#6366F1] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border-4 border-yellow-500 overflow-hidden">
                {/* Fraternity Banner Header */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-center">
                    <h1 className="text-4xl font-bold text-white uppercase tracking-wider">
                        Account Information
                    </h1>
                </div>

                {/* Form Container */}
                <div className="p-8 space-y-6">
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-blue-900 font-semibold mb-2">Email</label>
                                <input
                                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-blue-300'} focus:ring-2 focus:ring-blue-500`}
                                    type="email"
                                    name="email"
                                    placeholder="your.email@university.edu"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-blue-900 font-semibold mb-2">First Name</label>
                                <input
                                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl border-2 ${errors.first_name ? 'border-red-500' : 'border-blue-300'} focus:ring-2 focus:ring-blue-500`}
                                    type="text"
                                    name="first_name"
                                    placeholder="John Fraternity"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                            </div>

                            <div>
                                <label className="block text-blue-900 font-semibold mb-2">Last Name</label>
                                <input
                                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl border-2 ${errors.last_name ? 'border-red-500' : 'border-blue-300'} focus:ring-2 focus:ring-blue-500`}
                                    type="text"
                                    name="last_name"
                                    placeholder="John Fraternity"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                            </div>

                            <div>
                                <label className="block text-blue-900 font-semibold mb-2">GPA</label>
                                <input
                                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl border-2 ${errors.gpa ? 'border-red-500' : 'border-blue-300'} focus:ring-2 focus:ring-blue-500`}
                                    type="text"
                                    name="gpa"
                                    placeholder="3.5"
                                />
                                {errors.gpa && <p className="text-red-500 text-sm mt-1">{errors.gpa}</p>}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-blue-900 font-semibold mb-2">Major</label>
                                <input
                                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl border-2 ${errors.major ? 'border-red-500' : 'border-blue-300'} focus:ring-2 focus:ring-blue-500`}
                                    type="text"
                                    name="major"
                                    placeholder="Business Administration"
                                />
                                {errors.major && <p className="text-red-500 text-sm mt-1">{errors.major}</p>}
                            </div>

                            <div>
                                <label className="block text-blue-900 font-semibold mb-2">Hometown State</label>
                                <input
                                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl border-2 ${errors.hometown_state ? 'border-red-500' : 'border-blue-300'} focus:ring-2 focus:ring-blue-500`}
                                    type="text"
                                    name="hometown_state"
                                    placeholder="Los Angeles, CA"
                                />
                                {errors.hometown_state && <p className="text-red-500 text-sm mt-1">{errors.hometown_state}</p>}
                            </div>

                            <div>
                                <label className="block text-blue-900 font-semibold mb-2">Hometown City</label>
                                <input
                                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl border-2 ${errors.hometown_city ? 'border-red-500' : 'border-blue-300'} focus:ring-2 focus:ring-blue-500`}
                                    type="text"
                                    name="hometown_city"
                                    placeholder="Los Angeles, CA"
                                />
                                {errors.hometown_city && <p className="text-red-500 text-sm mt-1">{errors.hometown_city}</p>}
                            </div>

                            <div>
                                <label className="block text-blue-900 font-semibold mb-2">Instagram Usernmae</label>
                                <input
                                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl border-2 ${errors.instagram_handle ? 'border-red-500' : 'border-blue-300'} focus:ring-2 focus:ring-blue-500`}
                                    type="text"
                                    name="instagram_handle"
                                    placeholder="Los Angeles, CA"
                                />
                                {errors.instagram_handle && <p className="text-red-500 text-sm mt-1">{errors.instagram_handle}</p>}
                            </div>

                            <div>
                                <label className="block text-blue-900 font-semibold mb-2">High School</label>
                                <input
                                    className={`w-full px-4 py-3 bg-gray-100 rounded-xl border-2 ${errors.highschool ? 'border-red-500' : 'border-blue-300'} focus:ring-2 focus:ring-blue-500`}
                                    type="text"
                                    name="highschool"
                                    placeholder="Lincoln High School"
                                />
                                {errors.highschool && <p className="text-red-500 text-sm mt-1">{errors.highschool}</p>}
                            </div>
                        </div>

                        <div>
                    <label className="block text-blue-900 font-semibold mb-2">Are you active in a fraternity?</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-blue-900">Yes</span>
                    </div>
                </div>

                {formData.is_active && (
                    <div>
                        <label className="block text-blue-900 font-semibold mb-2">Select Your Fraternity</label>
                        <select
                            name="fraternity"
                            value={formData.fraternity}
                            onChange={(e) => setFormData({ ...formData, fraternity: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-blue-300 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Choose a Fraternity --</option>
                            <option value="Alpha Phi Alpha">Alpha Phi Alpha</option>
                            <option value="Beta Theta Pi">Beta Theta Pi</option>
                            <option value="Delta Chi">Delta Chi</option>
                            <option value="Kappa Sigma">Kappa Sigma</option>
                            <option value="Sigma Alpha Epsilon">Sigma Alpha Epsilon</option>
                            {/* Add more options as needed */}
                        </select>
                    </div>
                )}

                        {/* Full Width Submit Button */}
                        <div className="col-span-2 mt-4">
                            <button 
                                type="submit" 
                                className="w-full py-4 bg-yellow-500 text-blue-900 font-bold uppercase tracking-wider rounded-xl hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                            >
                                Save Information
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
