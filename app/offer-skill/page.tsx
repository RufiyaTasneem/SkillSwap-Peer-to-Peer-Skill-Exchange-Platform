"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OfferSkill() {
    const router = useRouter();

    useEffect(() => {
        const verified = localStorage.getItem("aiSkillVerified");
        if (!verified) {
            router.replace("/ai-verification");
        }
    }, [router]);

    return <div style={{ padding: 40 }}>Teach Skill Page</div>;
}
