
export const getBaseUrl = () => {
    // Check if we are in a browser environment or server environment if needed
    // process.env.NODE_ENV is available in Next.js
    
    if (process.env.NODE_ENV === 'production') {
        return 'https://zetaapi-templates.up.railway.app';
    }
    
    // Default to localhost for development
    if (typeof window !== 'undefined') {
        return `http://${window.location.hostname}:8080`;
    }
    return 'http://localhost:8080';
};
