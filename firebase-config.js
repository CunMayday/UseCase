// Firebase Configuration
// IMPORTANT: Replace these values with your actual Firebase project config
// You'll get these values from Firebase Console after creating your project

const firebaseConfig = {

  apiKey: "AIzaSyA5tmBFKqJRJxhY9-wqObIFSxrysgZbXVU",

  authDomain: "purdue-ai-catalog.firebaseapp.com",

  projectId: "purdue-ai-catalog",

  storageBucket: "purdue-ai-catalog.appspot.com",

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

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error(`Image too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 5MB.`);
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Please upload an image (JPG, PNG, GIF, or WebP).`);
  }

  const storageRef = storage.ref();
  const imageRef = storageRef.child(`use-cases/${useCaseId}/${imageType}`);

  try {
    console.log(`Uploading ${file.name} (${(file.size / 1024).toFixed(2)}KB) to ${imageRef.fullPath}`);
    const snapshot = await imageRef.put(file);
    const downloadURL = await snapshot.ref.getDownloadURL();
    console.log(`Upload successful: ${downloadURL}`);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    // Provide more helpful error messages
    if (error.code === 'storage/unauthorized') {
      throw new Error('Permission denied. Please check Firebase Storage security rules.');
    } else if (error.code === 'storage/canceled') {
      throw new Error('Upload canceled.');
    } else if (error.code === 'storage/unknown') {
      throw new Error('Upload failed. Please check your internet connection and try again.');
    } else {
      throw new Error(error.message || 'Failed to upload image.');
    }
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
