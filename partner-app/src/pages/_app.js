import { PartnerAuthProvider } from "../contexts/AuthContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return <PartnerAuthProvider><Component {...pageProps} /></PartnerAuthProvider>;
}
