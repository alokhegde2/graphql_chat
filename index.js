const express = require('express');
const { gql } = require('apollo-server');
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');

(async function () {
    const app = express()

    // This `app` is the returned value from `express()`.
    const httpServer = createServer(app);
})()