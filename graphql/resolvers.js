const axios = require('axios');

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

module.exports = resolvers;