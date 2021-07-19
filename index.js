const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

const typeDefs = gql`
# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

# This "Book" type defines the queryable fields for every book in our data source.

  type Book {
    id: ID!
    title: String!
    author: Author
  }

  type Author {
      name: String
  }

  type User {
    id: ID
    login: String
    avatar_url: String
  }

  type Post {
      id: ID!
      title: String!
      description: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).

  type Query {
    books: [Book]
    authors: [Author]
    users: [User]
    user(name: String!): User!
    posts: [Post]
  }

  type Mutation {
      createPost(id: ID!, title: String!, description: String!): Post
  }
`;

const books = [
    {
        id: 1,
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        id: 2,
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

const authors = [
    {
        name: 'Kate Chopin',
    },
    {
        name: 'Paul Auster',
    },
    {
        name: 'Sowmya',
    }
]

const posts = [];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: () => books,
        authors: () => authors,
        users: async () => {
            try {
                const users = await axios.get("https://api.github.com/users");
                return users.data.map(({ id, login, avatar_url }) => ({
                    id,
                    login,
                    avatar_url
                }));
            } catch (error) {
                throw error;
            }
        },
        user: async (_, args) => {
            try {
                const user = await axios.get(
                    `https://api.github.com/users/${args.name}`
                );
                return {
                    id: user.data.id,
                    login: user.data.login,
                    avatar_url: user.data.avatar_url
                };
            } catch (error) {
                throw error;
            }
        },
        posts: () => posts,
    },

    Book: {
        // The parent resolver (Library.books) returns an object with the
        // author's name in the "author" field. Return a JSON object containing
        // the name, because this field expects an object.
        author(parent) {
            console.log(parent);
            return {
                name: parent.author
            };
        }
    },

    Mutation: {
        createPost: (_, args) => {
            console.log(args);
            posts.push(args);
            return args;
        }
    }
};

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
 */

