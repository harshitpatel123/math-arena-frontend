import '../styles/globals.css';
import Providers from './providers/Providers';
import AuthGuard from '../components/AuthGuard';

export const metadata = {
  title: 'Math Arena',
  description: 'Math game',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative">
        <Providers>
          <AuthGuard>
            {children}
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
