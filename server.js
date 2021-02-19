import { ApolloServer, gql } from 'apollo-server'
import  mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User'
import Post from './models/Post'

dotenv.config({ path: 'variables.env' })

mongoose
    .connect(process.env.MONGOD_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log("DB connected"))
    .catch(err => console.err(err))

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



const server = new ApolloServer({
    typeDefs: 
        typeDefs
})

server.listen().then(({url}) => {
    console.log(`Server listening ${url}`)
})