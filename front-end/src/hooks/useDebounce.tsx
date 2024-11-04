import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Make sure dependencies array includes all values used

    return debouncedValue;
}

export default useDebounce;
