<div align="center">

# Code Review Assistant
[![Tech: React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Styling: Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

An AI-powered web application that automates code reviews, providing instant feedback on readability, modularity, and potential bugs. Built with React and powered by the Google Gemini API.


## Table of Contents

- [Objective](#objective)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Local Setup](#local-setup-and-installation)
- [How to Use](#how-to-use)
- [Contributing](#contributing)
- [License](#license)

## Objective

This project automates the code review process by leveraging Large Language Models (LLMs) to analyze source code. It helps developers improve code quality by identifying areas for enhancement in structure, readability, and adherence to best practices.

## Features

-   🤖 **AI-Powered Analysis:** Get intelligent suggestions on readability, modularity, and potential bugs.
-   🌐 **Multi-Language Support:** Review code in a wide range of popular programming languages.
-   📋 **Flexible Input:** Paste code directly or upload a source code file.
-   📊 **Structured Reports:** The review is presented in a clean, tabbed interface for easy digestion.
-   💾 **Downloadable Reports:** Export the complete code review as a `.txt` file for offline access.
-   ✨ **Modern UI:** A clean, responsive user interface built with React and styled with Tailwind CSS.

## Tech Stack

-   **Frontend:** React (built with Vite)
-   **Styling:** Tailwind CSS
-   **Icons:** Lucide React
-   **AI Model:** Google Gemini API

## Local Setup and Installation

Follow these steps to get the project running on your local machine.

### Prerequisites

-   Node.js (v18 or later)
-   npm (or a similar package manager)
-   A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/code-review-assistant.git](https://github.com/your-username/code-review-assistant.git)
    cd code-review-assistant
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your API Key:**
    -   Create a new file in the root of the project directory named `.env`.
    -   Add your Gemini API key to this file. The variable name **must** start with `VITE_`.
        ```
        VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
        ```
    -   You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will now be running at `http://localhost:5173`.

## How to Use

1.  **Select the Language:** Choose the programming language of your code from the dropdown menu.
2.  **Provide the Code:** Paste your code into the text editor, or click "Upload File" to select a file from your computer.
3.  **Review:** Click the "Review My Code" button to start the analysis.
4.  **View and Download:** The AI-generated report will appear. You can switch between tabs to see different aspects of the review and click "Download Report" to save it.

## Contributing

Contributions are welcome! If you have suggestions for improvements, please feel free to fork the repository and create a pull request. You can also open an issue with the "enhancement" tag.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
