import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import SignupForm from '../components/SignupForm';
import SignupScreenHeader from '../components/SignupScreenHeader';

// Mock the auth service
jest.mock('../../../services/authService', () => ({
  signupUser: jest.fn(),
}));

import { signupUser } from '../../../services/authService';

const mockedSignupUser = signupUser as jest.MockedFunction<typeof signupUser>;

describe('SignupScreenHeader', () => {
  it('renders the create account title and subtitle', () => {
    render(<SignupScreenHeader />);
    expect(screen.getByText('Create Account')).toBeTruthy();
    expect(screen.getByText('Join our school community today')).toBeTruthy();
  });
});

describe('SignupForm', () => {
  const mockOnSignupSuccess = jest.fn();
  const mockOnNavigateToLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderSignupForm = () =>
    render(
      <SignupForm
        onSignupSuccess={mockOnSignupSuccess}
        onNavigateToLogin={mockOnNavigateToLogin}
      />
    );

  it('renders full name, email, and password inputs', () => {
    renderSignupForm();
    expect(screen.getByText('Full Name')).toBeTruthy();
    expect(screen.getByText('Email Address')).toBeTruthy();
    expect(screen.getByText('Password')).toBeTruthy();
  });

  it('renders the Sign Up button', () => {
    renderSignupForm();
    expect(screen.getByText('Sign Up')).toBeTruthy();
  });

  it('shows validation errors when submitting empty form', () => {
    renderSignupForm();
    fireEvent.press(screen.getByText('Sign Up'));

    expect(screen.getByText('Full name is required')).toBeTruthy();
    expect(screen.getByText('Email is required')).toBeTruthy();
    expect(screen.getByText('Password is required')).toBeTruthy();
  });

  it('shows validation error for short full name', () => {
    renderSignupForm();

    fireEvent.changeText(screen.getByTestId('fullname-input'), 'Jo');
    fireEvent.changeText(screen.getByTestId('email-input'), 'user@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'Test@1234');
    fireEvent.press(screen.getByText('Sign Up'));

    expect(screen.getByText('Full name must be at least 3 characters')).toBeTruthy();
  });

  it('shows validation error for invalid email', () => {
    renderSignupForm();

    fireEvent.changeText(screen.getByTestId('fullname-input'), 'John Doe');
    fireEvent.changeText(screen.getByTestId('email-input'), 'bademail');
    fireEvent.changeText(screen.getByTestId('password-input'), 'Test@1234');
    fireEvent.press(screen.getByText('Sign Up'));

    expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
  });

  it('shows validation error for short password', () => {
    renderSignupForm();

    fireEvent.changeText(screen.getByTestId('fullname-input'), 'John Doe');
    fireEvent.changeText(screen.getByTestId('email-input'), 'user@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), '123');
    fireEvent.press(screen.getByText('Sign Up'));

    expect(screen.getByText('Password must be at least 8 characters')).toBeTruthy();
  });

  it('calls signupUser service with valid inputs', async () => {
    mockedSignupUser.mockResolvedValueOnce({
      success: true,
      user: {
        id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Test@1234',
        avatar: null,
        timezone: 'UTC',
        language: 'en',
        notifications: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    });

    renderSignupForm();

    fireEvent.changeText(screen.getByTestId('fullname-input'), 'John Doe');
    fireEvent.changeText(screen.getByTestId('email-input'), 'john@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'Test@1234');
    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(mockedSignupUser).toHaveBeenCalledWith('John Doe', 'john@example.com', 'Test@1234');
    });
  });

  it('calls onSignupSuccess when signup succeeds', async () => {
    const mockUser = {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'Test@1234',
      avatar: null,
      timezone: 'UTC',
      language: 'en',
      notifications: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    mockedSignupUser.mockResolvedValueOnce({ success: true, user: mockUser });

    renderSignupForm();

    fireEvent.changeText(screen.getByTestId('fullname-input'), 'John Doe');
    fireEvent.changeText(screen.getByTestId('email-input'), 'john@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'Test@1234');
    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(mockOnSignupSuccess).toHaveBeenCalledWith(mockUser);
    });
  });

  it('shows field errors from service', async () => {
    mockedSignupUser.mockResolvedValueOnce({
      success: false,
      fieldErrors: { email: 'This email is already registered' },
    });

    renderSignupForm();

    fireEvent.changeText(screen.getByTestId('fullname-input'), 'John Doe');
    fireEvent.changeText(screen.getByTestId('email-input'), 'existing@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'Test@1234');
    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText('This email is already registered')).toBeTruthy();
    });
  });

  it('shows general error when signup fails', async () => {
    mockedSignupUser.mockResolvedValueOnce({
      success: false,
      error: 'An error occurred during signup',
    });

    renderSignupForm();

    fireEvent.changeText(screen.getByTestId('fullname-input'), 'John Doe');
    fireEvent.changeText(screen.getByTestId('email-input'), 'john@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'Test@1234');
    fireEvent.press(screen.getByText('Sign Up'));

    await waitFor(() => {
      expect(screen.getByText('An error occurred during signup')).toBeTruthy();
    });
  });

  it('does not call signupUser when validation fails', () => {
    renderSignupForm();
    fireEvent.press(screen.getByText('Sign Up'));

    expect(screen.getByText('Full name is required')).toBeTruthy();
    expect(mockedSignupUser).not.toHaveBeenCalled();
  });
});