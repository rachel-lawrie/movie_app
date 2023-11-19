# Project Name

MyFlix API

## Description

This heroku supported API enables the client to make requests and receive responses as part of an App that enables a user to create an account, login, view movies, create a list of favorites, edit their profile, log-out, and delete their account. See the "out" folder for more detailed technical documentation.

## Installation

Before installation, ensure you have Node.js and npm (Node Package Manager) installed. You will also need a Heroku account and the Heroku CLI (Command Line Interface) installed for deployment.

1. **Clone the Repository:**

   - Clone the MyFlix API repository to your local machine using `git clone [repository URL]`.

2. **Install Dependencies:**

   - Navigate to the root directory of the project in your terminal and run `npm install` to install all required dependencies.

3. **Environment Variables:**

   - Set up the necessary environment variables. This typically includes database connection strings, API keys, and other sensitive information that should not be hard-coded into the application.

4. **Local Testing (Optional):**

   - Run the application locally using `npm start` or a similar command defined in your `package.json` file to test its functionality.

5. **Heroku Setup:**

   - Log in to your Heroku account through the CLI using `heroku login`.
   - Create a new Heroku app using `heroku create`.

6. **Deploy to Heroku:**

   - Deploy your code to Heroku using `git push heroku main` (assuming your main branch is named `main`).

7. **Configure Heroku:**

   - Set up any necessary config vars in Heroku, which are equivalent to your local environment variables.

8. **Access the Deployed API:**
   - Once deployed, access your API via the provided Heroku URL.

Remember to check the `Procfile` in your repository to ensure it's correctly set up for Heroku deployment.

## Usage

- Edit the CORS oplicy in the index.js file to enable the desired client access.
- The API endpoints include functionality for account creation, login, viewing movies, managing a favorites list, profile editing, logging out, and account deletion.
- Use the endpoints in your client application to interact with the MyFlix database.
