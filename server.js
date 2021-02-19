import { ApolloServer, gql } from 'apollo-server'


const todos = [
    { task: 'Wash Car', completed: false },
    { task: 'Clean room', completed: true }
]

const typeDefs = gql`
    type Todo {
        task: String
        completed: Boolean
    }

    type Query {
        getTodos: [Todo]
    }

    type Mutation {
        addTodo(task: String, completed: Boolean): Todo
    }
`

const resolvers = {
    Query: {
        getTodos: () => todos
    },

    Mutation: {
        addTodo: (_, { task, completed }) => {
            const todo = { task, completed }
            todos.push(todo)
            return todo
        }
    }
}

const server = new ApolloServer({
    typeDefs: 
        typeDefs, 
        resolvers
})

server.listen().then(({url}) => {
    console.log(`Server listening ${url}`)
})