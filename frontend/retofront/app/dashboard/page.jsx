"use client";


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [contacts, setContacts] = useState([]);
    const [showNoContactsImage, setShowNoContactsImage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [totalPages, setTotalPages] = useState(0); // Total de páginas
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios
                .get(`http://localhost:3001/contact/getallcontacts?page=${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    setContacts(response.data.contacts);
                    setTotalPages(response.data.totalPages);  
                    if (response.data.contacts.length === 0) {
                        setTimeout(() => {
                            setShowNoContactsImage(true);
                        }, 2000);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [currentPage]);

    const handleContactClick = (contactId) => {
        localStorage.setItem('contactId', contactId);
        router.push(`/contacts/update`);
    };

    const handleCreateContact = () => {
        router.push('/contacts/create');
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="bg-[#faf9fe] min-h-screen p-4">
            <h2 className="text-2xl font-bold mb-4 ml-20">Contacts</h2>
            {contacts.length === 0 && showNoContactsImage && (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
                    <img src="https://i.ibb.co/6ykyYGt/image-removebg-preview-10.png" alt="No Contacts" className="w-30 h-30 mb-4" />
                    <p className="text-lg font-bold">Add contacts to your database</p>
                    <button onClick={handleCreateContact} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 border rounded-full mt-4 transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
                Add New Contact
            </button>
                </div>
            )}
            {contacts.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mr-5">
                        {contacts.map((contact) => (
                            <div
                                key={contact._id}
                                className="border-3 rounded-lg bg-white p-6 md:flex md:mx-56 w-full md:w-80 transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl"
                                onClick={() => handleContactClick(contact._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={contact.profilePictureUrl}
                                    alt="Profile"
                                    className="mx-auto h-16 w-16 rounded-full md:mx-0 md:mr-6 md:h-24 md:w-24"
                                />
                                <div className="text-center">
                                    <h2 className="text-lg truncate">{contact.name}</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4">
                    <button onClick={handleCreateContact} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 border rounded-full mt-4 transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
                Add New Contact
            </button>
            <button onClick={handlePreviousPage} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 border rounded-full mr-2 transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl" disabled={currentPage === 1}>
                            Previous
                        </button>
                        <button onClick={handleNextPage} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 border rounded-full ml-2 transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl" disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
