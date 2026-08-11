import { render, screen } from '@testing-library/react';
import LoginPage from './pages/Login';
import SignUp from './pages/SignUp';
import { dashboardForRoles, normalizeRoles } from './auth/roles';

jest.mock('axios', () => ({ post: jest.fn() }));

jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => jest.fn(),
  }),
  { virtual: true }
);

beforeEach(() => {
  localStorage.clear();
});

test('renders the login form', () => {
  render(<LoginPage />);

  expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText('you@example.com')).toBeRequired();
  expect(screen.getByLabelText(/password/i)).toBeRequired();
  expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
});

test('offers account registration from the login screen', () => {
  render(<LoginPage />);

  expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
});

test('renders the account registration form', () => {
  render(<SignUp />);

  expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText('John')).toBeRequired();
  expect(screen.getByPlaceholderText('Doe')).toBeRequired();
  expect(screen.getByRole('button', { name: /^sign up$/i })).toBeInTheDocument();
});
test('normalizes role casing from the API', () => {
  expect(normalizeRoles(['USER', 'Consultant'])).toEqual(['user', 'consultant']);
});

test('routes an uppercase USER role to the user dashboard', () => {
  expect(dashboardForRoles(['USER'])).toBe('/user/dashboard');
});

test('does not route an unknown or missing role to an admin dashboard', () => {
  expect(dashboardForRoles([])).toBeNull();
  expect(dashboardForRoles(['unknown'])).toBeNull();
});
