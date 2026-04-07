export interface User {
    id?: string;
    username: string;
    profileimg?: string; // strict lowercase
    token: string;
    expiresAtUtc?: string;
    email?: string;
    role?: string;
    Token?: string;
    ExpiresAtUtc?: string;
    UserName?: string;
    Email?: string;
    Role?: string;
    profileImg?: string;
    ProfileImg?: string;
    avatar?: string;
    image?: string;
    name?: string;
    Name?: string;
    // Optional / loose matching properties
    [key: string]: unknown; // Allow indexing for flexibility
}
