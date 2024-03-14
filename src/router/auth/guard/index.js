export const guardDashboard = (to, from, next) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if ((!token) && (!user)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        next({ name: 'auth' })
    } else {
        next()
    }
};

export const guardAuth = (to, from, next) => {
    const company = localStorage.getItem('company');
    if (!company) {
        localStorage.removeItem('company');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        next({ name: 'not-found' })
    } else {
        next()
    }
};