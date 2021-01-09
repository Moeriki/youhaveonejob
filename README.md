# You Have One Job

![deploy](https://github.com/Moeriki/youhaveonejob/workflows/deploy/badge.svg)

## Environments

### Local development

Start docker container.

```sh
docker-compose up -d
```

Create `apps/api/.env`.

```sh
DATABASE_URL="postgresql://api:api@localhost:5432/api?schema=public"
```

Generate the API's Nexus / Prisma files.

```sh
yarn workspace api generate
```

Start both the API and Web App.

```sh
yarn start
```

- [API](http://localhost:4000)
- [Web App](http://localhost:4200)

### Development

Both the API and Web App are automatically deployed to development on push to `main` after running linting and tests.

- [API](https://oaobhbrxqk.execute-api.eu-west-1.amazonaws.com/dev/graphql)
- [Web App](https://preview.youhaveonejob.app)

### Production

The API is automatically deployed to production when a tag matching `v*` is pushed.

The front-end has to be deployed manually through Vercel's UI.

- [API](https://f2c6wj1yai.execute-api.eu-west-1.amazonaws.com/prod/graphql)
- [Web App](https://youhaveonejob.app)
