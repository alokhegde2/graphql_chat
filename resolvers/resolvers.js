const pubsub = require('../pubsub/pubsub')

// Resolvers define the technique for fetching the types defined in the schema.

const resolvers = {
    Query: {
        getChatRooms: (_, { userId }) => {
            console.log(userId);
            return {
                id: "String",
                userOneId: "String",
                userTwoId: "String",
                lastMessage: "String",
                lastMessageSendBy: "String",
                lastMessageMessageTS: "String"
            }
        }
    }
}

module.exports = resolvers