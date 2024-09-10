# Anala - Personal Blog

## What is Anala?

Anala is one of the names of the Fire God/Deity. This blog is named "Anala" as it’s developed using Astro and Firebase, combining the fiery nature of innovation with a modern tech stack.

## Why Astro? Why not XYZ?

I've been using Hugo for years and absolutely loved it. However, as I started traveling more frequently, managing my thoughts became cumbersome on the go. I needed something more flexible and customizable, so I created this blog with Astro.

While Netlify offers a CMS for Hugo, I wanted something simpler and more tailored to my needs.

## What is the tech stack?

The stack includes:
- Strict TypeScript
- Astro
- Firebase
- Admin built in React with Static React Routing
- Hosted on Netlify Functions

## Is it complete?

Not quite, but it’s fully usable! I’m in the process of migrating my own blog over to this platform and will continue updating the code as I encounter challenges. I’d appreciate support from the community—if you need something specific, please file an issue! The goal is to keep it simple, so let’s collaborate within that scope.

## Enough talk. I want to deploy it.

### Firebase Account
1. Create a Firebase account.
2. Navigate to **Project Settings** → **General Tab** and add a Web App.
3. In the **Service Accounts** section, under **Firebase Admin SDK**, generate a new private key. A JSON file will be downloaded.
4. You'll need to set up several environment variables before deployment. Most of these values can be found in the General Tab or the downloaded JSON file:

```dotenv
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_CERT_URL=
FIREBASE_CLIENT_CERT_URL=
PUBLIC_FIREBASE_API_KEY=
PUBLIC_FIREBASE_AUTH_DOMAIN=
PUBLIC_FIREBASE_PROJECT_ID=
PUBLIC_FIREBASE_STORAGE_BUCKET=
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
PUBLIC_FIREBASE_APP_ID=
PUBLIC_SLUG_DATE_FORMAT=yyyy/MM //any datefns format if that is needed.
SITE_TITLE= //title of your blog
SITE_DESCRIPTION= //short description of your blog
PUBLIC_SITE_POST_PER_PAGE=10 // Blogs displayed per page
ALLOWED_EMAILS=foo@bar.com,bar@foo.com // email ids you like to allowed
PUBLIC_SITE=https://anala.netlify.app // your site address
```
5. Go to the Authentication tab and set up Gmail and Email/Password-based authentication. Currently, only these two methods are supported, but feel free to contribute PRs to expand the options!
6. Once set up, you have two options:
   - **Deploy to Netlify**: Click the deploy button below, fill in the necessary details, and add your environment variables.
   - **Fork the repo**: You can also fork this repository and point it to Netlify.
7. That's it! Enjoy blogging. If you encounter any issues or if a step is unclear, feel free to reach out.

## Indexing 

This blog requires indexing. Instead of manually setting it up, simply click on tags or categories within the blog, and it will generate the necessary Firebase links. Clicking these links will create the indexes automatically. If you’d prefer a step-by-step guide for creating indexes, file an issue, and I’ll add the instructions.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/integration/start/deploy?repository=https://github.com/kunjee17/anala)