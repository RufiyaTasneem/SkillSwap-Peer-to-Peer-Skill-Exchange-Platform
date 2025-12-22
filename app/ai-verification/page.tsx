"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AIVerification() {
    const router = useRouter();
    const [result, setResult] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget as HTMLFormElement);

        let score = 0;
        if (form.get("q1") === "1") score++;
        if (form.get("q2") === "1") score++;

        if (score >= 2) {
            localStorage.setItem("aiSkillVerified", "true");
            setResult("✅ Test Passed! Redirecting...");
            setTimeout(() => router.push("/offer-skill"), 1200);
        } else {
            setResult("❌ Test Failed. Try again.");
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <h2>AI Skill Verification</h2>
            <p>You must pass this test to teach a skill.</p>

            <form onSubmit={handleSubmit}>
                <p>1. What is JavaScript used for?</p>
                <label>
                    <input type="radio" name="q1" value="1" /> Interactivity
                </label>
                <br />
                <label>
                    <input type="radio" name="q1" value="0" /> Styling
                </label>

                <p>2. Which is a frontend framework?</p>
                <label>
                    <input type="radio" name="q2" value="1" /> React
                </label>
                <br />
                <label>
                    <input type="radio" name="q2" value="0" /> MongoDB
                </label>

                <br />
                <br />
                <button type="submit">Submit</button>
            </form>

            <p>{result}</p>
        </div>
    );
}
