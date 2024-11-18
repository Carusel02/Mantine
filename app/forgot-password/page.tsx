'use client';

import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import firebase_app from "../firebase/firebase-config";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async () => {
        const auth = getAuth(firebase_app);
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent successfully!");
        } catch (error) {
            setMessage("Error sending password reset email");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
            <h2>Reset Password</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <button
                onClick={handleResetPassword}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Reset Password
            </button>
            {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
        </div>
    );
};

export default ResetPassword;
