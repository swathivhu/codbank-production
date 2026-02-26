# **App Name**: CodBank

## Core Features:

- User Account Management (Registration & Login): Enables users to securely register new accounts and authenticate via credentials, generating session tokens for access to protected resources.
- Secure Session & Token Refresh: Manages user authentication sessions using JSON Web Tokens (JWTs) and secure HTTP-only refresh tokens for persistent and secure login experiences.
- Protected API Endpoints: Provides authenticated and authorized access to banking functionalities via secured API routes for account information and other banking services.
- User Profile Service: Offers a secure API endpoint for the client application to retrieve and update basic user profile information.
- PostgreSQL Data Layer: Handles database connections and performs secure Create, Read, Update, Delete (CRUD) operations against the PostgreSQL database for all application data.
- Secure Middleware & CORS Configuration: Implements robust error handling, input validation, and secure Cross-Origin Resource Sharing (CORS) with credential support for client-server communication.

## Style Guidelines:

- The application employs a dark color scheme to convey professionalism and security. The primary color is a deep, authoritative teal (#265A73), chosen to symbolize trust and sophistication without resorting to cliché financial tones. This hue has good contrast against the dark background, ensuring clarity.
- The background color is a very dark, heavily desaturated variant of the primary hue (#161B1D). This choice provides a sleek, modern foundation, allowing interactive elements and important information to stand out clearly and contributing to a focused user experience.
- An accent color of vibrant aqua-green (#5CD6C1) is used for call-to-action buttons, key indicators, and active states. This analogous color provides a crisp contrast to the primary and background, enhancing usability and visual appeal by drawing attention to important interactive elements.
- Headlines utilize 'Space Grotesk' (sans-serif) for its modern, slightly technical, and highly legible appearance, reinforcing the application's digital and secure nature.
- Body text and detailed information are rendered in 'Inter' (sans-serif). Its clean, neutral design ensures excellent readability across all screen sizes, which is crucial for displaying complex financial data clearly and efficiently.
- Icons should be vector-based, minimalistic, and consistent in style, emphasizing clarity and quick recognition for common banking actions.
- The layout is structured, logical, and highly organized, designed to prioritize information hierarchy and ease of navigation for financial transactions and account management. Ample white space is used to reduce cognitive load.
- Subtle, functional animations are employed for transitions and feedback (e.g., successful transactions, loading states) to provide a polished and responsive user experience without being distracting.