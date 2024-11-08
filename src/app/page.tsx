'use client';
import Head from 'next/head';
import Image from 'next/image';
import Layout from './components/Layout';
import styles from './styles/Home.module.css';
import { useAuth } from './context/AuthContext'; // Import the useAuth hook
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Home() {
  const { isAuthenticated } = useAuth(); // Access isAuthenticated from context
  const router = useRouter(); // Initialize useRouter

  const handleRedirect = () => {
    router.push('/cryptoDashboard'); // Redirect to CryptoDashboard
  };

  return (
    <Layout>
      <Head>
        <title>Crypto Clone</title>
        <meta name='description' content='Crypto Clone using Next.js' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {/* Welcome Message at the Top */}
      <div className={styles.welcomeContainer}>
        {!isAuthenticated ? ( // Show button if not authenticated
          <>
            <h2 className={styles.welcomeMessage}>
              Welcome! Please log in to see the cryptocurrency dashboard.
            </h2>
          </>
        ) : (
          <button onClick={handleRedirect} className={styles.redirectButton}>
            Go to Crypto Dashboard
          </button>
        )}
      </div>

      <div className={styles.banner}>
        <Image
          src='https://images.unsplash.com/photo-1636953099671-481a72803051?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' // Use a direct image URL
          alt='Banner'
          layout='responsive' // Use responsive layout
          width={1000} // Set a larger width for the aspect ratio
          height={1} // Set a larger height for the aspect ratio
          style={{ maxWidth: '100%' }} // Ensure the image does not exceed its container
        />
      </div>

      {/* Other content can go here */}
    </Layout>
  );
}
