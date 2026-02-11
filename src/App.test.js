import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  const heroElement = screen.getByText(/ENTERPRISE IDENTITY/i);
  expect(heroElement).toBeInTheDocument();
});
