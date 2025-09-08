import '../styles/globals.css';
import Providers from './providers/Providers';

export const metadata = {
  title: 'Math Arena',
  description: 'Math game',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
