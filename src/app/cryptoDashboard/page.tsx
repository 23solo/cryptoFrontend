'use client'; // Ensure this is a client component

import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css'; // Import your CSS module
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { useRouter } from 'next/navigation'; // Import useRouter

const CryptoDashboard = () => {
  const { isAuthenticated, getToken } = useAuth(); // Access isAuthenticated from context
  const router = useRouter(); // Initialize useRouter
  const [cryptoData, setCryptoData] = useState([]);
  const token = getToken();
  const [loading, setLoading] = useState(true); // Loading state
  const [alertValue, setAlertValue] = useState({
    crypto: '',
    price: '',
    condition: 'above',
  }); // Default to 'above'
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/'); // Redirect to home if not authenticated
      } else {
        const fetchCryptoData = async () => {
          const response = await fetch(
            'http://ecs-nest-lb-2027848750.ap-south-1.elb.amazonaws.com/crypto/prices', // Updated URL
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }), // Add Authorization header if token exists
              },
            }
          );
          const data = await response.json();
          console.log('Response is ', token);

          setCryptoData(data);
          setLoading(false); // Set loading to false after data is fetched
        };
        fetchCryptoData();
      }
    }, 1000); // Wait for 1 second before checking authentication

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [isAuthenticated, router]);

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const { crypto, price, condition } = alertValue; // Destructure the alertValue state
    const token = getToken(); // Retrieve the token from local storage

    // Prepare the request body
    const requestBody = {
      cryptoSymbol: crypto, // Use the selected cryptocurrency symbol
      targetPrice: parseFloat(price), // Convert price to a number
      alertType: condition, // Use the selected condition (above or below)
    };

    try {
      const response = await fetch(
        'http://ecs-nest-lb-2027848750.ap-south-1.elb.amazonaws.com/price-alerts', // Endpoint URL
        {
          method: 'POST', // HTTP method
          headers: {
            'Content-Type': 'application/json', // Set content type to JSON
            ...(token && { Authorization: `Bearer ${token}` }), // Add Authorization header if token exists
          },
          body: JSON.stringify(requestBody), // Convert the request body to JSON
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok'); // Handle errors
      }

      const data = await response.json(); // Parse the response data
      console.log('Alert set successfully:', data); // Log the success message

      // Show success message
      window.alert('Alert set successfully!');

      // Clear the form
      setAlertValue({ crypto: '', price: '', condition: 'above' }); // Reset form fields
    } catch (error) {
      console.error('Error setting alert:', error); // Log any errors
      window.alert('Error setting alert. Please try again.'); // Show error message
    }
  };

  const handleCryptoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCryptoId = e.target.value;
    const selectedCrypto = cryptoData.find(
      (crypto) => crypto.id === selectedCryptoId
    );

    if (selectedCrypto) {
      setAlertValue({
        ...alertValue,
        crypto: selectedCryptoId,
        price: selectedCrypto.current_price.toString(), // Set the price to the current price
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.loader}>Loading...</div>{' '}
        {/* Show loading message */}
      </Layout>
    );
  }

  return (
    <Layout>
      <section className={styles.dashboardContainer}>
        <h2 className={styles.title}>Cryptocurrency Prices</h2>
        <div className={styles.dashboardContent}>
          <div className={styles.cryptoGrid}>
            {cryptoData.map((crypto) => (
              <div key={crypto.id} className={styles.cryptoCard}>
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className={styles.cryptoImage}
                />
                <h3 className={styles.cryptoName}>
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </h3>
                <p className={styles.cryptoPrice}>
                  ${crypto.current_price.toFixed(2)}
                </p>
                <p className={styles.marketCap}>
                  Market Cap: ${crypto.market_cap.toLocaleString()}
                </p>
                <p className={styles.priceChange}>
                  24h Change:{' '}
                  <span
                    className={
                      crypto.price_change_percentage_24h < 0
                        ? styles.red
                        : styles.green
                    }
                  >
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </p>
                <p className={styles.marketCap}>
                  Volume: {crypto.total_volume}
                </p>
              </div>
            ))}
          </div>
          {alertMessage && (
            <div className={styles.alertMessage}>{alertMessage}</div>
          )}
          <div className={styles.alertDiv}>
            <form onSubmit={handleAlertSubmit} className={styles.alertForm}>
              <select
                value={alertValue.crypto}
                onChange={handleCryptoChange} // Update the handler
                className={styles.input}
              >
                <option value='' disabled>
                  Select Cryptocurrency
                </option>
                {cryptoData.map((crypto) => (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
              <input
                type='number'
                placeholder='Price Alert'
                value={alertValue.price}
                onChange={(e) =>
                  setAlertValue({ ...alertValue, price: e.target.value })
                }
                className={styles.input}
              />
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type='radio'
                    value='above'
                    checked={alertValue.condition === 'above'}
                    onChange={() =>
                      setAlertValue({ ...alertValue, condition: 'above' })
                    }
                  />
                  Above
                </label>
                <label>
                  <input
                    type='radio'
                    value='below'
                    checked={alertValue.condition === 'below'}
                    onChange={() =>
                      setAlertValue({ ...alertValue, condition: 'below' })
                    }
                  />
                  Below
                </label>
              </div>
              <button type='submit' className={styles.submitButton}>
                Set Price Alert
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CryptoDashboard;
