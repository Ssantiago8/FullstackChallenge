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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "250px" }}>
        <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>Welcome</h2>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <label htmlFor="username" style={{ alignSelf: "flex-start", marginBottom: "5px" }}>Username:</label>
              <Field
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                style={{ marginTop: "5px" }}
              />
              {errors.username && touched.username ? (
                <div style={{ marginTop: "5px" }}>{errors.username}</div>
              ) : null}
              <label htmlFor="password" style={{ alignSelf: "flex-start", marginBottom: "5px" }}>Password:</label>
              <Field
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                style={{ marginTop: "5px" }}
              />
              {errors.password && touched.password ? (
                <div style={{ marginTop: "5px" }}>{errors.password}</div>
              ) : null}
              <button type="submit" style={{ backgroundColor: "#b794f4", color: "#ffffff", width: "120px", height: "40px", borderRadius: "50px", marginTop: "10px", border: "none", display: "flex", justifyContent: "center", alignItems: "center", margin: "auto"  }}>Login</button>
            </Form>
          )}
        </Formik>
      </div>
    );   
    
}


