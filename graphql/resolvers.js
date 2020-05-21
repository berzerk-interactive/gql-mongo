const prepare = require("../util/index")
const {ObjectId} = require('mongodb')

function resolversFunc(Posts, Comments) {
  return {
    Query: {
      post: async (root, {_id}) => {
        return prepare(await Posts.findOne(ObjectId(_id)))
      },
      posts: async () => {
        return (await Posts.find({}).toArray()).map(prepare)
      },
      comment: async (root, {_id}) => {
        return prepare(await Comments.findOne(ObjectId(_id)))
      },
    },
    Post: {
      comments: async ({_id}) => {
        return (await Comments.find({postId: _id}).toArray()).map(prepare)
      }
    },
    Comment: {
      post: async ({postId}) => {
        return prepare(await Posts.findOne(ObjectId(postId)))
      }
    },
    Mutation: {
      createPost: async (root, args, context, info) => {
        const res = await Posts.insertOne(args)
        return prepare(res.ops[0])  // https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#~insertOneWriteOpResult
      },
      createComment: async (root, args) => {
        const res = await Comments.insert(args)
        return prepare(await Comments.findOne({_id: res.insertedIds[0]}))
      },
    },
  }
}
module.exports = resolversFunc