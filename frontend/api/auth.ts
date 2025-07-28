export async function login(email: string, password:string) {
    const hashLoginParams = btoa(`${email}:${password}`)
    try {
        const res = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            cache: "no-cache",
            headers: {
                'Content-Type': 'application/json',
                authorization: `Basic ${hashLoginParams}`
            },
        });

        const data = await res.json(); // Promise를 실제 데이터로 변환
        console.log('받아온 데이터:', data);

        return data; // 실제 데이터 반환

    } catch (err) {
        console.log('에러:', err);
    }
}