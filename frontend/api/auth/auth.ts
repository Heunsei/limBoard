import {loginReqParams, registerReqParams} from "@/type/auth.type";

function setAccessToken(token: string | null) {
    if (typeof window !== 'undefined') {
        if (token) {
            sessionStorage.setItem('accessToken', token);
        } else {
            sessionStorage.removeItem('accessToken');
        }
    }
    return token;
}

async function login({email, password}: loginReqParams) {
    const hashLoginParams = btoa(`${email}:${password}`);

    try {
        const res = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            cache: "no-cache",
            headers: {
                'Content-Type': 'application/json',
                authorization: `Basic ${hashLoginParams}`,
            },
            credentials: 'include',
        });

        const data = await res.json();

        return {
            ok: res.ok,
            status: res.status,
            data,
        };
    } catch (error) {
        if (error instanceof Error) {
            return { ok: false, error: error.message };
        }
        return { ok: false, error: '로그인 중 오류가 발생했습니다' };
    }

}

async function register({email, password, nickname}: registerReqParams) {
    const hashLoginParams = btoa(`${email}:${password}`);

    try {
        const res = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
            method: 'POST',
            cache: "no-cache",
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Basic ${hashLoginParams}`
            },
            body: JSON.stringify({
                nickname,
            })
        });

        const data = await res.json();

        return {
            ok: res.ok,
            status: res.status,
            data,
        }
    } catch (error) {
        if (error instanceof Error) {
            return { ok: false, error: error.message };
        }
        return {
            ok: false,
            error: '회원가입에 실패했습니다',
        }
    }

}

async function findUserByEmail(email: string) {
    const res = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/user/find?email=${email}`, {
        method: 'GET',
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await res.json();

    return {
        ok: res.ok,
        status: res.status,
        data,
    }
}

export {login, register, findUserByEmail};