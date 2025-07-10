'use client'

import { useState } from "react";
import { AuthInput } from "@/component/page/auth/auth-input";

export default function Page() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className='flex flex-col gap-2 '>
            <AuthInput
                type="email"
                label="아이디를 입력해주세요"
                value={email}
                onChange={setEmail}
                error=""
                placeholder="이메일을 입력해주세요"
            />
            <AuthInput
                type="password"
                label="비밀번호를 입력해주세요"
                value={password}
                onChange={setPassword}
                error=""
                placeholder="이메일을 입력해주세요"
            />
        </div>
    )
}