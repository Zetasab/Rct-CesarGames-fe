export interface User {
    id: string;
    username: string;
    profileimg: string; // strict lowercase
    token: string;
    // Optional / loose matching properties
    [key: string]: any; // Allow indexing for flexibility
}
