# Generate the Prisma client and copy it to the monorepo's root node modules.
# This is necessary so it can be properly packed by the serverless framework.
yarn workspace api run generate:prisma
cp -r apps/api/node_modules/.prisma ./node_modules

# Build and deploy the API code
yarn nx run api:build --configuration=production
yarn serverless deploy
