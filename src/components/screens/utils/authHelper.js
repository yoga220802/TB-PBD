export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    console.log("Token:", token); // Tambahkan untuk debugging
    return !!token;
};
