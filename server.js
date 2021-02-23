import { ApolloServer, AuthenticationError } from 'apollo-server'
import  mongoose from 'mongoose'
import dotenv from 'dotenv'

import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

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

// Verify JWT Token password from client
const getUser = async token => {
    if (token) {
        try {
            return await jwt.verify(token, process.env.SECRET)
        } catch (err) {
            throw new AuthenticationError('Your session has ended. Please sign in again.')
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: error => ({
        name: error.name,
        message: error.message.replace('Context creation failed:', '')
    }),
    context: async ({ req }) => {
        const token = req.headers['authorization']
        return { User, Post, currentUser: await getUser(token) }
    }
})

server.listen().then(({url}) => {
    console.log(`Server listening ${url}`)
})