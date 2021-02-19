import { ApolloServer, gql } from 'apollo-server';


const todos = [
    { task: 'Wash Car', completed: false },
    { task: 'Clean room', completed: true }
];

const typeDefs = gql`
    type Query {
        task: String
        completed: Boolean
    }
`;

const server = new ApolloServer({
    typeDefs: typeDefs
});

server.listen().then(({url}) => {
    console.log(`Server listening ${url}`)
});