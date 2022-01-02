const pubsub = require('../pubsub/pubsub')

const { getChatRooms, createChatRoom, getChatRoom, getMessages, addNewMessage } = require('../database/dynamo')
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
                return { message: "Success!", response: 200, chatRoomData: data.data }
            } else {
                return { message: "Unable to get/Create chat room", response: 400, chatRoomData: [] }
            }
        },

        //This mutation will add new message

        addNewMessage: async (parent, args, context, info) => {
            const data = await addNewMessage(args)
            if (data.response === 200) {
                return { message: "Success!", response: 200, chatRoomData: [data.data] }
            } else {
                return { message: "Unable to add message", response: 400, chatRoomData: [] }
            }
        }
    }
}

module.exports = resolvers