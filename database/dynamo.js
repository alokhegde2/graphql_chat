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

const getChatRooms = async (userId) => {
    const params = {
        TableName: chatRoomTableName,
        FilterExpression: '#userOneId = :userId or #userTwoId = :userId', // optional
        ExpressionAttributeValues: { ':userId': userId }, // optional
        ExpressionAttributeNames: { '#userOneId': 'userOneId', '#userTwoId': 'userTwoId' }, // 
    };

    try {
        const data = await dynamoClient.scan(params).promise()
        console.log(data);
        return { data: data.Items, response: "200" }
    } catch (error) {
        console.log(error);
        return { response: "500" }
    }
}

module.exports = { getChatRooms }
