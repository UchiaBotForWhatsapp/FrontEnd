import { Button } from "./ui/button";


interface LoadingButton {
    children: React.ReactNode;
    loading: boolean;
    onClick?: () => void;
    type: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;



}

export function LoadingButton({ children, loading, onClick, type = "button", className = "", disabled = false }: LoadingButton) {
    return (
        <Button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}

            className={`px-4 py-4  text-white rounded-md disabled:opacity-60 flex items-center gap-2 transition-all ${className}`}


        >
            {loading ? (
                <div className="w-5 h-5  border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
                children
            )}


        </ Button>
    )

}