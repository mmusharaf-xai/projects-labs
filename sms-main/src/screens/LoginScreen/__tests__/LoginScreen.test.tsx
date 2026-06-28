import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import LoginForm from '../components/LoginForm';
import LoginScreenHeader from '../components/LoginScreenHeader';

// Mock the auth service
jest.mock('../../../services/authService', () => ({
  loginUser: jest.fn(),
}));

import { loginUser } from '../../../services/authService';

const mockedLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;

describe('LoginScreenHeader', () => {
  it('renders the welcome title and subtitle', () => {
    render(<LoginScreenHeader />);
    expect(screen.getByText('Welcome Back')).toBeTruthy();
    expect(screen.getByText('Login to manage your school activities')).toBeTruthy();
  });
});

describe('LoginForm', () => {
  const mockOnLoginSuccess = jest.fn();
  const mockOnNavigateToSignup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLoginForm = () =>
    render(
      <LoginForm
        onLoginSuccess={mockOnLoginSuccess}
        onNavigateToSignup={mockOnNavigateToSignup}
      />
    );

  it('renders email and password inputs', () => {
    renderLoginForm();
    expect(screen.getByText('Email Address')).toBeTruthy();
    expect(screen.getByText('Password')).toBeTruthy();
  });

  it('renders the Log In button', () => {
    renderLoginForm();
    expect(screen.getByText('Log In')).toBeTruthy();
  });

  it('renders the Sign Up navigation link', () => {
    renderLoginForm();
    expect(screen.getByText("Don't have an account?")).toBeTruthy();
    expect(screen.getByText(' Sign Up')).toBeTruthy();
  });

  it('shows validation errors when submitting empty form', () => {
    renderLoginForm();
    fireEvent.press(screen.getByText('Log In'));

    expect(screen.getByText('Email is required')).toBeTruthy();
    expect(screen.getByText('Password is required')).toBeTruthy();
  });

  it('shows validation error for invalid email', () => {
    renderLoginForm();

    fireEvent.changeText(screen.getByTestId('email-input'), 'notanemail');
    fireEvent.changeText(screen.getByTestId('password-input'), 'Test@1234');
    fireEvent.press(screen.getByText('Log In'));

    expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
  });

  it('shows validation error for short password', () => {
    renderLoginForm();

    fireEvent.changeText(screen.getByTestId('email-input'), 'user@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), '123');
    fireEvent.press(screen.getByText('Log In'));

    expect(screen.getByText('Password must be at least 8 characters')).toBeTruthy();
  });

  it('calls loginUser service with valid inputs', async () => {
    mockedLoginUser.mockResolvedValueOnce({
      success: true,
      user: {
        id: 1,
        fullName: 'Test User',
        email: 'user@example.com',
        password: 'Test@1234',
        avatar: null,
        timezone: 'UTC',
        language: 'en',
        notifications: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    });

    renderLoginForm();

    fireEvent.changeText(screen.getByTestId('email-input'), 'user@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'Test@1234');
    fireEvent.press(screen.getByText('Log In'));

    await waitFor(() => {
      expect(mockedLoginUser).toHaveBeenCalledWith('user@example.com', 'Test@1234');
    });
  });

  it('calls onLoginSuccess when login succeeds', async () => {
    const mockUser = {
      id: 1,
      fullName: 'Test User',
      email: 'user@example.com',
      password: 'Test@1234',
      avatar: null,
      timezone: 'UTC',
      language: 'en',
      notifications: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    mockedLoginUser.mockResolvedValueOnce({ success: true, user: mockUser });

    renderLoginForm();

    fireEvent.changeText(screen.getByTestId('email-input'), 'user@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'Test@1234');
    fireEvent.press(screen.getByText('Log In'));

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalledWith(mockUser);
    });
  });

  it('shows general error when login fails', async () => {
    mockedLoginUser.mockResolvedValueOnce({
      success: false,
      error: 'Invalid email or password',
    });

    renderLoginForm();

    fireEvent.changeText(screen.getByTestId('email-input'), 'user@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'WrongPassword1');
    fireEvent.press(screen.getByText('Log In'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeTruthy();
    });
  });

  it('navigates to signup when Sign Up is pressed', () => {
    renderLoginForm();
    fireEvent.press(screen.getByTestId('navigate-signup'));
    expect(mockOnNavigateToSignup).toHaveBeenCalled();
  });

  it('does not call loginUser when validation fails', () => {
    renderLoginForm();
    fireEvent.press(screen.getByText('Log In'));

    expect(screen.getByText('Email is required')).toBeTruthy();
    expect(mockedLoginUser).not.toHaveBeenCalled();
  });
});