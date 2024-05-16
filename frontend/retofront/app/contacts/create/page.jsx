"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { SearchBox } from "./searchBox";
import { useState } from 'react';
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phoneNumber: Yup.number().required("Phone is required"),
    address: Yup.string(),
    profilePictureUrl: Yup.string().url("Invalid URL").required("Profile Picture URL is required"),
});

export default function CreateContact() {
    const router = useRouter();
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');


    const handleSubmit = async (values) => {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                const response = await axios.post(
                    'http://localhost:3001/contact/create',
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
                router.push('/dashboard');
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="w-4/5 max-h-full mx-auto my-0 mt-10 bg-white shadow-xl rounded-lg text-gray-900 flex flex-col relative">
          <button
            className="absolute top-4 left-4 bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl"
            onClick={() => router.push("/dashboard")}>
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
                <img className="object-cover object-center h-32" src="data:image/png;base64,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" alt='Woman looking front'/>
            </div>
          <Formik
            initialValues={{
              name: "",
              email: "",
              address: "",
              profilePictureUrl: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
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
                    defaultValue=""
                  />
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
                  Create Contact
                </button>
              </Form>
            )}
          </Formik>
        </div>
      );
}