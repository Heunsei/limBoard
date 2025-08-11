import {loginReqParams, registerReqParams} from "@/api/auth/auth.type";

async function login({email, password}: loginReqParams) {
    const hashLoginParams = btoa(`${email}:${password}`)

    const res = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json',
            authorization: `Basic ${hashLoginParams}`
        },
    });

    const data = await res.json();

    // 단순하게 상태와 데이터 함께 반환
    return {
        ok: res.ok,
        status: res.status,
        data
    };
}

async function register({email, password, nickname}: registerReqParams) {
    const hashLoginParams = btoa(`${email}:${password}`)

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
    })

    const data = await res.json();

    return {
        ok: res.ok,
        status: res.status,
        data
    }
}

async function findUserByEmail(email: string) {
    const res = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/user/find?email=${email}`, {
        method: 'GET',
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const data = await res.json();

    return {
        ok: res.ok,
        status: res.status,
        data
    }
}

export {login, register, findUserByEmail};