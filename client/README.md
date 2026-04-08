# TrackaFarm Client

This frontend is built with React + Vite and is designed to work with the TrackaFarm Node/Express API.

## Free Deployment Setup

You can deploy this project for free without buying a domain by using:

- Frontend: Vercel
- Backend: Koyeb
- Database: MongoDB Atlas free tier

Example deployment URLs:

- Frontend: `https://trackafarm.vercel.app`
- Backend: `https://trackafarm-api.koyeb.app`

## 1. Deploy the Backend on Koyeb

Create a new Web Service on Koyeb from your GitHub repository.

Use these settings:

- Root directory: `server`
- Build command: leave default or use `npm install`
- Start command: `npm start`

Add these environment variables:

- `MONGO_URI=your-mongodb-atlas-connection-string`
- `JWT_SECRET=your-long-random-secret`
- `CLIENT_URL=https://your-frontend-name.vercel.app`
- `EMAIL_USER=your-email@gmail.com`
- `EMAIL_PASS=your-email-app-password`

After deployment, Koyeb will give you a URL like:

`https://your-backend-name.koyeb.app`

Test it in the browser:

`https://your-backend-name.koyeb.app/`

You should see:

```json
{ "message": "TrackaFarm API Running" }
```

## 2. Deploy the Frontend on Vercel

Import the same GitHub repository into Vercel.

Use these settings:

- Root directory: `client`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Add this environment variable:

- `VITE_API_BASE_URL=https://your-backend-name.koyeb.app/api`

After deployment, Vercel will give you a URL like:

`https://your-frontend-name.vercel.app`

## 3. Final Connection Step

Once the frontend is deployed, copy the final Vercel URL and update the backend variable:

- `CLIENT_URL=https://your-frontend-name.vercel.app`

Then redeploy the backend on Koyeb once so CORS allows your frontend.

## 4. Environment Files

Example environment files are already included:

- Backend: [../server/.env.example](../server/.env.example)
- Frontend: [.env.example](./.env.example)

Frontend example:

```env
VITE_API_BASE_URL=https://your-backend-name.koyeb.app/api
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

- MongoDB Atlas must allow connections from Koyeb. For a quick start, you can temporarily allow `0.0.0.0/0` in Atlas network access.
- If Gmail email sending fails, use a Gmail App Password, not your normal Gmail password.
- The frontend calls the backend using `VITE_API_BASE_URL`, so make sure it ends with `/api`.
- If you change your Vercel URL later, update `CLIENT_URL` in Koyeb and redeploy.

## Local Development

Frontend:

```bash
cd client
npm install
npm run dev
```

Backend:

```bash
cd server
npm install
npm run dev
```

Local frontend env:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Local backend env:

```env
CLIENT_URL=http://localhost:5173
```
