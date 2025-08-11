'use client'

import { Mail, Eye, Lock, EyeOff, UserRound } from "lucide-react"
import {Dispatch, RefObject, SetStateAction, useRef, useState} from "react";
import {findUserByEmail} from "@/api/auth/auth";
import {useDialog} from "@/component/public/dialog";

interface AuthInputProp {
    type: 'email' | 'password' | 'text' | 'nickname' | 'registerEmail';
    placeholder?: string;
    value: string;
    label?: string;
    onChange: Dispatch<SetStateAction<string>>;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    error?: string;
}


function AuthInput(
    {
        type,
        placeholder,
        value,
        label,
        onChange,
        required = false,
        disabled = false,
        error,
    }: AuthInputProp) {

    // 이메일 / 닉네임 확인 후 input을 disable 으로 만들기 위한 ref 설정
    const inputRef = useRef<HTMLInputElement>(null);
    const {handleDialogOpen} = useDialog()

    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);



    /**
     *
     * @param nickname 중복을 확인할 닉네임
     * @param ref 닉네임 확인 후 input 태그를 비활성하기 위한 ref
     */
    async function checkNickname(nickname: string, ref: RefObject<HTMLInputElement | null>) {

    }

    function getIcon() {
        switch (type) {
            case 'email':
            case 'registerEmail':
                return <Mail className="w-5 h-5 text-gray-400" />;
            case 'password':
                return <Lock className="w-5 h-5 text-gray-400" />;
            case 'nickname':
                return <UserRound className="w-5 h-5 text-gray-400" />;
            default:
                return null;
        }
    }

    function getBorderStyle() {
        if (disabled) {
            return 'border-gray-700 bg-gray-800';
        }
        if (error) {
            return 'border-red-500 ring-2 ring-red-500/20';
        }
        if (isFocused) {
            return 'border-blue-400 ring-2 ring-blue-400/20';
        }
        return 'border-gray-600 hover:border-gray-500';
    }

    function getInputType() {
        if (type === 'password') {
            return showPassword ? 'text' : 'password';
        }
        return type;
    }

    function EmailChecker({value, ref} :{value: string, ref: RefObject<HTMLInputElement | null>} ) {
        const [isChecked, setIsChecked] = useState<boolean>(false);

        /**
         * @param email 중복을 확인할 이메일
         * @param ref 이메일 확인 후 input 태그를 비활성화 할 ref 객체
         */
        async function checkEmail(email:string) {
            const isEmailExist = await findUserByEmail(email);
            handleDialogOpen()
        }

        return (
            <div
                onClick={async () => await checkEmail(value)}
                className="absolute right-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
            >
                이메일 확인
            </div>
        )
    }


    return (
        <div className={`space-y-2`}>
            {
                label &&
                (<label className="block text-sm font-medium text-gray-200">
                    {label}
                </label>)
            }
            <div className="relative">
                <div
                    className={`
                        relative flex items-center
                        border rounded-lg
                      bg-gray-800
                        transition-all duration-200
                        ${getBorderStyle()}
                    `}
                >
                    <div className="absolute left-3 flex items-center pointer-events-none">
                        {getIcon()}
                    </div>
                    <input
                        ref={inputRef}
                        type={getInputType()}
                        className={`
                            w-full pl-12 pr-12 py-3
                          text-gray-100
                            focus:outline-none
                          placeholder:text-white
                          disabled:text-gray-500 disabled:cursor-not-allowed
                        `}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        required={required}
                        disabled={disabled}
                        value={value}
                    />
                    {type === 'password' && (
                        <div
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </div>
                    )}
                    {
                        type === 'registerEmail' && (
                           <EmailChecker value={value} ref={inputRef} />
                        )
                    }
                    {
                        type === 'nickname' && (
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </div>
                        )
                    }
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-400 mt-1">{error}</p>
            )}
        </div>
    )
}

export { AuthInput }