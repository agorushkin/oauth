🔐 **Small http server library**

> ⚠️ It should be noted that the project is in the early stages of development and is not ready for use in production.
> The API may change in the future.

## 📖 About

This is a small practice project I started to learn the intricacies of backend development. It includes features such as
user sign-up, token management, token refreshes, and token grants. The aim is to create a simple yet functional HTTP
server that handles authentication and authorization effectively. Feedback and contributions are welcome as I continue
to refine and expand this project.

**USE IN PRODUCTION IS STRONGLY DISCOURAGED, BUT IF YOU DO WANT TO, USE AT YOUR OWN DISCRETION**

## 📦 Installation

### Setting Up

It is worth noting that you can import your own JWK crypto key and store it in `key.json` if you wish, otherwise a new
key will be generated and stored there.

All the user data that is stored after the program is ran, can be found in `data.json`.

### Running

In order to run the project, use `deno -RWN main.ts`

### Configuration

The default port of the program is `8080`, if you wish to change it, you are able to do it through editing
`config/config.json`

### SSL

The program supports SSL out of the box, by default the values in config are set to `""`, as long as length on both
items (`"cert"` and `"key"` is 0, it won't use tls). If you want to use a custom certificate authority, run the program
with the `--cert path/to/CA.pem` flag.

## 📂 Project Structure

```
.
├── config
│   └── config.json
├── deno.json
├── deno.lock
├── lib
│   ├── actions
│   │   ├── exec.ts
│   │   ├── read.ts
│   │   └── write.ts
│   ├── auth
│   │   ├── scope.ts
│   │   └── token.ts
│   ├── crypto
│   │   ├── code.ts
│   │   ├── hash.ts
│   │   ├── key.ts
│   │   ├── salt.ts
│   │   └── ulid.ts
│   ├── data
│   │   ├── constants.ts
│   │   ├── schema.ts
│   │   └── types.ts
│   ├── db.ts
│   ├── routes
│   │   ├── authenticate.ts
│   │   ├── exchange.ts
│   │   ├── grant.ts
│   │   ├── not_found.ts
│   │   ├── refresh.ts
│   │   ├── resource.ts
│   │   ├── sign_in.ts
│   │   ├── sign_up.ts
│   │   └── status.ts
│   └── utils
│       ├── elapse.ts
│       ├── intercept.ts
│       ├── match.ts
│       ├── response.ts
│       └── result.ts
├── main.ts
└── README.md
```
