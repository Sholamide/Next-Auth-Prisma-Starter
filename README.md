This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Introduction

This project is a simple [NextAuth.js](https://next-auth.js.org/getting-started/introduction) starter that uses prisma,tailwindcss and headlesui.

The Provider uses are [Google](https://next-auth.js.org/providers/google) and [Credentials](https://next-auth.js.org/providers/credentials)

## Getting Started

First, clone the repo

```bash
git clone https://github.com/Sholamide/Next-Auth-Prisma-Starter
```

install the neccessary dependencies by running;

```bash
npm install
#or
yarn add
```

create a .env.local and copy the contents on .env into it.
populate the necessary information in the .env file.

run the application using

```bash
yarn dev
#or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying the files in the `components` folder;
`components/AuthModal.tsx`
`components/LogInForm.tsx`
`components/SignUpForm.tsx`

The page auto-updates as you edit the file by the way.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

I plan to update this starter every chance i get as time goes on but please,if you have any questions or feedback, please reach out to me via [twitter](https://twitter.com/lordolamider) and [LinkedIn](https://www.linkedin.com/in/sholuade-olamide-148159174/)
