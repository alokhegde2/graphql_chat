const pubsub = require('../pubsub/pubsub')
const { withFilter } = require('graphql-subscriptions');

const { getChatRooms, getChatRoom, getMessages, addNewMessage } = require('../database/dynamo')
// Resolvers define the technique for fetching the types defined in the schema.

const resolvers = {

    //Query

    Query: {
        getChatRooms: async (parent, args, context, info) => {
            const data = await getChatRooms(args.id)
            if (data.response === 200) {
                return data.data
            }
            return []
        },
        getMessages: async (parent, args, context, info) => {
            const data = await getMessages(args.chatRoomId)
            if (data.response === 200) {
                if (data.data.Count === 0) {
                    return []
                }
                return data.data
            }
            return []
        }
    },

    //Mutations

    Mutation: {

        //This mutation will create new chatroom / or get the already created chatroom

        getChatRoom: async (parent, args, context, info) => {
            if (!args.userOneId || !args.userTwoId) {
                return { message: "Send user Id of the both user", response: 400 }
            }
            const data = await getChatRoom(args.userOneId, args.userTwoId)
            if (data.response === 200) {
                return { message: "Success!", response: 200, chatRoomData: [data.data] }
            } else {
                return { message: "Unable to get/Create chat room", response: 400, chatRoomData: [] }
            }
        },

        //This mutation will add new message

        addNewMessage: async (parent, args, context, info) => {
            const data = await addNewMessage(args)
            if (data.response === 200) {
                pubsub.publish('MESSAGE_ADDED', { newMessageAdded: data.data });
                const val = data.data.chatRoomId.split('-')
                console.log(val);
                pubsub.publish('CHATROOM_UPDATED', { chatRoomUpdated: { data: val, message: "New message arrived" } });
                return { message: "Success!", response: 200, chatRoomData: [data.data] }
            } else {
                return { message: "Unable to add message", response: 400, chatRoomData: [] }
            }
        }
    },

    //Subscription

    Subscription: {
        //When new messages is added
        newMessageAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('MESSAGE_ADDED'),
                (payload, variables) => {
                    // It will only push the message only 
                    // if client given chatRoomId and mutation returned chatRoomID  
                    return payload.newMessageAdded.chatRoomId === variables.chatRoomId;
                }
            )
        },

        // When chat room updates means when new message is added order of the 
        // Chat room will be changed
        chatRoomUpdated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('CHATROOM_UPDATED'),
                (payload, variables) => {
                    // It will only push the message only 
                    // if client given chatRoomId and mutation returned chatRoomID  
                    console.log(payload.chatRoomUpdated.data.includes(variables.userId));
                    return payload.chatRoomUpdated.data.includes(variables.userId);
                }
            )
        }
    }
}

module.exports = resolvers