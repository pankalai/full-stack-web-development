import { Card } from '@mui/material'

const User = ({ user }) => {
    if (!user) {
        return null;
    }
    return (
        <Card>
            <h2>{user.name}</h2>
            <h3>added blogs</h3>
            <ul>
                {user.blogs.map(b => {
                    return <li key={b.id}>{b.title}</li>
                })}
            </ul>
        </Card>
    )
}

export default User;