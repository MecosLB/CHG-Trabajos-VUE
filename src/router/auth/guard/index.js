const guard = async (to, from, next) => {
    const token = localStorage.getItem('token');
    if (!token) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        next({ name: 'auth' })
    }

    const user = localStorage.getItem('user');
    if (!user) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        next({ name: 'auth' })
    }

    next()
};

export default guard;