
type Size = "sm" | "md" | "lg";

interface SpinnerProps {
    size?: Size;
    className?: string; // extra wrapper classes
}

/**
 * Tailwind spinner component
 *
 * Usage:
 * <Spinner />                   // default medium spinner
 * <Spinner size="sm" />
 * <Spinner size="lg" message="Loading..." />
 */
export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
    const sizeMap: Record<Size, string> = {
        sm: "w-4 h-4 border-2",
        md: "w-6 h-6 border-4",
        lg: "w-10 h-10 border-4",
    };

    return (
        <div
            role="status"
            aria-live="polite"
            className={`inline-flex items-center gap-2 ${className}`}
        >
            {/* border-based spinner (uses current color + pink top) */}
            <div
                className={`${sizeMap[size]} rounded-full animate-spin border-gray-200 border-t-black`}
                aria-hidden="true"
            />
        </div>
    );
}
