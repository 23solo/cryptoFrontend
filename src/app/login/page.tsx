'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import Layout from '../components/Layout';
import styles from './Login.module.css';
import { useEffect } from 'react'; // Import useEffect

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter(); // Initialize useRouter
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [loading, setLoading] = useState(true); // Track login state
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      router.push('/cryptoDashboard'); // Redirect to CryptoDashboard if logged in
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  const handleCreateAccountClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    setIsCreateAccount(true);
  };

  const handleLoginClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsCreateAccount(false);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.target.value;
    const newErrors = {
      username: '',
      password: errors.password,
      confirmPassword: errors.confirmPassword,
    };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(newUsername)) {
      newErrors.username = 'Please enter a valid email address';
    } else {
      newErrors.username = '';
    }
    setErrors(newErrors);
    setUsername(newUsername);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    const newErrors = {
      username: errors.username,
      password: '',
      confirmPassword: errors.confirmPassword,
    };
    if (newPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else {
      newErrors.password = '';
    }
    setErrors(newErrors);
    setPassword(newPassword);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = event.target.value;
    const newErrors = {
      username: errors.username,
      password: errors.password,
      confirmPassword: '',
    };
    if (newConfirmPassword) {
      if (newConfirmPassword !== password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else {
      newErrors.confirmPassword = 'Confirm Password is required';
    }
    setErrors(newErrors);
    setConfirmPassword(newConfirmPassword);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { username: '', password: '', confirmPassword: '' };

    if (!username) {
      newErrors.username = 'Username is required';
      valid = false;
    } else if (username.length < 6) {
      newErrors.username = 'Username must be at least 6 characters';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (isCreateAccount) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Confirm Password is required';
        valid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      const endpoint = isCreateAccount
        ? 'http://ecs-nest-lb-2027848750.ap-south-1.elb.amazonaws.com/user/register'
        : 'http://ecs-nest-lb-2027848750.ap-south-1.elb.amazonaws.com/user/login';
      const payload = {
        username,
        password,
        ...(isCreateAccount && { confirmPassword }),
      };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        login(data.token);
        console.log('Form submitted successfully:', data);
        setIsLoggedIn(true);
        // Handle successful response (e.g., redirect to another page)
      } catch (error) {
        console.error('Error submitting form:', error);
        // Handle error response (e.g., show error message to user)
      }
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/cryptoDashboard'); // Redirect to CryptoDashboard
    }
  }, [isLoggedIn, router]);

  const passwordsMatch = password === confirmPassword;

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
      <Container component='main' className={styles.container}>
        <Box className={styles.header}>
          <Typography component='h1' variant='h5'>
            {isCreateAccount ? 'Create Account' : 'Sign in'}
          </Typography>
        </Box>
        <Box
          component='form'
          noValidate
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <TextField
            margin='normal'
            required
            fullWidth
            id='username'
            label='Username'
            name='username'
            autoComplete='username'
            autoFocus
            value={username}
            onChange={handleUsernameChange}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={handlePasswordChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          {isCreateAccount && (
            <Box className={styles.confirmPasswordContainer}>
              <TextField
                margin='normal'
                required
                fullWidth
                name='confirmPassword'
                label='Confirm Password'
                type='password'
                id='confirmPassword'
                autoComplete='new-password'
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
              <Box className={styles.passwordMatchContainer}>
                {confirmPassword && (
                  <Box className={styles.passwordMatchIcon}>
                    {passwordsMatch ? (
                      <CheckCircle style={{ color: 'green' }} />
                    ) : (
                      <Cancel style={{ color: 'red' }} />
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          )}
          <Button
            type='submit'
            fullWidth
            variant='contained'
            className={styles.submitButton}
            disabled={isCreateAccount && !passwordsMatch}
          >
            {isCreateAccount ? 'Create Account' : 'Sign In'}
          </Button>
          <Box className={styles.link}>
            {isCreateAccount ? (
              <Link href='#' variant='body2' onClick={handleLoginClick}>
                {'Already a user? Sign In'}
              </Link>
            ) : (
              <Link href='#' variant='body2' onClick={handleCreateAccountClick}>
                {"Don't have an account? Create Account"}
              </Link>
            )}
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default Login;
