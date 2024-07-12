import { createTheme } from '@mui/material'
import { createContext, useReducer, useContext } from 'react'


const lightTheme = createTheme({
    name: 'Light Theme',
    palette: {
      mode: 'light',
      background: {
        paper: '#F2F2BB',
      },
      primary: {
        main: '#F2F2BB',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            color: 'white',
            backgroundColor: '#D3C224',
            '&:hover': {
              backgroundColor: '#DBCD59',
            },
            marginRight: 10, 
          },
          sizeMedium: {
            padding: '2px 5px',
          },
        },
      },
    }
  })

const darkTheme = createTheme({
    name: 'Dark Theme',
    palette: {
      mode: 'dark',
      background: {
        paper: '#65654D',
      },
    },
    typography: {
      color: 'primary',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            color: 'white',
            backgroundColor: '#575646',
            '&:hover': {
              backgroundColor: '#3C3B30',
            },
            marginRight: 10,
          },
          sizeMedium: {
            padding: '2px 5px',
          },
        },
      },
    }
  });

const themeReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_THEME':
            return state === lightTheme ? darkTheme : lightTheme
        default:
            return state
    }
}

const ThemeContext = createContext()

export const ThemeContextProvider = ({ children }) => {
    const [theme, themeDispatch] = useReducer(themeReducer, lightTheme)

    return (
        <ThemeContext.Provider value={[theme, themeDispatch]}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useSelectedTheme = () => {
  const themeAndDispatch = useContext(ThemeContext)
  return themeAndDispatch[0]
}

export default ThemeContext;