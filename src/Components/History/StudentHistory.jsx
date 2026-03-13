import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { useParams } from "react-router-dom";

const PAGE_SIZE = 10;

function WrongAnswersBlock({ sections }) {
    const [openSections, setOpenSections] = useState({});
    const [visibleCounts, setVisibleCounts] = useState({});

    const toggle = (idx) =>
        setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }));

    const getVisible = (idx) => visibleCounts[idx] || PAGE_SIZE;

    const loadMore = (idx, total) =>
        setVisibleCounts(prev => ({
            ...prev,
            [idx]: Math.min((prev[idx] || PAGE_SIZE) + PAGE_SIZE, total)
        }));

    const grouped = {};
    sections.forEach((sec, secIdx) => {
        const wrongs = (sec.questions || []).filter(q => !q.isCorrect);
        if (wrongs.length === 0) return;
        const key = sec.sectionIndex || secIdx + 1;
        grouped[key] = {
            sectionIndex: key,
            testName: sec.testName,
            courseName: sec.courseName,
            questions: wrongs,
        };
    });
    const groupedList = Object.values(grouped);
    const totalWrong = groupedList.reduce((s, g) => s + g.questions.length, 0);

    if (groupedList.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                    <h3 className="text-base font-bold text-gray-800">Diqqat qilish kerak bo'lgan joylar</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Bo'lim bo'yicha ko'rish uchun bosing</p>
                </div>
                <span className="text-xs font-semibold bg-red-50 text-red-500 px-3 py-1 rounded-full">
                    {totalWrong} ta xato
                </span>
            </div>
            <div className="divide-y divide-gray-100">
                {groupedList.map((sec, idx) => {
                    const isOpen = !!openSections[idx];
                    const visible = getVisible(idx);
                    const shownQuestions = sec.questions.slice(0, visible);
                    const hasMore = visible < sec.questions.length;

                    return (
                        <div key={idx}>
                            <button
                                onClick={() => toggle(idx)}
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-red-50/30 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-lg bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">
                                            Bo'lim #{sec.sectionIndex}
                                        </p>
                                        {sec.testName && (
                                            <p className="text-xs text-gray-400 mt-0.5">{sec.testName}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="text-xs font-medium bg-red-50 text-red-400 px-2.5 py-1 rounded-full">
                                        {sec.questions.length} xato
                                    </span>
                                    <svg
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            {isOpen && (
                                <div className="border-t border-gray-100 bg-gray-50/40">
                                    <div className="divide-y divide-gray-100">
                                        {shownQuestions.map((q, qIdx) => (
                                            <div key={qIdx} className="px-6 py-4 hover:bg-white transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-white border border-red-100 text-red-400 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                                        {qIdx + 1}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-gray-800 font-medium mb-3 leading-relaxed">
                                                            {q.question}
                                                        </p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            <div className="flex items-start gap-2 bg-green-50 rounded-xl px-3 py-2">
                                                                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                <div>
                                                                    <p className="text-xs text-green-600 font-semibold mb-0.5">To'g'ri javob</p>
                                                                    <p className="text-sm text-green-700 font-medium">
                                                                        {q.correctAnswer || <span className="italic text-green-400">ko'rsatilmagan</span>}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-2 bg-red-50 rounded-xl px-3 py-2">
                                                                <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                <div>
                                                                    <p className="text-xs text-red-500 font-semibold mb-0.5">Talaba javobi</p>
                                                                    <p className="text-sm text-red-500 font-medium">
                                                                        {q.userAnswer || <span className="italic text-red-300">Javob berilmagan</span>}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {hasMore && (
                                        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-white/60">
                                            <span className="text-xs text-gray-400">
                                                Ko'rsatilmoqda: <span className="font-semibold text-gray-600">{shownQuestions.length}</span> / {sec.questions.length}
                                            </span>
                                            <button
                                                onClick={() => loadMore(idx, sec.questions.length)}
                                                className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                                Yana {Math.min(PAGE_SIZE, sec.questions.length - visible)} ta ko'rsatish
                                            </button>
                                        </div>
                                    )}
                                    {!hasMore && sec.questions.length > PAGE_SIZE && (
                                        <div className="px-6 py-3 border-t border-gray-100 text-center bg-white/60">
                                            <span className="text-xs text-gray-400">
                                                Barcha {sec.questions.length} ta xato ko'rsatildi
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function StudentHistory() {
    // Route: /admin/history/:id  (AdminStudent da NavLink to={`/admin/history/${course?.id}`})
    const { id, studentId } = useParams();
    const resolvedId = id || studentId; // har ikki nom uchun ishlaydi

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchHistory = async (sid) => {
        if (!sid) return;
        setLoading(true);
        setError(null);
        setData(null);
        try {
            const response = await axios.get(`/result/education-history?studentId=${sid}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const obj = response?.data?.object || null;
            if (!obj) {
                setError("Ma'lumot topilmadi");
                setLoading(false);
                return;
            }
            setData(obj);
        } catch (err) {
            if (err?.response?.status === 401) {
                setError("Sessiya muddati tugagan. Qayta login qiling.");
            } else {
                setError(`Xatolik: ${err?.response?.data?.message || "Server bilan bog'lanishda muammo"}`);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (resolvedId) {
            fetchHistory(resolvedId);
        }
    }, [resolvedId]);

    const sections = data?.sections || [];
    const totalQuestions = sections.reduce((s, sec) =>
        s + (sec.overallResult?.totalCount || sec.questions?.length || 0), 0);
    const totalCorrect = sections.reduce((s, sec) =>
        s + (sec.overallResult?.correctCount || 0), 0);
    const totalWrong = sections.reduce((s, sec) =>
        s + (sec.overallResult?.wrongCount || 0), 0);
    const accuracy = totalQuestions > 0
        ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;

    const formatDate = (iso) => {
        if (!iso) return "—";
        const d = new Date(iso);
        return d.toLocaleDateString("uz-UZ", { year: "numeric", month: "2-digit", day: "2-digit" })
            + " " + d.toTimeString().slice(0, 5);
    };

    const accuracyColor = accuracy >= 80 ? "#16a34a" : accuracy >= 50 ? "#d97706" : "#dc2626";
    const accuracyGradient = accuracy >= 80
        ? "linear-gradient(90deg,#22c55e,#16a34a)"
        : accuracy >= 50
        ? "linear-gradient(90deg,#fbbf24,#d97706)"
        : "linear-gradient(90deg,#f87171,#dc2626)";

    const firstSection = sections[0];
    const hasAnyWrong = sections.some(sec => (sec.questions || []).some(q => !q.isCorrect));

    return (
        // ✅ AdminStudent bilan bir xil tashqi konteyner: h-screen overflow-y-auto bg-gradient p-6 md:p-10
        <div className="w-full h-screen overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10">
            <div className="bg-white p-6 rounded-xl shadow-xl shadow-gray-200/50 border border-gray-100">

                {/* Header */}
                <div
                    className="rounded-2xl p-5 text-white mb-6"
                    style={{ background: "linear-gradient(135deg,#1e3a5f 0%,#0f2440 100%)" }}
                >
                    <h2 className="text-xl font-bold">Talabaning ta'lim tarixi</h2>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center items-center py-16">
                        <ReactLoading type="spinningBubbles" color="#1e3a5f" height={50} width={50} />
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center text-red-500 font-medium text-sm">
                        {error}
                    </div>
                )}

                {/* No studentId */}
                {!loading && !error && !resolvedId && (
                    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Student ID ko'rsatilmagan</h3>
                        <p className="text-gray-500 text-sm">URL da student ID bo'lishi kerak</p>
                    </div>
                )}

                {/* Data */}
                {!loading && data && (
                    <div className="space-y-4">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { value: sections.length, label: "Bo'limlar",     color: "#6366f1", bg: "#eef2ff" },
                                { value: totalQuestions,  label: "Jami savollar", color: "#7c3aed", bg: "#f5f3ff" },
                                { value: totalCorrect,    label: "To'g'ri",       color: "#16a34a", bg: "#f0fdf4" },
                                { value: totalWrong,      label: "Noto'g'ri",     color: "#dc2626", bg: "#fef2f2" },
                            ].map(stat => (
                                <div key={stat.label} className="rounded-2xl p-4 flex flex-col shadow-sm" style={{ background: stat.bg }}>
                                    <span className="text-3xl font-extrabold" style={{ color: stat.color }}>{stat.value}</span>
                                    <span className="text-gray-500 text-sm mt-1">{stat.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Accuracy + Quick Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                <h3 className="text-base font-bold text-gray-800 mb-3">Umumiy ko'rsatkich</h3>
                                <div className="w-full bg-gray-100 rounded-full h-4 mb-3 overflow-hidden">
                                    <div className="h-4 rounded-full transition-all duration-700"
                                        style={{ width: `${accuracy}%`, background: accuracyGradient }} />
                                </div>
                                <p className="font-bold text-lg" style={{ color: accuracyColor }}>
                                    Aniqlik darajasi: {accuracy}%
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {totalCorrect} ta to'g'ri / {totalWrong} ta noto'g'ri
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                <h3 className="text-base font-bold text-gray-800 mb-3">Qisqa ma'lumot</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    {data.fullName    && <li>• O'quvchi: <b>{data.fullName}</b></li>}
                                    {data.phoneNumber && <li>• Telefon: <b>{data.phoneNumber}</b></li>}
                                    <li>• Topshirilgan bo'limlar: <b>{sections.length} ta</b></li>
                                    {firstSection?.createdAt && (
                                        <li>• Oxirgi urinish: <b>{formatDate(firstSection.createdAt)}</b></li>
                                    )}
                                    <li>• Student ID: <b className="font-mono">{resolvedId}</b></li>
                                </ul>
                            </div>
                        </div>

                        {/* Sections table */}
                        {sections.length > 0 && (
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                <h3 className="text-base font-bold text-gray-800 mb-4">Bo'limlar bo'yicha natija</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                {["Bo'lim", "Sana", "Test nomi", "Modullar", "Natija", "Status"].map(h => (
                                                    <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pr-4 last:pr-0">
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {sections.map((sec, idx) => {
                                                const correct  = sec.overallResult?.correctCount ?? 0;
                                                const total    = sec.overallResult?.totalCount ?? sec.questions?.length ?? 0;
                                                const isAlo    = sec.overallResult?.wrongCount === 0;
                                                const modCount = sec.moduleNames?.length || sec.moduleIds?.length || 0;
                                                return (
                                                    <tr key={idx} className={`hover:bg-gray-50 transition-colors ${idx % 2 === 1 ? "bg-gray-50/40" : ""}`}>
                                                        <td className="py-3 pr-4 font-semibold text-gray-800">
                                                            #{sec.sectionIndex || idx + 1}
                                                        </td>
                                                        <td className="py-3 pr-4 text-gray-500 text-xs whitespace-nowrap">
                                                            {formatDate(sec.createdAt)}
                                                        </td>
                                                        <td className="py-3 pr-4 text-gray-700 text-xs max-w-[160px]">
                                                            <p className="font-medium truncate">{sec.testName || "—"}</p>
                                                            {sec.courseName && <p className="text-gray-400 truncate">{sec.courseName}</p>}
                                                        </td>
                                                        <td className="py-3 pr-4 text-gray-500 text-xs">
                                                            {modCount > 0 ? (
                                                                <span className="inline-flex items-center gap-1">
                                                                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                                                                        {modCount}
                                                                    </span>
                                                                    ta modul
                                                                </span>
                                                            ) : "—"}
                                                        </td>
                                                        <td className="py-3 pr-4">
                                                            <span className="font-bold" style={{ color: isAlo ? "#16a34a" : "#374151" }}>
                                                                {correct}/{total}
                                                            </span>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className="px-3 py-1 rounded-full text-xs font-semibold"
                                                                style={isAlo
                                                                    ? { background: "#dcfce7", color: "#16a34a" }
                                                                    : { background: "#fee2e2", color: "#dc2626" }}>
                                                                {isAlo ? "A'lo" : "Xato bor"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Wrong answers */}
                        <WrongAnswersBlock sections={sections} />

                        {/* All correct */}
                        {!hasAnyWrong && sections.length > 0 && (
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
                                <p className="text-green-600 font-bold text-lg">🎉 Barcha savollar to'g'ri javoblangan!</p>
                                <p className="text-green-500 text-sm mt-1">Aniqlik darajasi: {accuracy}%</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}