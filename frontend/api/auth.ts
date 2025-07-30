/**
 * @TODO 반환 타입 명시
 * @param email
 * @param password
 */
export async function login(email: string, password: string) {
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