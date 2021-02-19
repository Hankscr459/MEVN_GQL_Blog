import { ApolloServer } from 'apollo-server'
import  mongoose from 'mongoose'
import dotenv from 'dotenv'

import fs from 'fs'
import path from 'path'

import User from './models/User.js'
import Post from './models/Post.js'

import resolvers from './resolvers.js'

dotenv.config({ path: 'variables.env' })
const __dirname = path.resolve()
const filePath = path.join(__dirname, 'typeDefs.gql')
const typeDefs = fs.readFileSync(filePath, 'utf-8')

mongoose
    .connect(process.env.MONGOD_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log("DB connected"))
    .catch(err => console.err(err))


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        User,
        Post
    }
})

server.listen().then(({url}) => {
    console.log(`Server listening ${url}`)
})