'use client';

import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import firebase_app from "../firebase/firebase-config";
import { sendResetEmail } from "../firebase/auth/password-reset";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async () => {

        const result = await sendResetEmail(email);

        if (result.success) {
            setMessage("Password reset email sent successfully!");
        } else {
            setMessage("Error sending password reset email");
        }
    }

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
            {message && <div style={{ marginTop: "10px", color: "green" }}>{message}</div>}
        </div>
    );
}