export type User = {
    id: number;
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    created_at: string;
    avatar: string;
};

export type Readme = {
    id: number;
    readme_id: string;
    user_id: string;
    name: string;
    content: string;
    created_at: string;
    update_at: string;
};
