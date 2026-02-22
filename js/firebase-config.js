/* ==========================================
   FIREBASE CONFIGURATION
   ========================================== */

const firebaseConfig = {
    apiKey: "AIzaSyCC282R920QLJ_OmeGfMi7EAodexLhqQj8",
    authDomain: "vale-9a89c.firebaseapp.com",
    databaseURL: "https://vale-9a89c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "vale-9a89c",
    storageBucket: "vale-9a89c.firebasestorage.app",
    messagingSenderId: "440615373105",
    appId: "1:440615373105:web:c171a91abb4af764424810"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Global reference to the Realtime Database
const db = firebase.database();

console.log('🔥 Firebase initialized successfully');
