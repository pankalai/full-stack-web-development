const info = (...params) => {
    if (process.env.NODE_ENV !== 'test2') { 
        console.log(...params)
    }
}

const error = (...params) => {
    if (process.env.NODE_ENV !== 'test2') { 
        console.error(...params)
    }
}

module.exports = {
    info, error
}