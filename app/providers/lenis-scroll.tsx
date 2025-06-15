'use client'
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname, useSearchParams, } from "next/navigation";

import { useEffect } from "react";

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const lenis = useLenis();

    useEffect(() => {
        lenis?.scrollTo(0, { immediate: true });
    }, [pathname, searchParams, lenis]);

    return (
        <ReactLenis root options={{ lerp: 0.05 }}>
            {children}
        </ReactLenis>
    );
};

export default SmoothScroll;