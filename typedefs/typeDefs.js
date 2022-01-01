const { gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

# This "Message" type defines the queryable field of message 

type Message {
    id: String
    message: String
    sendBy: String
    attachment: String
    voiceMessageAttachment: String
    TS: String
    chatRoomId: String
}

# This "ChatRoom" type defines the queryable fields for every message in our data source.

type ChatRoom {
    id: String
    userOneId: String
    userTwoId: String
    lastMessage: String
    lastMessageSendBy: String
    lastMessageMessageTS: String
    # message: [Message]
}

# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this

type Query {
    getChatRooms: [ChatRoom]
}

# The "Mutation" type is similar to POST Request
# The createNewChat room is used to create new chat room for two user
# And addNewMessage is used to create new message

type Mutation {
    createNewChatRoom(id: String!,userOneId: String!,userTwoId: String!,lastMessage: String!,lastMessageMessageTS: String!)
    addNewMessage(id: String!,message: String!,sendBy: String!,attachment: String!,voiceMessageAttachment: String!,TS: String!,chatRoomId: String!)
}

# The "Subscription" is a type of websocket coneection
# It will listen for changes or some event to occur
# once the event occurs subscription will return data
# client can subscribe for two events 
# 1. When newChatRoomAdded
# 2. When newMessageAdded

type Subscription {
    newChatRoomAdded : ChatRoom
    newMessageAdded : Message
}
`

module.exports = typeDefs