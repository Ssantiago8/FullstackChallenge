"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
});

export default function loginform() {
    const router = useRouter();

    const handleSubmit = async (values) => {
      console.log(values);
      try {
          const res = await axios.post("http://localhost:3001/auth/login", values);
          if (res.status === 200) {
              console.log("Login successful");
              const token = res.data.token;
              if (token) {
                  localStorage.setItem("token", token); 
              }
              router.push("/dashboard");
          }
      } catch (error) {
          console.error(error);
      }
  };
  

  return (
    <div className="flex flex-col items-center mt-40 mb-8">
      <h2 className="text-3xl font-bold mb-20">Welcome</h2>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col items-start">
            <label htmlFor="username" className="self-start mb-2 text-xl">Username:</label>
            <Field
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              className="w-4/4 pl-4 py-2 text-lg mb-8 bg-gray-100 text-gray-800 focus:text-black focus:bg-gray-100 focus:border-purple-500 focus:outline-none"
            />
            {errors.username && touched.username ? (
              <div className="mt-2">{errors.username}</div>
            ) : null}
            <label htmlFor="password" className="self-start mb-2 text-xl">Password:</label>
            <Field
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-4/4 pl-4 py-2 text-lg mb-8 bg-gray-100 text-gray-800 focus:text-black focus:bg-gray-100 focus:border-purple-500 focus:outline-none"
            />
            {errors.password && touched.password ? (
              <div className="mt-2">{errors.password}</div>
            ) : null}
            <button type="submit" className="bg-purple-500 text-white w-60 h-10 rounded-full mt-4 mx-auto transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">Login</button>
          </Form>
        )}
      </Formik>
    </div>
  );    
    
}



