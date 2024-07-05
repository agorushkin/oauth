🔐 **Small http server library**

> ⚠️ It should be noted that the project is in the early stages of development
> and is not ready for use in production. The API may change in the future.

## 📖 About

This is a small practice project I started to learn the intricacies of backend
development. It includes features such as user sign-up, token management, token
refreshes, and token grants. The aim is to create a simple yet functional HTTP
server that handles authentication and authorization effectively. Feedback and
contributions are welcome as I continue to refine and expand this project.

## 📦 Installation

### Setting Up

After copying the repository, run the `setup.sh` to create required foulders. It
is worth noting that you can import your own JWK crypto key and store it in
`keys/key.json` if you wish, otherwise a new key will be generated and stored
there.

All the user data that is stored after the program is ran, can be found in
`lib/data/data.json`.

### Running

In order to run the project, use
`deno run --allow-read --allow-write --allow-net main.ts`

### Configuration

The default port of the program is `8080`, if you wish to change it, you are
able to do it through editing `lib/config/config.json`

### SSL

The program doesn't support SSL out of the box, but it is really easy to add by
modifying the `Server.listen` call in `lib/main.ts` to include the files. If you
want to use a custom certificate authority, run the program with the
`--cert path/to/CA.pem` flag.

## 📂 Project Structure

```
.
├── README.md
├── deno.json
├── deno.lock
├── key
├── lib
│   ├── config
│   │   └── config.json
│   ├── data
│   │   ├── consts.ts
│   │   ├── data.json
│   │   ├── schema.ts
│   │   └── types.ts
│   ├── main.ts
│   ├── routes
│   │   ├── authorize.ts
│   │   ├── exchange.ts
│   │   ├── grant.ts
│   │   ├── not-found.ts
│   │   ├── refresh.ts
│   │   ├── resource.ts
│   │   ├── sign-in.ts
│   │   ├── sign-up.ts
│   │   └── status.ts
│   └── src
│       ├── actions
│       │   ├── exec.ts
│       │   ├── read.ts
│       │   └── write.ts
│       ├── auth
│       │   ├── scope.ts
│       │   └── token.ts
│       ├── crypto
│       │   ├── code.ts
│       │   ├── hash.ts
│       │   ├── key.ts
│       │   ├── salt.ts
│       │   └── ulid.ts
│       ├── db.ts
│       └── util
│           ├── guard.ts
│           ├── match.ts
│           └── response.ts
├── main.ts
└── setup.sh
```
