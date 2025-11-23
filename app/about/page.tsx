"use client"

import { useState } from 'react';

export default function AboutPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: 'What is Trackar?',
            answer:
                'Trackar is a modern fleet management platform that helps you monitor vehicles, drivers, trips, and maintenance in real‑time, all from a sleek web interface.',
        },
        {
            question: 'Why choose Trackar?',
            answer:
                'We combine powerful analytics, automated scheduling, and a beautiful UI to boost efficiency, reduce costs, and keep your fleet safe.',
        },
        {
            question: 'How secure is my data?',
            answer:
                'All data is stored in MongoDB Atlas with end‑to‑end encryption. Secrets are never committed to the repo and are managed via Vercel environment variables.',
        },
        {
            question: 'Can I try it for free?',
            answer:
                'Absolutely! Sign up for a free trial and explore all features without any credit card required.',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-8">
            {/* Hero Section */}
            <section className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    About Trackar
                </h1>
                <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
                    Empowering businesses with an intuitive, data‑driven fleet management solution.
                </p>
            </section>

            {/* Mission */}
            <section className="max-w-4xl mx-auto mb-16">
                <h2 className="text-3xl font-semibold mb-4 text-center">Our Mission</h2>
                <p className="text-center text-gray-600 dark:text-gray-400">
                    To simplify fleet operations through real‑time visibility, smart analytics, and seamless user experience, enabling our customers to focus on growth rather than logistics.
                </p>
            </section>

            {/* FAQ Accordion */}
            <section className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border rounded-lg overflow-hidden">
                            <button
                                className="w-full text-left px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            >
                                <span className="font-medium">{faq.question}</span>
                                <svg
                                    className={`w-5 h-5 transition-transform ${openIndex === idx ? 'transform rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openIndex === idx && (
                                <div className="px-4 py-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
