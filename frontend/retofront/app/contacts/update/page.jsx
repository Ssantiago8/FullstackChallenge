"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { SearchBox } from "../create/searchBox";

const validationSchema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string().email("Invalid email address"),
    phoneNumber: Yup.number(),
    address: Yup.string(),
    profilePictureUrl: Yup.string().url("Invalid URL")
});

export default function EditContact() {
    const [contact, setContact] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
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
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, []);

    const handleSubmit = async (values) => {
        const contactId = localStorage.getItem('contactId');
        const token = localStorage.getItem('token');
        
        if (contactId && token) {
            try {
                await axios.patch(
                    `http://localhost:3001/contact/updatecontact/${contactId}`,
                    {
                        ...values,
                        address: address,
                        latitude: latitude,
                        longitude: longitude
                    }, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setShowAlert(true);
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (!contact) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="rounded-full h-20 w-20 bg-violet-800 animate-ping"></div>
            </div>
        );
    }

    return (
      <div className="w-4/5 max-h-full mx-auto my-0 mt-10 bg-white pb-8 shadow-xl rounded-lg text-gray-900 flex flex-col relative">
        {showAlert && (
          <div
            className="px-4 py-3 leading-normal text-green-700 bg-green-100 rounded-lg mb-7 ml-9"
            role="alert"
          >
            <p>Contact updated successfully!</p>
          </div>
        )}
        <button
          className="absolute top-4 left-4 bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl"
          onClick={() => router.push("/dashboard")}
        >
          Back
        </button>
        <div className="border rounded h-32 overflow-hidden w-full">
          <img
            className="object-cover object-top w-full"
            src="https://htmlcolorcodes.com/assets/images/colors/light-gray-color-solid-background-1920x1080.png"
            alt="Mountain"
          />
        </div>
        <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
          <img
            className="object-cover object-center h-32"
            src={contact.profilePictureUrl}
            alt="Woman looking front"
          />
        </div>
        <div className="text-center mt-2">
          <h2 className="font-semibold">{contact.name}</h2>
        </div>
        <Formik
          initialValues={{
            name: contact.name,
            email: contact.email,
            phoneNumber: contact.phoneNumber,
            address: contact.address,
            profilePictureUrl: contact.profilePictureUrl,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form className="flex flex-col items-center justify-center mt-4">
              <div className="w-3/4 mb-2">
                <label htmlFor="name" className="block font-medium mb-1">
                  Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring focus:border-purple-500"
                />
                {errors.name && touched.name ? (
                  <div className="mt-2 text-red-500">{errors.name}</div>
                ) : null}
              </div>
              <div className="w-3/4 mb-2">
                <label htmlFor="email" className="block font-medium mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring focus:border-purple-500"
                />
                {errors.email && touched.email ? (
                  <div className="mt-2 text-red-500">{errors.email}</div>
                ) : null}
              </div>
              <div className="w-3/4 mb-2">
                <label htmlFor="phone" className="block font-medium mb-1">
                  Phone
                </label>
                <Field
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring focus:border-purple-500"
                />
                {errors.phoneNumber && touched.phoneNumber ? (
                  <div className="mt-2 text-red-500">{errors.phoneNumber}</div>
                ) : null}
              </div>
              <div className="w-3/4 mb-2">
                <label htmlFor="address" className="block font-medium mb-1">
                  Address
                </label>
                <SearchBox
                        onSelectAddress={(selectedAddress, selectedLatitude, selectedLongitude) => {
                            setAddress(selectedAddress);
                            setLatitude(selectedLatitude);
                            setLongitude(selectedLongitude);
                        }}
                        defaultValue={contact.address}
                    >
                </SearchBox>
                {errors.address && touched.address ? (
                  <div className="mt-2 text-red-500">{errors.address}</div>
                ) : null}
              </div>
              <div className="w-3/4 mb-2">
                <label
                  htmlFor="profilePictureUrl"
                  className="block font-medium mb-1"
                >
                  Profile Picture URL
                </label>
                <Field
                  type="text"
                  id="profilePictureUrl"
                  name="profilePictureUrl"
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring focus:border-purple-500"
                />
                {errors.profilePictureUrl && touched.profilePictureUrl ? (
                  <div className="mt-2 text-red-500">
                    {errors.profilePictureUrl}
                  </div>
                ) : null}
              </div>
              <button
                type="submit"
                className="w-1/2 block mx-auto rounded-full bg-purple-500 font-semibold text-white px-6 py-2 transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl"
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    );
}

