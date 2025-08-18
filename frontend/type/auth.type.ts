interface loginReqParams {
    email: string;
    password: string;
}

interface registerReqParams {
    email: string;
    password: string;
    nickname: string;
}

export type {
    loginReqParams,
    registerReqParams,
}