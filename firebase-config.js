// Firebase Configuration
// IMPORTANT: Replace these values with your actual Firebase project config
// You'll get these values from Firebase Console after creating your project

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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
