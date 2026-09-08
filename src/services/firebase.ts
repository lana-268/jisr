/**
 * Public Firebase project identifiers for the future frontend integration.
 *
 * The current application deliberately uses local mock repositories, so this
 * module has no SDK import or initialization side effect. When authentication
 * and the real data repositories are connected, initialize Firebase in the
 * application composition layer and inject those repositories into features.
 */
export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const firebaseConfig: FirebaseClientConfig = {
  apiKey: "AIzaSyAQl6WS0cMEAtOGSENqlYURjO47-BBLynE",
  authDomain: "mahalle-hub.firebaseapp.com",
  projectId: "mahalle-hub",
  storageBucket: "mahalle-hub.firebasestorage.app",
  messagingSenderId: "23120368964",
  appId: "1:23120368964:web:a2d63d941f276eca653311"
};
