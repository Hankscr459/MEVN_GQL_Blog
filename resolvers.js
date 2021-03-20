import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const createToken = (user, secret, expiresIn) => {
    const { username, email } = user
    return jwt.sign({ username, email }, secret, { expiresIn })
}

export default {
    Query: {
        getCurrentUser: async (_, args, { User, currentUser }) => {
            if (!currentUser) {
                return null
            }
            const user = await User.findOne({ username: currentUser.username }).populate({
                path: 'favorites',
                model: 'Post'
            })
            return user
        },
        getPost: async (_, { postId }, { Post }) => {
            const post = await Post.findOne({ _id: postId }).populate({
                path: 'messages.messageUser',
                model: "User"
            })
            return post
        },
        getPosts: async (_, args, { Post }) => {
            const posts = await Post.find({})
            .sort({ createdDate: 'desc' })
            .populate({
                path: 'createdBy',
                model: 'User'
            })
            return posts
        },
        infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
            let posts
            if (pageNum === 1) {
                posts = await Post.find({}).sort({ createdDate: 'desc' }).populate({
                    path: 'createdBy',
                    model: 'User'
                }).limit(pageSize)
            } else {
                // if page number greater than one, figure out how many document to skip
                const skips = pageSize * (pageNum - 1)
                posts = await Post.find({}).sort({ createdDate: 'desc' }).populate({
                    path: 'createdBy',
                    model: 'User'
                }).skip(skips).limit(pageSize)
            }
            const totalDocs = await Post.countDocuments()
            const hasMore = totalDocs > pageSize * pageNum
            return { posts, hasMore }
        }
    },
    Mutation: {
        addPost: async(_, { title, imageUrl, categories, description, creatorId }, { Post }) => {
            const newPost = await new Post({
                title,
                imageUrl,
                categories,
                description,
                createdBy: creatorId
            }).save()
            return newPost
        },

        addPostMessage: async (_, { messageBody, userId, postId }, { Post }) => {
            const newMessage = {
                messageBody,
                messageUser: userId
            }
            const post = await Post.findOneAndUpdate(
                // find post by id
                { _id: postId },
                // prepend (push) new message to beginning of messages array
                { $push: { messages: { $each: [newMessage], $position: 0 } } },
                // return fresh document after update
                { new: true }
            ).populate({
                path: 'messages.messageUser',
                model: 'User'
            })

            return post.messages[0]
        },

        signinUser: async (_, { username, password }, { User }) => {
            const user = await User.findOne({ username })
            if (!user) {
                throw Error('User not found!')
            }
            const isValidPassword = await bcrypt.compare(password, user.password)
            if (!isValidPassword) {
                throw new Error('Invalid password')
            }
            return { token: createToken(user, process.env.SECRET, '1hr') }
        },

        signupUser: async (_, { username, email, password }, {User}) => {
            const user = await User.findOne({ username })
            if (user) {
                throw Error('User already exists')
            }
            const newUser = await new User({
                username,
                email,
                password
            }).save()
            return { token: createToken(newUser, process.env.SECRET, '1hr') }
        }
    }
}