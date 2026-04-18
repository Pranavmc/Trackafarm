# TrackaFarm Client

This frontend is built with React + Vite and is designed to work with the TrackaFarm Node/Express API.

## Free Deployment Setup

You can deploy this project for free without buying a domain by using:

- **Frontend:** [Vercel](https://vercel.app)
- **Backend:** [Render](https://render.com)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier)

Example deployment URLs:

- Frontend: `https://trackafarm.vercel.app`
- Backend: `https://trackafarm-api.onrender.com`

## 1. Deploy the Backend on Render

Create a new **Web Service** on Render from your GitHub repository.

Use these settings:

- **Root directory:** `server`
- **Environment:** `Node`
- **Build command:** `npm install`
- **Start command:** `npm start`

Add these environment variables:

- `MONGO_URI`: your MongoDB Atlas connection string
- `JWT_SECRET`: a long random string
- `CLIENT_URL`: `https://your-frontend-name.vercel.app`
- `EMAIL_USER`: your email address
- `EMAIL_PASS`: your email app password

After deployment, Render will give you a URL like:
`https://trackafarm-api.onrender.com`

---

## 2. Deploy the Frontend on Vercel

Import the same GitHub repository into Vercel.

Use these settings:

- **Root directory:** `client`
- **Framework preset:** `Vite`
- **Build command:** `npm run build`
- **Output directory:** `dist`

### Configuration for Routing

A `vercel.json` file is included in the `client` directory to handle Single Page Application (SPA) routing. This ensures that refreshing the page on routes like `/dashboard` works correctly.

### Environment Variables

Add this environment variable in the Vercel dashboard:

- `VITE_API_BASE_URL`: `https://your-backend-name.onrender.com/api`

---

## 3. Final Connection Step

Once the frontend is deployed, copy the final Vercel URL and update the **backend** variable on Render:

- `CLIENT_URL=https://your-frontend-name.vercel.app`

Then redeploy the backend once so CORS allows your frontend to communicate with it.

## 4. Environment Files

Example environment files are already included:

- Backend: [../server/.env.example](../server/.env.example)
- Frontend: [.env.example](./.env.example)

Frontend example:
```env
VITE_API_BASE_URL=https://your-backend-name.onrender.com/api
```

Backend example:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trackafarm
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=https://your-frontend-name.vercel.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 5. Important Notes

- **MongoDB Atlas:** Must allow connections from your hosting provider. For a quick start, allow `0.0.0.0/0` in Atlas network access.
- **API URL:** The frontend calls the backend using `VITE_API_BASE_URL`. Ensure it ends with `/api`.
- **CORS:** If you get a CORS error, double-check that `CLIENT_URL` in your backend environment variables matches your Vercel URL exactly.

## Local Development

### Frontend:
```bash
cd client
npm install
npm run dev
```

### Backend:
```bash
cd server
npm install
npm run dev
```

### Local Environment:
- Frontend: `VITE_API_BASE_URL=http://localhost:5000/api`
- Backend: `CLIENT_URL=http://localhost:5173`
