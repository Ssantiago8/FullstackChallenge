"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [contacts, setContacts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios
                .get('http://localhost:3001/contact/getallcontacts', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    setContacts(response.data.contacts);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, []);

    const handleContactClick = (contactId) => {
        localStorage.setItem('contactId', contactId);
        router.push(`/contacts/update`);
    };

    const handleCreateContact = () => {
        router.push('/contacts/create');
    };

    return (
        <div className="bg-[#faf9fe] min-h-screen p-4">
            <h2 className="text-xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mr-5">
                {contacts.map((contact) => (
                    <div
                        key={contact._id}
                        className="border-3 rounded-lg bg-white p-6 md:flex md:mx-56 w-full md:w-80 transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl"
                        onClick={() => handleContactClick(contact._id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src={contact.profilePictureUrl || 'https://source.boomplaymusic.com/group10/M00/04/13/ae97b7e7a1b24aac9807734926ec7c61_320_320.jpg'}
                            alt="Profile"
                            className="mx-auto h-16 w-16 rounded-full md:mx-0 md:mr-6 md:h-24 md:w-24"
                        />
                        <div className="text-center">
                            <h2 className="text-lg truncate">{contact.name}</h2>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleCreateContact} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg mt-4 float-right mr-4">
                Create Contact
            </button>
        </div>
    );
    
    
  
}
