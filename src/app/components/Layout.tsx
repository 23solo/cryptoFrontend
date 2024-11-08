import React, { ReactNode } from 'react';
import Head from 'next/head';
import { AccountCircle, ExitToApp } from '@mui/icons-material'; // Import ExitToApp for logout
import styles from '../styles/Home.module.css'; // Ensure this path is correct
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { useRouter } from 'next/navigation'; // Import useRouter

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth(); // Access isAuthenticated and logout from context
  const router = useRouter(); // Initialize useRouter

  const handleLogout = () => {
    logout(); // Call the logout function
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Crypto Clone</title>
        <meta name='description' content='Crypto Clone using Next.js' />
      </Head>
      <header className={styles.header}>
        <a href='/'>
          <div className={styles.logo}>Crypto</div>
        </a>
        <div className={styles.icons}>
          {isAuthenticated ? (
            <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <ExitToApp className={`${styles.icon} ${styles.whiteIcon}`} />{' '}
              {/* Logout icon */}
            </div>
          ) : (
            <a href='/login'>
              <AccountCircle className={`${styles.icon} ${styles.whiteIcon}`} />{' '}
              {/* Login icon */}
            </a>
          )}
        </div>
      </header>
      <main className={styles.main}>{children}</main>{' '}
      {/* Ensure children are rendered here */}
      <footer className={styles.footer}>
        <p>&copy; 2024 Crypto. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
