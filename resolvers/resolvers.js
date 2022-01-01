const pubsub = require('../pubsub/pubsub')

const { getChatRooms } = require('../database/dynamo')
// Resolvers define the technique for fetching the types defined in the schema.
const chatRoom = [
    {
        id: "String",
        userOneId: "String",
        userTwoId: "String",
        lastMessage: "String",
        lastMessageSendBy: "String",
        lastMessageMessageTS: "String"
    },
    {
        id: "String1",
        userOneId: "String",
        userTwoId: "String",
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
            return data.data
        }
    }
}

module.exports = resolvers