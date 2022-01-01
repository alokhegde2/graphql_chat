const AWS = require('aws-sdk');

// Configuring dotenv 
require('dotenv').config()

// Configuring AWS

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Creating dynamodb document client 

const dynamoClient = new AWS.DynamoDB.DocumentClient();

//Table name for querying

const chatRoomTableName = "plugn_chat_rooms"

const messageTableName = "plugn_messages"



