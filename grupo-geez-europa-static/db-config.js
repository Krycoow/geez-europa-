/**
 * Configuración de Base de Datos - Grupo Geez Europa
 * 
 * Para habilitar Firestore:
 * 1. Ve a https://console.firebase.google.com/
 * 2. Crea un nuevo proyecto o selecciona uno existente
 * 3. Ve a Project Settings → General → Your apps → Web app
 * 4. Copia la configuración y péga los valores aquí
 * 5. Cambia DB_PROVIDER a 'firestore'
 * 
 * Si no configuras Firestore, los datos se guardarán en localStorage (solo en el navegador del usuario)
 */

// Proveedor de base de datos: 'firestore' | 'local'
window.DB_PROVIDER = window.DB_PROVIDER || 'local';

// Configuración de Firebase (dejar vacío si usas 'local')
window.FIREBASE_CONFIG = window.FIREBASE_CONFIG || {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "" // Opcional, solo si usas Google Analytics
};

// Configuración de Firestore (opcional)
window.FIRESTORE_SETTINGS = window.FIRESTORE_SETTINGS || {
  collectionName: 'quotes', // Nombre de la colección donde se guardan las solicitudes
  // Opcional: Reglas de seguridad
  // Por defecto, Firestore permite leer/escribir. Configura reglas en Firebase Console
};

// Validación básica de configuración
if (window.DB_PROVIDER === 'firestore') {
  if (!window.FIREBASE_CONFIG.projectId || window.FIREBASE_CONFIG.projectId === '') {
    console.warn('⚠️ Firestore está habilitado pero no hay projectId configurado. Se usará localStorage como fallback.');
    window.DB_PROVIDER = 'local';
  }
}



