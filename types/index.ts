export type Role = 'ADMIN' | 'OWNER' | 'DRIVER' | 'CLIENT';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}
