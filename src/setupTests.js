// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock OktaSignInWidget to avoid canvas errors in tests
jest.mock('./components/OktaSignInWidget', () => {
  return function OktaSignInWidget() {
    return null;
  };
});
