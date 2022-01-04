const express = require('express');
const { gql } = require('apollo-server');
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const typeDefs = require('./typedefs/typeDefs');
const resolvers = require('./resolvers/resolvers');

// Configuring dotenv 
require('dotenv').config()

(async function () {
    const app = express()

    // This `app` is the returned value from `express()`.

    const httpServer = createServer(app);

    // Create scehma using typedefs and resolvers

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    // Create new subscription server

    const subscriptionServer = SubscriptionServer.create({
        // This is the `schema` we just created.
        schema,
        // These are imported from `graphql`.
        execute,
        subscribe,
    }, {
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // Pass a different path here if your ApolloServer serves at
        // a different path.
        path: '/graphql',
    });

    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.

    const server = new ApolloServer({
        schema,

        plugins: [{
            async serverWillStart() {
                return {
                    async drainServer() {
                        subscriptionServer.close();
                    }
                };
            }
        }],
    });

    //Start the server

    await server.start();
    server.applyMiddleware({ app });

    //PORT on which the erver is running

    const PORT = process.env.PORT||4000;
    httpServer.listen(PORT, () =>
        console.log(`Server is now running on http://localhost:${PORT}/graphql`)
    );
})()