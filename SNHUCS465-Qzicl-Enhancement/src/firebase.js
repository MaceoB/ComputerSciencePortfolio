import { initializeApp } from "firebase/app";

import { getFirestore, doc, setDoc, collection, query, getDocs, where } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPUhraakujdNNKbDAU3kHbCUWJbBvVUVs",
  authDomain: "qzicluser.firebaseapp.com",
  projectId: "qzicluser",
  storageBucket: "qzicluser.firebasestorage.app",
  messagingSenderId: "653012025738",
  appId: "1:653012025738:web:b3520ba61d7e1e9cd4c873",
  measurementId: "G-TYDC0NY0GL"
};


let app;
let firestoreDb;


//initialize app and firestore database
export const initializeFirebaseApp = () => {
    try {
        app = initializeApp(firebaseConfig);

        firestoreDb = getFirestore(app);
        console.log("Firebase initialized");
    } catch (error){
        console.error("Firebase init error:", error);
    }
}

//Create new documents based on newly registerd users
export const uploadRegisteredInfo = async (dataToUpload) => {
    const collectionRef = collection(firestoreDb, "userData");
    //Query to check if the inputted username in the register textbox already exists
    const q = query(collectionRef,where("username", "==", dataToUpload.username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        //Create a new error for the username being taken to stream on the frontend
        throw new Error("Username taken");
    }
    try {
        //Upload data
        const docRef = doc(collectionRef);
        await setDoc(docRef, dataToUpload);
        return { success: true, id: docRef.id }; //Returns success as true
    }
    catch (error){
        //If firestore fails to retrieve uploaded data
        console.error("Upload error:", error);
        return { success: false, error };
    }
}

export const getUserInfo = async (nameInput, passInput) => {
    try {
        const collectionRef = collection(firestoreDb, "userData");

        // Build query properly
        const q = query(
            collectionRef,
            where("username", "==", nameInput)
        );
        
        //Build a snapshot to find if there's a user found
        const docSnap = await getDocs(q);

        if (docSnap.empty) {
            return { success: false, error: "User not found" };
            //Returns before function gets a chanvce to check the password for security
        }


        const userData = docSnap.docs[0].data();

        //Compares the inputted password has to the datastore hash only after the user has been identified
        if (userData.password !== passInput) {
            return { success: false, error: "Incorrect password" };
        }

        return { success: true, data: userData };

    } catch (error) {
        //Fires error if database couldn't be connected
        console.error("Login Failed:", error);
        return { success: false, error };
    }
}
export const getFirebaseApp = () => app;


