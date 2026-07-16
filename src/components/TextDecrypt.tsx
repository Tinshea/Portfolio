"use client";

import React, { useEffect, useState } from "react";
import { useDencrypt } from "use-dencrypt-effect";
import { useReducedMotion } from "framer-motion";

const decryptOptions = {
    chars: "ابتثجحخدذرزسشصضطظعغفقكلمنهويあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん가나다라마바사아자차카타파하一二三四五六七八九十百千万",
    interval: 50,
};

interface TextDecryptProps {
    text: string;
}

export const TextDecrypt = (props: TextDecryptProps) => {
    const [result, dencrypt] = useDencrypt(decryptOptions);
    const [mounted, setMounted] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || prefersReducedMotion) return;

        const updateText = () => {
            dencrypt(props.text || "");
        };

        const action = setTimeout(updateText, 0);

        return () => clearTimeout(action);
    }, [mounted, dencrypt, props.text, prefersReducedMotion]);

    // Server render and first client render show the real text so crawlers and
    // link previews index actual content; the decrypt effect only replaces it
    // after hydration.
    if (!mounted || prefersReducedMotion) {
        return <>{props.text}</>;
    }

    return <>{result}</>;
};
