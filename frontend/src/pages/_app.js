import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#111125',
            color: '#fff',
            borderRadius: '14px',
            fontWeight: 600,
            fontSize: '14px',
          },
        }}
      />
    </AuthProvider>
  );
}
