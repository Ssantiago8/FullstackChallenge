"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [contacts, setContacts] = useState([]);

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

    return (
        <div>
            <h2>Dashboard</h2>
            <div>
                {contacts.map((contact) => (
                    <div key={contact._id} className="contact-card">
                        <h3>{contact.name}</h3>
                        <p>Email: {contact.email}</p>
                        <p>Phone: {contact.phone}</p>
                        {/* Otros detalles del contacto */}
                    </div>
                ))}
            </div>
        </div>
    );
}

