import { Link } from 'react-router-dom'
import { 
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material'

import { useSelectedTheme } from '../contexts/ThemeContext'

const Users = ( { users }) => {
    const theme = useSelectedTheme()

    return (
        <div>
            <h2>Users</h2>
            <TableContainer component={Paper}>
            <Table>
                <TableHead> 
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>blogs created</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {users.map(user => {
                    if(user.blogs.length > 0){
                        return (
                            <TableRow key={user.id}>
                                <TableCell><Link to={`/users/${user.id}`}>{user.name}</Link></TableCell>
                                <TableCell>{user.blogs.length}</TableCell>
                            </TableRow>
                        )
                }
                })}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
    )
}

export default Users;