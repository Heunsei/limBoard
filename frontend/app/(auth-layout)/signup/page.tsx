'use client'

import {AuthInput} from "@/component/page/auth/auth-input";
import {useEffect, useState} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {register} from "@/api/auth/auth";
import { useAuth } from "@/context/auth.context";
import {DialogBody, DialogHeader, DialogProvider, useDialog} from "@/component/public/dialog";

type registerButtonProps = {
    id: string,
    email: string,
    password: string,
    nickname: string,
    disabled?: boolean
}

function RegisterButton({id, email, password, nickname, disabled}: registerButtonProps) {
    const {handleDialogOpen} = useDialog();
    const { login, isLoading } = useAuth();
    const router = useRouter();

    async function handleClickButton() {
        try {
            const res = await register({email, password, nickname});

            if (res.ok) {
                const success = await login(email, password);
                if (success) {
                    router.push('/dashboard');
                } else {
                    handleDialogOpen();
                }
            } else {
                handleDialogOpen();
            }
        } catch (error) {
            console.error('Registration error:', error);
            handleDialogOpen();
        }
    }

    return (
        <button id={id} className={"p-3 bg-[#98A2F7] rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-700"}
                onClick={handleClickButton}
                disabled={disabled || isLoading}
        >
            <p className={'font-bold text-xl'}>
                {isLoading ? '회원가입 중...' : '회원가입'}
            </p>
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

function validatePasswordConfirm(password: string, passwordConfirm: string): string | null {
    if(password && validatePassword(password)){
        return '비밀번호는 8자 이상이어야 합니다'
    }

    if(password !== passwordConfirm){
        return '비밀번호가 일치하지 않습니다'
    }

    return null
}

function validateNicknameConfirm(nickname:string) {
    if (!nickname) return null;
    return nickname.length >= 2 ? null : '닉네임은 2글자 이상으로 입력해주세요'
}

export default function Page() {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null);
    const [nicknameError, setNicknameError] = useState<string | null>(null);

    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const isFormValid = email && password && passwordConfirm && nickname && !emailError && !passwordError && !passwordConfirmError && !nicknameError;

    useEffect(() => {
        setEmailError(validateEmail(email));
    },[email]);

    useEffect(() => {
        setPasswordError(validatePassword(password));
    }, [password]);

    useEffect(() => {
        setPasswordConfirmError(validatePasswordConfirm(password, passwordConfirm));
    }, [password, passwordConfirm])

    useEffect(() => {
        setNicknameError(validateNicknameConfirm(nickname))
    }, [nickname]);

    return (
        <DialogProvider>
            <div className='flex flex-col gap-3'>
                <AuthInput type={"registerEmail"} value={email} onChange={setEmail}
                    placeholder={"이메일을 입력해 주세요"} label={"이메일"} error={emailError || ""}
                />
                <AuthInput type={"nickname"} value={nickname} onChange={setNickname}
                    placeholder={"사용할 닉네임을 입력해주세요"} label={"닉네임"} error={nicknameError || ""}
                />
                <AuthInput type={"password"} value={password} onChange={setPassword}
                    placeholder={"비밀번호를 입력해 주세요"} label={"비밀번호"} error={passwordError || ""}
                />
                <AuthInput type={"password"} value={passwordConfirm} onChange={setPasswordConfirm }
                    placeholder={"비밀번호를 다시 입력해 주세요"} label={"비밀번호 확인"} error={passwordConfirmError || ""}
                />
                <RegisterButton
                    id={'RegisterButton'}
                    email={email}
                    password={password}
                    nickname={nickname}
                    disabled={!isFormValid}
                />
                <div className={'flex mt-5 gap-2 justify-center'}>
                    <p>이미 계정이 있나요?</p>
                    <Link href='signin' className={'text-violet-300 text-right'}>로그인하기</Link>
                </div>
            </div>
            <DialogBody>
                <DialogHeader>
                    <p>회원가입에 실패했습니다</p>
                </DialogHeader>
            </DialogBody>
        </DialogProvider>
    )
}