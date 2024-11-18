import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import firebase_app from "../firebase-config";

const sendResetEmail = (email) => {
    const auth = getAuth(firebase_app);

    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Password reset email sent!");
            // Additional actions like showing a success message to the user.
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error sending password reset email:", errorCode, errorMessage);
            // Handle the error appropriately in your app.
        });
};
