~Visible for a short duration of time~

# get-er-done-BE
the back-end for get-er-done

## Run locally

```bash
npm install
npm run dev
```

The API runs on `http://localhost:8080` by default.

## Environment variables

Create a `.env` file with values like:

```env
PORT=8080
MONGODB_URI_DEV=mongodb://localhost:27017/_git-er-done
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Google Sign-In login

Backend endpoint:

```http
POST /api/users/login/google
Content-Type: application/json
```

Request body:

```json
{
  "idToken": "GOOGLE_ID_TOKEN_FROM_FRONTEND"
}
```

### React frontend example

```jsx
import { useEffect } from 'react';

export default function GoogleLoginButton() {
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById('googleSignInDiv'),
      { theme: 'outline', size: 'large' }
    );
  }, []);

  async function handleCredentialResponse(response) {
    const idToken = response.credential;

    try {
      const res = await fetch('http://localhost:8080/api/users/login/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      console.log('Logged in user:', data);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  }

  return <div id="googleSignInDiv" />;
}
```

Add the Google Identity Services script in your frontend `index.html`:

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Next.js frontend example

```jsx
'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function GoogleLoginButton() {
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById('googleSignInDiv'),
      { theme: 'outline', size: 'large' }
    );
  }, []);

  async function handleCredentialResponse(response) {
    const idToken = response.credential;

    try {
      const res = await fetch('http://localhost:8080/api/users/login/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      console.log('Logged in user:', data);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />
      <div id="googleSignInDiv" />
    </>
  );
}
```

For Next.js, add this to your frontend `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

> `response.credential` is the Google ID token your backend expects. This is **not** the same as the OAuth client ID.

