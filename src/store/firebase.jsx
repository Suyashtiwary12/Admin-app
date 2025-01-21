import { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword} from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, Timestamp, updateDoc, doc } from "firebase/firestore";
import {firebaseConfig} from "./firebaseconfig"



const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const firebaseFirestore = getFirestore(app);
const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
  const signupUserWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;
      const userData = { email, createdAt: Timestamp.now() };
      await addUserToFirestore(user.uid, userData);
      return user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const loginWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  const addUserToFirestore = async (userId, userData) => {
    try {
      const usersCollection = collection(firebaseFirestore, "users");
      await addDoc(usersCollection, { userId, ...userData });
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
      throw error;
    }
  };

  const deleteUserFromFirestore = async (userId) => {
    try {
      await deleteDoc(doc(firebaseFirestore, "users", userId));
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user from Firestore:", error);
      throw error;
    }
  };

  const updateUserStatusInFirestore = async (userId, newStatus) => {
    try {
      await updateDoc(doc(firebaseFirestore, "users", userId), {
        status: newStatus
      });
      console.log("User status updated successfully");
    } catch (error) {
      console.error("Error updating user status in Firestore:", error);
      throw error;
    }
  };

  const listAllUsers = async () => {
    const usersCollectionRef = collection(firebaseFirestore, 'users'); // Replace 'users' with your actual collection name
            const querySnapshot = await getDocs(usersCollectionRef);
            return querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(), // Extract data from each document
            }));
  };

  const formatTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};


  return (
    <FirebaseContext.Provider value={{
      signupUserWithEmailAndPassword,
      loginWithEmailAndPassword,
      listAllUsers,
      formatTimestamp,
      deleteUserFromFirestore,
      updateUserStatusInFirestore
    }}>
      {props.children}
    </FirebaseContext.Provider>
  );
};
