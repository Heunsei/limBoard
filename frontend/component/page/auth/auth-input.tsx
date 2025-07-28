'use client'

import { Mail, Eye, Lock, EyeOff, UserRound } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react";

interface AuthInputProp {
    type: 'email' | 'password' | 'text' | 'nickname';
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

    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    function getIcon() {
        switch (type) {
            case 'email':
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
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                            disabled={disabled}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-400 mt-1">{error}</p>
            )}
        </div>
    )
}

export { AuthInput }