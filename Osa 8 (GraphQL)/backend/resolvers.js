const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')

const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user');

const resolvers = {
    Query: {
      bookCount: async () => Book.collection.countDocuments(),
      authorCount: async () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        
        const query = {};
      
        if (args.genre) {
            query.genres = args.genre;
        }
        
        if (args.author) {
            const author = await Author.findOne({ name: args.author });
            if (author) {
                query.author = author._id;
            } else {
                return [];
            }
        }
        
        return Book.find(query).populate('author');
      },
      allAuthors: async () => await Author.find({ }),
      me: async (root, args, { currentUser }) => currentUser
    },
    Mutation: {
      addAuthor: async (root, args) => {
        const author = new Author({ name: args.name, born: args.born })
  
        try {
          await author.save()
        }
        catch (error) {
          throw new GraphQLError('', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
        
        pubsub.publish('AUTHOR_ADDED', { authorAdded: author })

        return author
      },
      addBook: async (root, args, { currentUser, loaders }) => {
  
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
  
        let author = await Author.findOne({ name: args.author })
        let newAuthorAdded = false

        if (!author) {
          const newAuthor = new Author({ name: args.author })

          try {
            await newAuthor.save()
          } catch (error) {
            throw new GraphQLError('', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.author,
                error
              }
            })
          } finally {
            author = newAuthor
            newAuthorAdded = true
          }

        }
        else {
          loaders.booksOfAuthors.clear(author._id)
        }

        const book = new Book({ title: args.title, published: args.published, author: author, genres:args.genres })
  
        try {
          await book.save()
        }
        catch (error) {
          throw new GraphQLError('', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }

   
        if (newAuthorAdded) {
          pubsub.publish('AUTHOR_ADDED', { authorAdded: author })
        }
        pubsub.publish('BOOK_ADDED', { bookAdded: book })

        return book
      },
      editAuthor: async (root, args, { currentUser }) => {
  
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
  
        const author = await Author.findOne({ name: args.name })
        if (!author) { return null}
  
        author.born = args.setBornTo
  
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
        return author
      },
      createUser: async (root, args) => {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
    
        return user.save()
          .catch(error => {
            throw new GraphQLError('Creating the user failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.username,
                error
              }
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
    
        if ( !user || args.password !== 'secret' ) {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })        
        }
    
        const userForToken = {
          username: user.username,
          id: user._id,
        }
    
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      }
    },
    Author: {
      bookCount: async (root, arg, { loaders }) => {
        console.log('calling bookCount', root._id)
        return await loaders.booksOfAuthors.load(root._id)
      }
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
      },
      authorAdded: {
        subscribe: () => pubsub.asyncIterableIterator('AUTHOR_ADDED')
      }
    }
}

module.exports = resolvers;