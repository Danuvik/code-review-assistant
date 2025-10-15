Code Review Assistant
An AI-powered web application that automates code reviews, providing instant feedback on readability, modularity, and potential bugs. Built with React and powered by the Google Gemini API.

Objective
This project automates the code review process by leveraging Large Language Models (LLMs) to analyze source code. It helps developers improve code quality by identifying areas for enhancement in structure, readability, and adherence to best practices.

Features
AI-Powered Analysis: Get intelligent suggestions on readability, modularity, and potential bugs.

Multi-Language Support: Review code in a wide range of popular programming languages including JavaScript, Python, Java, C++, and more.

Flexible Input: Users can either paste their code directly into the editor or upload a source code file.

Structured Reports: The review is presented in a clean, tabbed interface, making it easy to digest the feedback.

Downloadable Reports: Export the complete code review as a .txt file for offline access or sharing.

Modern UI: A clean, responsive user interface built with React and styled with Tailwind CSS.

Tech Stack
Frontend: React (built with Vite)

Styling: Tailwind CSS

Icons: Lucide React

AI Model: Google Gemini API

Local Setup and Installation
Follow these steps to get the project running on your local machine.

Prerequisites
Node.js (v18 or later)

npm (or a similar package manager)

A Google Gemini API Key

Installation
Clone the repository:

git clone [https://github.com/your-username/code-review-assistant.git](https://github.com/your-username/code-review-assistant.git)
cd code-review-assistant

Install dependencies:

npm install

Set up your API Key:

Create a new file in the root of the project directory named .env.

Add your Gemini API key to this file. The variable name must start with VITE_.

VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE

You can get a free API key from Google AI Studio.

Run the development server:

npm run dev

The application will now be running at http://localhost:5173.

How to Use
Select the Language: Choose the programming language of the code you want to review from the dropdown menu.

Provide the Code:

Paste your code directly into the text editor.

OR, click the "Upload File" button to select a source code file from your computer.

Review: Click the "Review My Code" button to start the analysis.

View and Download: The AI-generated report will appear in the panel on the right. You can switch between tabs to see different aspects of the review and click "Download Report" to save it.

