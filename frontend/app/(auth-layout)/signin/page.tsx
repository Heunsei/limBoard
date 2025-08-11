'use client'

import Link from "next/link";
import {useEffect, useState} from "react";

import { AuthInput } from "@/component/page/auth/auth-input";
import {Separator} from "@/component/public/separator";

import {login} from "@/api/auth/auth";
import {DialogBody, DialogHeader, DialogProvider, useDialog} from "@/component/public/dialog";

function SignInButton({email, password, id, disabled} : {email: string, password: string, id: string, disabled?: boolean}) {
    const {handleDialogOpen} = useDialog();

    async function handleClickButton() {
        const res = await login({email, password});

        if(!res.ok) {
            handleDialogOpen()
        }
    }

    return (
        <button id={id} className={"p-3 bg-[#98A2F7] rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-700"}
                onClick={handleClickButton}
                disabled={disabled}
        >
            <p className={'font-bold text-xl'}>로그인</p>
        </button>
    )
}

function validateEmail(email: string): string | null {
    if (!email) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : "올바른 이메일 형식이 아닙니다";
}

function validatePassword(password: string): string | null {
    if (!password) return null;
    return password.length >= 8 ? null : "비밀번호는 8자 이상이어야 합니다";
}

export default function Page() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    useEffect(() => {
        setEmailError(validateEmail(email));
    }, [email]);

    useEffect(() => {
        setPasswordError(validatePassword(password));
    }, [password]);

    // 로그인 버튼 활성화 조건
    const isFormValid = email && password && !emailError && !passwordError;

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && isFormValid) {
                document.getElementById('SignInButton')?.click();
            }
        };

        window.addEventListener('keyup', handleKeyPress);

        return () => {
            window.removeEventListener('keyup', handleKeyPress);
        }
    }, [isFormValid]);

    return (
        <>
            <DialogProvider>
                <div className='flex flex-col gap-5'>
                    <AuthInput
                        type="email"
                        label="이메일"
                        value={email}
                        onChange={setEmail}
                        error={emailError || ""}
                        placeholder="이메일을 입력해 주세요"
                    />
                    <AuthInput
                        type="password"
                        label="비밀번호"
                        value={password}
                        onChange={setPassword}
                        error={passwordError || ""}
                        placeholder="비밀번호를 입력해 주세요"
                    />
                    <div className={"flex justify-end"}>
                        <Link href='signup' className={'text-violet-300 text-right'}>비밀번호를 잊으셨나요?</Link>
                    </div>
                    <SignInButton
                        id={'SignInButton'}
                        email={email}
                        password={password}
                        disabled={!isFormValid}
                    />
                    <Separator className="my-5"/>
                    <div className={'flex gap-2 justify-center'}>
                        <p>계정이 없으신가요?</p>
                        <Link href='signup' className={'text-violet-300 text-right'}>가입하기</Link>
                    </div>
                </div>
                <DialogBody>
                    <DialogHeader>
                        <p>잘못된 로그인 정보입니다</p>
                    </DialogHeader>
                </DialogBody>
            </DialogProvider>
        </>
    )
}