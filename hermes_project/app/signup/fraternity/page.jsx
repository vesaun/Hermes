'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';

export default function FraternitySignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '', admin_key: '' });
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const checkAdminCode = async (code, email) => {
    const q = query(collection(db, "adminCodes"), where("code", "==", code));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      const data = docSnap.data();
      if ((data.used_by?.length || 0) < (data.usage_limit || 1)) {
        await updateDoc(docSnap.ref, { used_by: arrayUnion(email) });
        return { isAdmin: true, fraternity: data.fraternity };
      }
    }
    return { isAdmin: false };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg('Email and password are required');
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await sendEmailVerification(userCred.user);

      let isAdmin = false;
      let fraternity = '';
      if (formData.admin_key) {
        const result = await checkAdminCode(formData.admin_key, formData.email);
        isAdmin = result.isAdmin;
        fraternity = result.fraternity;
      }

      await setDoc(doc(db, 'users', formData.email), {
        email: formData.email,
        admin: isAdmin,
        fraternity,
        is_active: true
      });

      alert('Fraternity account created. Please verify your email.');
      router.push('/login');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-indigo-600 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-blue-900">Fraternity Sign Up</h2>
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full text-black px-4 py-2 border rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full text-black px-4 py-2 border rounded" />
        <input name="admin_key" type="text" placeholder="Admin Key (optional)" onChange={handleChange} className="w-full text-black px-4 py-2 border rounded" />
        <select
            name="fraternity"
            value={formData.fraternity}
            onChange={handleChange}
            className="w-full text-gray-500 px-4 py-2 border rounded"
            required
            >
            <option value="">Select Your Fraternity</option>
            {[
                'Acacia',
                'Alpha Delta Phi',
                'Alpha Epsilon Pi',
                'Alpha Gamma Omega',
                'Alpha Phi Delta',
                'Alpha Kappa Lambda',
                'Alpha Sigma Phi',
                'Alpha Tau Omega',
                'Chi Psi',
                'Delta Kappa Epsilon',
                'Kappa Alpha Order',
                'Phi Kappa Psi',
                'Phi Gamma Delta',
                'Phi Kappa Alpha',
                'Pi Kappa Phi',
                'Sigma Alpha Epsilon',
                'Sigma Nu',
                'Tau Kappa Epsilon',
                'Theta Chi',
                'Theta Xi',
                'Zeta Beta Tau'
            ].map(frat => (
                <option key={frat} value={frat}>{frat}</option>
            ))}
        </select>

        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}
