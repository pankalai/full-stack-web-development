import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { likeBlog, commentBlog } from '../reducers/blogReducer'

import { Card, Button, List, ListItem, Link, TextField } from '@mui/material'

const BlogInfo = ({ blog }) => {
    const dispatch = useDispatch()

    const handleComment = (event) => {
        event.preventDefault();
        if (!event.target[0].value) {
            return;
        }
        dispatch(commentBlog(blog, event.target[0].value));
        event.target[0].value = '';
    }

    const handleLike = () => {
        dispatch(likeBlog(blog));
    }

    if (!blog) {
        return null;
    }
    return (
        <Card>
            <div>
                <h2>{blog.title}</h2>
                <div><a href={blog.url}>{blog.url}</a></div>
                {blog.likes} likes <Button onClick={handleLike}>like</Button>
                <div>added by {blog.author}</div>
            </div>
            {blog.comments &&
                <div>
                    <h3>comments</h3>
                    <form onSubmit={handleComment}>
                        <TextField />
                        <Button type='submit'>add comment</Button>
                    </form>
                    <List>
                        {blog.comments.map((comment, index) => 
                            <ListItem key={index}>
                                {comment}
                            </ListItem>
                        )}
                    </List>
                </div>
            }
        </Card>
    )

}

export default BlogInfo;