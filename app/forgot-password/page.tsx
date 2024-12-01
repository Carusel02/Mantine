'use client';

import React, {useState} from "react";
import {sendResetEmail} from "../firebase/auth/password-reset";
import {fetchSignInMethodsForEmail, getAuth} from "firebase/auth";
import firebase_app from "../firebase/firebase-config";
import Link from "next/link";
import {Button, Stack} from "@mantine/core";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async () => {
        const auth = getAuth(firebase_app);

        try {
            // Check if the email is associated with any sign-in method
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);

            console.log("Sign-in methods for email:", signInMethods);

            if (signInMethods.length === 0) {
                // No account found for the email
                setMessage("No account found with this email.");
                return;
            }

            // Proceed to send the reset email if the account exists
            await sendResetEmail(email);
            setMessage("Password reset email sent successfully!");

        } catch (error) {
            // Handle any other errors (e.g., network issues)
            setMessage("Error sending password reset email");
            console.log("Error sending reset email:", error);
        }
    }

    return (
        <div style={{maxWidth: "400px", margin: "auto", textAlign: "center"}}>
            <Stack align="center" gap="md">
                <h2>Reset Password</h2>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{width: "100%", padding: "10px", marginBottom: "10px"}}
                />

                <Button
                    onClick={handleResetPassword} w="38.5%"
                >
                    Reset Password
                </Button>

                {message && <div style={{marginTop: "10px", color: "green"}}>{message}</div>}

                <Link href="/signin" passHref>
                    <Button>
                        Go back to Sign In
                    </Button>
                </Link>
            </Stack>
        </div>
    );
}