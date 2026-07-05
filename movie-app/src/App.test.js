import { render, screen } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './ThemeContext';

test('renders the movie search app', () => {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );

  expect(screen.getByText(/buscador de películas/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/buscar película/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/género/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /oscuro|claro/i })).toBeInTheDocument();
});
