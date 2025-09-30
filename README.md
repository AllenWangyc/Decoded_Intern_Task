# Decoded Intern Task – Mock UI Generator

This project is an **AI-powered mock UI generator**, deployed under the URL: https://decoded-intern-task-client.netlify.app
Users can enter a natural language description of an app idea, and the system will generate a **mock UI** consisting of menus, forms, and buttons.

---

## Features

- **Frontend (React + Vite + Ant Design)**
  - Clean and responsive UI (desktop & mobile layouts)
  - Left panel: description input & submission
  - Right panel: generated mock UI
  - Dynamic `Menu` + corresponding forms

- **Backend (Node.js + Express + MongoDB)**
  - REST API with clear contract
  - AI integration via OpenAI API
  - Extensible MVC structure (models, controllers, routes)
  - CORS enabled (supports local dev + deployed frontend)


---

## Tech Stack

- **Frontend:** React, Vite, Ant Design  
- **Backend:** Node.js, Express, Mongoose, OpenAI SDK  
- **Database:** MongoDB (Atlas or local)  
- **Deployment:** Netlify (frontend) + Render (backend)

---

## Local Development Setup

### Clone the repository

```bash
git clone https://github.com/AllenWangyc/Decoded_Intern_Task.git
cd Decoded_Intern_Task
```

### Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```bash
OPENAI_API_KEY=your_openai_api_key
MONGO_URI=your_mongodb_connection_string
PORT=4000
```

Run backend server:

```bash
npm start
```

By default, it runs on **http://localhost:4000**.

Setup frontend

```bash
cd ../frontend

npm install

```

Create a `.env` file in `/frontend`:

```bash
VITE_API_URL=http://localhost:4000/api
```

Run frontend dev server:

```bash
npm run dev
```

Frontend runs on http://localhost:5173.

##  Author

Intern Project by Yuchen Wang.

