const express = require('express');
const { gql } = require('apollo-server');
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');

