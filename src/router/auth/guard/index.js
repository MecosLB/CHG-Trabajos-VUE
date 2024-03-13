export const guardDashboard = async (to, from, next) => {
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

export const guardAuth = async (to, from, next) => {
    const company = localStorage.getItem('company');
    if (!company) {
        localStorage.removeItem('company');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        next({ name: 'not-found' })
    }

    next()
};