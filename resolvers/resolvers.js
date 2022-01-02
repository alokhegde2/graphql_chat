const pubsub = require('../pubsub/pubsub')

const { getChatRooms, createChatRoom, getChatRoom } = require('../database/dynamo')
// Resolvers define the technique for fetching the types defined in the schema.
const chatRoom = [
    {
        id: "String",
        userIds: ["@alok", "@hegde"],
        lastMessage: "String",
        lastMessageSendBy: "String",
        lastMessageMessageTS: "String"
    },
    {
        id: "String1",
        userIds: ["@hegde", "@alok"],
        lastMessage: "String",
        lastMessageSendBy: "String",
        lastMessageMessageTS: "String"
    }
]

const resolvers = {
    Query: {
        getChatRooms: async (parent, args, context, info) => {
            console.log(args.id);
            const data = await getChatRooms(args.id)
            if (data.response === 200) {
                return data.data
            }
            return []
        },
        getMessages: async (parent, args, context, info) => {

        }
    },
    Mutation: {
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
        addNewMessage: async (parent, args, context, info) => {

        }
    }
}

module.exports = resolvers