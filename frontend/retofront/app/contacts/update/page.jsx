"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditContact() {
    const [contact, setContact] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const router = useRouter();

    useEffect(() => {
        const contactId = localStorage.getItem('contactId');
        const token = localStorage.getItem('token');
        
        if (contactId && token) {
            axios
                .get(`http://localhost:3001/contact/getonecontact/${contactId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setContact(response.data);
                    setName(response.data.name);
                    setEmail(response.data.email);
                    setPhone(response.data.phoneNumber);
                    setAddress(response.data.address);
                    setProfilePictureUrl(response.data.profilePictureUrl);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const contactId = localStorage.getItem('contactId');
        const token = localStorage.getItem('token');
        
        if (contactId && token) {
            try {
                await axios.patch(
                    `http://localhost:3001/contact/updatecontact/${contactId}`,
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
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (!contact) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Edit Contact</h2>
            <p>Contact ID: {contact._id}</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Phone:
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>
                <label>
                    Address:
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)}></textarea>
                </label>
                <label>
                    Profile Picture URL:
                    <input type="text" value={profilePictureUrl} onChange={(e) => setProfilePictureUrl(e.target.value)} />
                </label>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}
