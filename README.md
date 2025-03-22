# 🌐 PDF Management & Collaboration - Frontend

This is the **frontend** of a full-stack PDF Management & Collaboration web app. Built using **React + TypeScript**, the UI is interactive, responsive, and works seamlessly across devices. It interacts with the backend to allow users to upload, share, and comment on PDF files.

---

## ⚙️ Tech Stack

- **Framework**: React
- **Language**: TypeScript (`.ts`, `.tsx`)
- **Styling**: CSS / Tailwind / any other (optional to mention)
- **HTTP Requests**: Axios / Fetch
- **State Management**: useState, useEffect, etc.
- **Routing**: React Router
- **Deployment**: Railway

---

## ✨ Features

- 🔐 User Authentication (Login, Register, Reset Password)
- 📄 Upload, View, and Search PDFs
- 📤 Share PDFs via link (no login required to view)
- 💬 Comment & Reply on shared PDFs
- 🖥️ Fully Responsive and Interactive UI
- ⚡ Seamless API Integration with the Backend

---
## Getting Started

### Prerequisites

- Node.js

### Installation

1. Clone the repository:

```sh
git clone https://github.com/your-repo/spotdraft.git
cd spotdraft/frontend
```

2. Install dependencies:

```sh
npm install
```

3. Start the development server:

```sh
npm run dev
```

The development server will start on `http://localhost:5173`.

### Building for Production

To build the project for production, run:

```sh
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Linting

To lint the project, run:

```sh
npm run lint
```

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the codebase.
- `npm run preview`: Previews the production build.

## Configuration

### Environment Variables

You can configure the API base URL by setting the `VITE_API_URL` environment variable in a `.env` file at the root of the `frontend` directory.

```env
VITE_API_URL=http://localhost:8000/api
```

### Tailwind CSS

Tailwind CSS is used for styling. You can configure it in the `tailwind.config.js` file.

### TypeScript

TypeScript is used for type checking. The configuration files are `tsconfig.json`, `tsconfig.app.json`, and `tsconfig.node.json`.

👤 Author
Ayush

GitHub: @Ayeoshh


