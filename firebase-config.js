// Firebase Configuration
// IMPORTANT: Replace these values with your actual Firebase project config
// You'll get these values from Firebase Console after creating your project

const firebaseConfig = {

  apiKey: "AIzaSyA5tmBFKqJRJxhY9-wqObIFSxrysgZbXVU",

  authDomain: "purdue-ai-catalog.firebaseapp.com",

  projectId: "purdue-ai-catalog",

  storageBucket: "purdue-ai-catalog.firebasestorage.app",

  messagingSenderId: "616585590715",

  appId: "1:616585590715:web:8e2e2fd40d05cd30cdf69e"

};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// Collection reference
const useCasesCollection = db.collection('useCases');

// Helper function to get tool name display
function getToolName(toolCode) {
  const toolNames = {
    'GEM': 'Gemini Gem',
    'NLM': 'Notebook LM',
    'WEBAPP': 'Web Apps'
  };
  return toolNames[toolCode] || toolCode;
}

// Helper function to upload image to Firebase Storage
async function uploadImage(file, useCaseId, imageType) {
  if (!file) return '';

  const storageRef = storage.ref();
  const imageRef = storageRef.child(`use-cases/${useCaseId}/${imageType}`);

  try {
    const snapshot = await imageRef.put(file);
    const downloadURL = await snapshot.ref.getDownloadURL();
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Helper function to delete image from Firebase Storage
async function deleteImage(imageUrl) {
  if (!imageUrl) return;

  try {
    const imageRef = storage.refFromURL(imageUrl);
    await imageRef.delete();
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}
