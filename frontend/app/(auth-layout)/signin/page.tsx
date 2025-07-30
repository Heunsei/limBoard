'use client'

import Link from "next/link";
import {useRef, useState} from "react";

import { AuthInput } from "@/component/page/auth/auth-input";
import {Separator} from "@/component/public/separator";

import {login} from "@/api/auth";
import {DialogBody, DialogHeader, DialogOpenButton, DialogProvider, useDialog} from "@/component/public/dialog";

function SignInButton({email, password} : {email: string, password: string}) {
    const {handleDialogOpen} = useDialog();

    async function handleClickButton() {
        const res = await login(email, password);
        console.log(res);
        // status가 잘못되었을 경우 dialog open
        // error 상태를 업데이트하고 해당 문구를 handleDialogOpen으로 전달
        if(!res.success) {
            handleDialogOpen()
        }

    }

    return (
        <button className={"p-3 bg-[#98A2F7] rounded-lg cursor-pointer"}
                onClick={handleClickButton}
        >
            <p className={'font-bold text-xl'}>로그인</p>
        </button>
    )
}


/**
 * @TODO email 및 password validator 함수 구현 및 input component 에 error 전달 로직 구현
 * 로그인 실패 시 띄울 dialog 구현
 */
export default function Page() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [loginError, setLoginError] = useState<boolean>(false);

    async function onClickLoginButton() {
        const token = await login(email, password);
    }

    return (
        <>
            <DialogProvider>
                <div className='flex flex-col gap-5'>
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
                    <SignInButton
                        email={email}
                        password={password}
                    />
                    <Separator className="my-5"/>
                    <div className={'flex gap-2 justify-center'}>
                        <p>계정이 없으신가요?</p>
                        <Link href='signup' className={'text-violet-300 text-right'}>가입하기</Link>
                    </div>
                    <DialogOpenButton>
                        <p>open</p>
                    </DialogOpenButton>
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