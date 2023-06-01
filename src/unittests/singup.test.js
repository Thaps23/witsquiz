import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { BrowserRouter as Router } from 'react-router-dom';
import { SignUp } from '../pages/signup';
import '@testing-library/jest-dom';
import {auth, googleProvider} from "../config/firebase";
import { createMockUser, getAuth } from 'firebase/auth';
import {createUserWithEmailAndPassword, signInWithPopup,onAuthStateChanged, } from "firebase/auth";

describe('SignUp', () => {
  test('renders sign-up form correctly', () => {
    const history = createMemoryHistory();
    const { getByPlaceholderText, getByText } = render(
      <Router history={history}>
        <SignUp />
      </Router>
    );

    const emailInput = getByPlaceholderText('Enter Email');
    const passwordInput = getByPlaceholderText('Enter Password');
    const signUpButton = getByText('SignUp');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });

  test('signs up user successfully', async () => {
    // Mock Firebase authentication functions
    const createUserWithEmailAndPasswordMock = jest.fn(() => Promise.resolve());
    const sendEmailVerificationMock = jest.fn(() => Promise.resolve());
    const navigateMock = jest.fn();

    // Mock useState hooks
    jest.spyOn(React, 'useState').mockImplementation((initialValue) => [
      initialValue,
      jest.fn(),
    ]);

    // Render the component
    const history = createMemoryHistory();
    const { getByPlaceholderText, getByText } = render(
      <Router history={history}>
        <SignUp />
      </Router>
    );

    // Fill in the email and password fields
    const emailInput = getByPlaceholderText('Enter Email');
    const passwordInput = getByPlaceholderText('Enter Password');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123!' } });

    // Mock Firebase authentication functions and navigate
    jest.spyOn(window.firebase.auth, 'createUserWithEmailAndPassword')
      .mockImplementation(createUserWithEmailAndPasswordMock);
    jest.spyOn(window.firebase.auth, 'sendEmailVerification')
      .mockImplementation(sendEmailVerificationMock);
    jest.spyOn(window.ReactRouterDOM, 'useNavigate').mockReturnValue(navigateMock);

    // Click the sign-up button
    const signUpButton = getByText('SignUp');
    fireEvent.click(signUpButton);

    // Wait for the async operations to complete
    await waitFor(() => {
      expect(createUserWithEmailAndPasswordMock).toHaveBeenCalledTimes(1);
      expect(sendEmailVerificationMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });

});
