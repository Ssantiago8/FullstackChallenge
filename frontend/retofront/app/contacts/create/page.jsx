"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CreateContact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    const handleCreateContact = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                const response = await axios.post(
                    'http://localhost:3001/contact/create',
                    {
                        name,
                        email,
                        phone,
                        address,
                        profilePictureUrl,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                router.push('/dashboard');
                console.log(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <h2>Create Contact</h2>
            <label>Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>Phone:
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label>Address:
                <textarea value={address} onChange={(e) => setAddress(e.target.value)}></textarea>
            </label>
            <label>Profile Picture URL:
                <input type="text" value={profilePictureUrl} onChange={(e) => setProfilePictureUrl(e.target.value)} />
            </label>
            <button onClick={handleCreateContact} disabled={loading} style={{ backgroundColor: '#a64fcb', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
                {loading ? 'Creating...' : 'Create Contact'}
            </button>
        </div>
    );
}
