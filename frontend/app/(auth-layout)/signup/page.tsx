'use client'

import {AuthInput} from "@/component/page/auth/auth-input";
import {useState} from "react";
import Link from "next/link";

export default function Page() {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    return (
        <div className='flex flex-col gap-3'>
            <AuthInput type={"email"} value={email} onChange={setEmail}
                placeholder={"이메일을 입력해 주세요"} label={"이메일"}
            />
            <AuthInput type={"nickname"} value={nickname} onChange={setNickname}
                placeholder={"사용할 닉네임을 입력해주세요"} label={"닉네임"}
            />
            <AuthInput type={"password"} value={password} onChange={setPassword}
                placeholder={"비밀번호를 입력해 주세요"} label={"비밀번호"}
            />
            <AuthInput type={"password"} value={passwordConfirm} onChange={setPasswordConfirm }
                placeholder={"비밀번호를 다시 입력해 주세요"} label={"비밀번호 확인"}
            />
            <button className={"p-3 mt-5 bg-[#98A2F7] rounded-lg cursor-pointer"}>
                <p className={'font-bold text-xl'}>회원가입</p>
            </button>
            <div className={'flex mt-5 gap-2 justify-center'}>
                <p>이미 계정이 있나요?</p>
                <Link href='signin' className={'text-violet-300 text-right'}>로그인하기</Link>
            </div>
        </div>
    )
}