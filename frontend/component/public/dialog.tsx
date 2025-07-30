import React, {useCallback, useMemo, useRef} from "react";

type dialogContextType = {
    dialogRef: React.RefObject<HTMLDialogElement | null>;
    handleDialogOpen: () => void;
    handleDialogClose: () => void;
}

const dialogContext = React.createContext<dialogContextType | null>(null);

function useDialog() {
    const context = React.useContext(dialogContext);
    if (!context) {
        throw new Error("useDialog must be used within a DialogProvider.")
    }

    return context;
}

// Dialog를 컨트롤 할 props 및 함수 정의
function DialogProvider({
    defaultOpen = false,
    children
    } : React.ComponentProps<"dialog"> & {
        defaultOpen?: boolean;
    }) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const handleDialogOpen = useCallback(() => {
        if(!dialogRef) {
            throw new Error("useDialog is null.")
        }

        dialogRef.current?.showModal();
    }, [])

    const handleDialogClose = useCallback(() => {
        if(!dialogRef) {
            throw new Error("useDialog is null.")
        }

        dialogRef.current?.close();
    }, [])

    const contextValue = useMemo<dialogContextType>(
        () => ({
            dialogRef,
            handleDialogOpen,
            handleDialogClose,
        }),
        [handleDialogOpen, handleDialogClose]
    )

    return (
        <dialogContext.Provider value={contextValue}>
            {children}
        </dialogContext.Provider>
    )
}

/**
 * @TODO : dialog styling 및 props 전달 내용 구성
 * auth page의 간단한 알림을 위한 dialog 임을 감안.
 */
function DialogBody({children}: React.ComponentProps<"div">) {
    const {dialogRef, handleDialogClose} = useDialog();

    return (
        <dialog
            ref={dialogRef}
            open={false}
            className={'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5 justify-center rounded-lg border-none bg-[#101914] text-white'}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    handleDialogClose();
                }
            }}
        >
            {children}
        </dialog>
    )
}

function DialogHeader({children}: React.ComponentProps<"p">) {
    return (
        <header>
            {children}
        </header>
    )
}

function DialogOpenButton({children}: React.ComponentProps<"div">) {
    const {handleDialogOpen} = useDialog();
    return (
        <button
            className={''}
            onClick={handleDialogOpen}
        >
            {children}
        </button>
    )
}

export { useDialog, DialogBody, DialogHeader ,DialogProvider, DialogOpenButton };