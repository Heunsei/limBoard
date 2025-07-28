'use client'

import Link from "next/link";
import { useState } from "react";

import { AuthInput } from "@/component/page/auth/auth-input";
import {Separator} from "@/component/public/separator";

import {login} from "@/api/auth";

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [loginError, setLoginError] = useState<boolean>(false);

    async function onClickLoginButton() {
        try {
            const token = await login(email, password);
            console.log(token);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='flex flex-col gap-5 '>
            <AuthInput
                type="email"
                label="이메일"
                value={email}
                onChange={setEmail}
                error=""
                placeholder="이메일을 입력해 주세요"
            />
            <AuthInput
                type="password"
                label="비밀번호"
                value={password}
                onChange={setPassword}
                error=""
                placeholder="비밀번호를 입력해 주세요"
            />
            <div className={"flex justify-end"}>
                <Link href='signup' className={'text-violet-300 text-right'}>비밀번호를 잊으셨나요?</Link>
            </div>
            <button className={"p-3 bg-[#98A2F7] rounded-lg cursor-pointer"}
                onClick={onClickLoginButton}
            >
                <p className={'font-bold text-xl'}>로그인</p>
            </button>
            <Separator className="my-5"/>
            <div className={'flex gap-2 justify-center'}>
                <p>계정이 없으신가요?</p>
                <Link href='signup' className={'text-violet-300 text-right'}>가입하기</Link>
            </div>
        </div>
    )
}