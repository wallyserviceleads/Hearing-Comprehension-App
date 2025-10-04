# Hearing Comprehension App

The Hearing Comprehension App is an interactive React experience that helps learners practice real-world listening skills. The single-page app simulates short spoken phrases and questions, adds configurable background noise, and tracks performance to encourage steady improvement.

## Features

- **Varied exercise types:** Multiple-choice, fill-in-the-blank, true/false, and multi-step direction questions.
- **Adjustable difficulty:** Learners can set their preferred level and speech rate.
- **Background noise simulation:** Choose between white noise, restaurant ambience, TV chatter, or traffic noise to mimic challenging listening environments.
- **Progress tracking:** Session history and statistics help learners monitor their accuracy over time.
- **Custom vocabulary builder:** Add new keywords and phrases to tailor the practice experience.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the URL printed in the terminal (usually `http://localhost:3000`).

> **Note:** The repository currently contains the primary React component in `Home.jsx`. Integrate it into your preferred React build tool (e.g., Next.js, Vite, Create React App) to run the interface.

## Project Structure

- `Home.jsx` – Main React component that renders the auditory training interface.
- `Home/` – Placeholder directory for future expansion or asset storage.

## Scripts

The project assumes the following npm scripts will be available once the component is integrated into a framework:

- `npm run dev` – Start the development server.
- `npm run build` – Create a production build.
- `npm run lint` – Lint the project (if configured).
- `npm run test` – Run automated tests (if configured).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with a clear description of your changes.

## License

This project is licensed under the terms described in the [LICENSE](LICENSE) file.
