# Rangle Koa-starter for Typescript

## Quick Start

This starter works with `npm` or [`yarn`](http://yarnpkg.com).

Install:

```sh
yarn # or npm install
```

Run in dev mode, restarting the server on file changes:

```sh
yarn dev
```

Run unit tests:

```sh
yarn test
```

Run in prod mode, not daemonized, with staging config (suitable for Heroku):

```sh
yarn build
yarn start
```

Start/stop in prod mode, daemonized, with local config:

```sh
yarn build
yarn local:start
yarn local:stop
```

Start/stop in prod mode, daemonized mode, with staging config:

```sh
yarn build
yarn staging:start
yarn staging:stop
```

Build (or update) the API documentation to `api.html` in the root:

```sh
yarn raml
```

## Things of note for the TypeScript port

As part of the port, all of the files have been updated to define and
import ES6 modules. The typings in relation to the original [Rangle Koa starter](https://github.com/rangle/api-koa-starter) are straightforward, with a few exceptions.

The first of those is the `request-id-generator.ts` middleware. It adds a new field to
the Koa context, so it uses [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) to add it
as a new optional field to both the context itself and the request headers. This
lets the rest of the code access this field without errors, or needing to fallback
to `any`.

The second of the use of a generic type parameter in the `validateParams` middleware
constructor function. This adds a small amount of intra-module type checking for
`validate-params.ts`, but unfortunately the Typescript compiler is currently unable
to check that the provided path actually produces a value with the type the validator
expects when navigated from the context object.

The `project-env.ts` file defines a common interface for the options loaded from the
different modules with environment options. These modules are dynamically loaded
with `require`, so the TypeScript compiler is also unable to check that they indeed
define the proper interface.

The `package.json` file now defines a `build` target to compile TypeScript files
to JavaScript. It also changes the `dev` target to run [`ts-node-dev`](https://github.com/whitecolor/ts-node-dev)
instead of `nodemon`, for faster reloading from changes in the TypeScript files while
in development mode. The TypeScript compiler targets ES2017, as that is [fully supported](https://node.green/#ES2017)
by both the current (version 10) and last (version 9) major versions of Node.js.

The thing of note is not related to TypeScript per se, but the implementation of the
`outgoingRequest` service in `outgoing-request-service.ts` was changed from promises
to `async/await`.
