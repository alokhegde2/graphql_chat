const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

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


// This function will get the chatrooms which are created by/with the logged in user

const getChatRooms = async (userId) => {
    const params = {
        TableName: chatRoomTableName,
        FilterExpression: 'contains(userIds,:userId)', // optional
        ExpressionAttributeValues: { ':userId': userId }, // optional
    };

    try {
        const data = await dynamoClient.scan(params).promise()
        console.log(data);
        return { data: data.Items, response: 200 }
    } catch (error) {
        console.log(error);
        return { response: 500 }
    }
}

// This function will create a new chat room for user to do message
// All chatroom consist of only two user

const createChatRoom = async (args) => {
    const item_data = {
        id: args.userOneId + "-" + args.userTwoId,
        userIds: [args.userOneId, args.userTwoId],
        lastMessage: "",
        lastMessageSendBy: "",
        lastMessageMessageTS: ""
    }

    const params = {
        TableName: chatRoomTableName,
        Item: item_data,
    }

    try {
        await dynamoClient.put(params).promise();
        return { data: item_data, response: 200 };
    } catch (error) {
        console.error(error);
        return { response: 500 }
    }
}

// This will is used to get one specific chat room
// This function helps when user searched another user in 
// Search bar at that time we didn't know the chatroom id
// At that time this function will get the chat room id if
// the chat room already exists else it'll create a new one

const getChatRoom = async (userId1, userId2) => {
    const params = {
        TableName: chatRoomTableName,
        FilterExpression: 'contains(userIds,:userId1) and contains(userIds,:userId2)', // optional
        ExpressionAttributeValues: { ':userId1': userId1, ':userId2': userId2 }, // optional
    };

    try {
        const data = await dynamoClient.scan(params).promise()
        console.log(data);
        if (data.Count === 0) {
            const chatRoomData = {
                userOneId: userId1,
                userTwoId: userId2
            }
            const creation_response = await createChatRoom(chatRoomData)

            if (creation_response.response === 200) {
                return { data: creation_response, response: 200 }
            } else {
                return { response: 500 }
            }
        }
        return { data: data.Items, response: 200 }
    } catch (error) {
        console.log(error);
        return { response: 500 }
    }
}


//Getting all messages between two user
// We are chatroomid and find all the chats

const getMessages = async (chatroomId) => {
    if (!chatroomId) {
        return { message: "Send chatRoomId", response: 400 }
    }

    const params = {
        TableName: messageTableName,
        FilterExpression: 'chatRoomId = :chatRoomId', // optional
        ExpressionAttributeValues: { ':chatRoomId': chatroomId }, // optional
    };

    try {
        const data = await dynamoClient.scan(params).promise()
        return { response: 200, data: data.Items }
    } catch (error) {
        console.error(error);
        return { response: 400, message: "Unable to send message" }
    }
}


// Add new message to the databse

const addNewMessage = async (args) => {
    const item_data = {
        id: uuidv4(),
        message: args.message,
        sendBy: args.sendBy,
        attachment: args.attachment,
        voiceMessageAttachment: args.voiceMessageAttachment,
        TS: Date.now(),
        chatRoomId: args.chatRoomId
    }

    const chatRoom_params = {
        TableName: chatRoomTableName,
        Key: { id: args.chatRoomId },
        UpdateExpression: 'set lastMessage = :lastMessage, lastMessageSendBy = :lastMessageSendBy , lastMessageMessageTS = :lastMessageMessageTS',
        ExpressionAttributeValues: { ':lastMessage': args.message, ':lastMessageSendBy': args.sendBy, ':lastMessageMessageTS': Date.now() },
    }

    const params = {
        TableName: messageTableName,
        Item: item_data
    }

    try {
        await dynamoClient.put(params).promise();
        dynamoClient.update(chatRoom_params).promise();
        return { data: item_data, response: 200 };
    } catch (error) {
        console.error(error);
        return { response: 500 }
    }
}



module.exports = { getChatRooms, createChatRoom, getChatRoom, getMessages, addNewMessage }
