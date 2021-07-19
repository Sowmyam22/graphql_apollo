const { ApolloServer } = require('apollo-server');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});



/**
 query GetData($userName: String!) {
  books {
    title
    author {
        name
    }
  }
  users {
    id
    login
    avatar_url
  }
  user(name: $userName) {
    id
    login
    avatar_url
  }
  posts {
    id
    title
    description
  }
}

mutation createMyPost {
  createPost(id: 1, title: "New_post_1", description: "This is some description"){
    id
    title
    description
  }
}

mutation Mutation($deletePostId: ID!) {
  deletePost(id: $deletePostId)
}
 */

