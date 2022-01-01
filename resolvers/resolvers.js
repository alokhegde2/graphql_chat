const pubsub = require('../pubsub/pubsub')

// Resolvers define the technique for fetching the types defined in the schema.
const chatRoom =[
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
        getChatRooms: (parent, args, context, info) => {
            console.log(args.id);
            return chatRoom
        }
    }
}

module.exports = resolvers