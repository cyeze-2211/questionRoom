import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import * as XLSX from "xlsx";

const PAGE_SIZE = 10;

export default function GroupMonitor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [monitoringData, setMonitoringData] = useState(null);
    const [testsData, setTestsData] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [visibleStudents, setVisibleStudents] = useState(PAGE_SIZE);
    const [visibleTests, setVisibleTests] = useState(PAGE_SIZE);
    const [openAccordions, setOpenAccordions] = useState({});

    const fetchData = async () => {
        setLoading(true);
        try {
            const monRes = await axios.post(
                `monitoring/get`,
                { groupIds: [parseInt(id)] },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            const mon = monRes.data?.object || monRes.data;
            setMonitoringData(mon);

            const allTestIds = (mon?.tests || []).map(t => t.testId).filter(Boolean);
            if (allTestIds.length > 0) {
                const testsRes = await axios.post(
                    `monitoring/tests-with-questions`,
                    { testIds: allTestIds },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setTestsData(testsRes.data?.object || testsRes.data);
            }
        } catch (error) {
            console.error("Monitoring fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (id) fetchData(); }, [id]);

    // ✅ FRONTEND EXCEL EXPORT — SheetJS (xlsx) kutubxonasi orqali
    const exportToExcel = () => {
        if (!monitoringData) return;
        setExporting(true);

        try {
            const wb = XLSX.utils.book_new();
            const ws_data = [];

            const allStudents = monitoringData?.rows || [];
            const tests = monitoringData?.tests || [];
            const groupTitle = monitoringData?.title || `Guruh #${id}`;
            const today = new Date().toLocaleDateString("uz-UZ", {
                year: "numeric", month: "2-digit", day: "2-digit"
            });

            const usedTestIds = new Set(
                allStudents.flatMap(row => Object.keys(row.scoresByTestId || {}).map(Number))
            );
            const activeTests = tests.filter(t => usedTestIds.has(t.testId));

            // ── Qator 1: Title (bo'sh, keyin title, qolgani bo'sh) ──
            ws_data.push(["", `${groupTitle} monitoring , ${today} kungi holatiga`]);
            ws_data.push([""]); // bo'sh qator

            // ── Qator 3: Header ──
            const headerRow = ["TR", "Full name", "Tel"];
            activeTests.forEach((test, idx) => {
                headerRow.push(`Test #${idx + 1} ${test.testName || ""}`);
            });
            ws_data.push(headerRow);

            // ── O'quvchilar satrlari ──
            allStudents.forEach((student) => {
                const row = [
                    student.tr,
                    student.fullName,
                    student.phoneNumber,
                ];
                activeTests.forEach((test) => {
                    const pct = student.scoresByTestId?.[String(test.testId)] ?? null;
                    row.push(pct !== null ? `${pct}%` : "");
                });
                ws_data.push(row);
            });

            // ── 2 ta bo'sh qator ──
            ws_data.push([]);
            ws_data.push([]);

            // ── Test savollari sarlavhasi ──
            ws_data.push(["", "", "Test savollari"]);
            ws_data.push([]);

            // ── Test savollari header ──
            ws_data.push(["", "Test nomi", "Test savoli"]);

            // ── Har bir test va uning savollari ──
            const allTestsWithQ = testsData?.tests || testsData || [];
            allTestsWithQ.forEach((test, tIdx) => {
                const questions = test.questions || [];
                questions.forEach((q, qIdx) => {
                    ws_data.push([
                        qIdx === 0 ? tIdx + 1 : "",
                        qIdx === 0 ? (test.testTitle || `Test #${tIdx + 1}`) : "",
                        q.question || q.text || q.questionText || "—",
                    ]);
                });
                ws_data.push([]); // har bir test orasida bo'sh qator
            });

            // ── Worksheet yaratish ──
            const ws = XLSX.utils.aoa_to_sheet(ws_data);

            // ── Ustun kengliklarini sozlash ──
            const colWidths = [
                { wch: 5 },   // TR
                { wch: 25 },  // Full name
                { wch: 18 },  // Tel
            ];
            activeTests.forEach(() => colWidths.push({ wch: 22 }));
            ws["!cols"] = colWidths;

            // ── Title merge (A1:B1 + uning yonlarigacha) ──
            const totalCols = 3 + activeTests.length;
            ws["!merges"] = [
                { s: { r: 0, c: 1 }, e: { r: 0, c: Math.max(totalCols - 1, 2) } }, // title merge
            ];

            XLSX.utils.book_append_sheet(wb, ws, "Monitoring");

            const fileName = `monitoring_${groupTitle}_${new Date().toISOString().split("T")[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);
        } catch (err) {
            console.error("Export error:", err);
        } finally {
            setExporting(false);
        }
    };

    const toggleAccordion = (idx) => {
        setOpenAccordions(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <ReactLoading type="spinningBubbles" color="#1e3a5f" height={80} width={80} />
            </div>
        );
    }

    const allStudents = monitoringData?.rows || [];
    const tests = monitoringData?.tests || [];
    const groupTitle = monitoringData?.title || `Guruh #${id}`;
    const today = new Date().toLocaleDateString("uz-UZ", { year: "numeric", month: "2-digit", day: "2-digit" });
    const allTestsWithQ = testsData?.tests || testsData || [];

    const usedTestIds = new Set(
        allStudents.flatMap(row => Object.keys(row.scoresByTestId || {}).map(Number))
    );
    const activeTests = tests.filter(t => usedTestIds.has(t.testId));
    const inactiveTests = tests.filter(t => !usedTestIds.has(t.testId));

    const shownStudents = allStudents.slice(0, visibleStudents);
    const shownTests = allTestsWithQ.slice(0, visibleTests);
    const hasMoreStudents = visibleStudents < allStudents.length;
    const hasMoreTests = visibleTests < allTestsWithQ.length;

    const getScoreStyle = (pct) => {
        if (pct >= 80) return { color: "#15803d", bg: "#dcfce7" };
        if (pct >= 50) return { color: "#b45309", bg: "#fef3c7" };
        return { color: "#b91c1c", bg: "#fee2e2" };
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            <div className="p-2 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{groupTitle} — Monitoring</h1>
                    <p className="text-gray-400 text-sm mt-1">{today} kungi holatiga · {allStudents.length} ta o'quvchi</p>
                </div>

                {/* ✅ EXPORT BUTTON */}
                <button
                    onClick={exportToExcel}
                    disabled={exporting || !monitoringData}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    style={{
                        background: exporting ? "#e2e8f0" : "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                        color: exporting ? "#94a3b8" : "#fff",
                    }}
                >
                    {exporting ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Yuklanmoqda...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                            Excel yuklash
                        </>
                    )}
                </button>
            </div>

            {/* ASOSIY JADVAL */}
            <div className="max-w-[1250px] bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-gray-800">{groupTitle} monitoring</h2>
                            <p className="text-xs text-gray-400 mt-0.5">{today} kungi holatiga</p>
                        </div>
                        <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                            {allStudents.length} o'quvchi
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-3 px-3 text-center text-xs font-semibold text-gray-500 uppercase border-r border-gray-200 w-10">TR</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase border-r border-gray-200 min-w-[180px]">F.I.O</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase border-r border-gray-200 min-w-[140px]">Telefon</th>
                                    {activeTests.map((test, idx) => (
                                        <th key={test.testId} className="py-3 px-3 text-center text-xs font-semibold text-gray-500 uppercase border-r border-gray-200 min-w-[140px]">
                                            <span className="block">Test #{idx + 1}</span>
                                            <span className="block font-normal text-gray-400 normal-case truncate max-w-[130px]">{test.testName}</span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {shownStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={3 + activeTests.length} className="py-16 text-center text-gray-400">
                                            Ma'lumot topilmadi
                                        </td>
                                    </tr>
                                ) : shownStudents.map((student, idx) => (
                                    <tr key={student.studentId} className={`hover:bg-blue-50/30 transition-colors ${idx % 2 === 1 ? "bg-gray-50/40" : ""}`}>
                                        <td className="py-3 px-3 text-gray-400 border-r border-gray-100 text-center text-xs font-mono">{student.tr}</td>
                                        <td className="py-3 px-4 font-medium text-gray-800 border-r border-gray-100">{student.fullName}</td>
                                        <td className="py-3 px-4 text-gray-500 border-r border-gray-100 font-mono text-xs">{student.phoneNumber}</td>
                                        {activeTests.map((test) => {
                                            const pct = student.scoresByTestId?.[String(test.testId)] ?? null;
                                            const s = pct !== null ? getScoreStyle(pct) : null;
                                            return (
                                                <td key={test.testId} className="py-3 px-3 text-center border-r border-gray-100">
                                                    {pct !== null ? (
                                                        <span
                                                            className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-bold min-w-[44px]"
                                                            style={{ color: s.color, backgroundColor: s.bg }}
                                                        >
                                                            {pct}%
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300">—</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {hasMoreStudents && (
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <span className="text-xs text-gray-400">
                                Ko'rsatilmoqda: <span className="font-semibold text-gray-600">{shownStudents.length}</span> / {allStudents.length}
                            </span>
                            <button
                                onClick={() => setVisibleStudents(v => v + PAGE_SIZE)}
                                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Yana {Math.min(PAGE_SIZE, allStudents.length - visibleStudents)} ta ko'rsatish
                            </button>
                        </div>
                    )}
                    {!hasMoreStudents && allStudents.length > PAGE_SIZE && (
                        <div className="px-6 py-3 border-t border-gray-100 text-center">
                            <span className="text-xs text-gray-400">Barcha {allStudents.length} ta o'quvchi ko'rsatildi</span>
                        </div>
                    )}
                </div>
            </div>

            {/* HECH KIM TOPSHIRMAGAN TESTLAR */}
            {inactiveTests.length > 0 && (
                <div className="max-w-[1250px] bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
                    <button
                        onClick={() => toggleAccordion("inactive")}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">!</span>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">Hech kim topshirmagan testlar</p>
                                <p className="text-xs text-gray-400 mt-0.5">{inactiveTests.length} ta test mavjud</p>
                            </div>
                        </div>
                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${openAccordions["inactive"] ? "rotate-180" : ""}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {openAccordions["inactive"] && (
                        <div className="divide-y divide-gray-100 bg-gray-50/50">
                            {inactiveTests.map((test, i) => (
                                <div key={test.testId} className="flex items-center justify-between px-6 py-3 hover:bg-white transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-400 text-xs font-semibold flex items-center justify-center shadow-sm">{i + 1}</span>
                                        <span className="text-sm text-gray-700 font-medium">{test.testName}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-1 rounded-full">{test.totalQuestions} savol</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TEST SAVOLLARI ACCORDION */}
            {allTestsWithQ.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-gray-800">Test savollari</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Testni bosib savollarni ko'ring</p>
                        </div>
                        <span className="text-xs font-semibold bg-purple-50 text-purple-600 px-3 py-1 rounded-full">
                            {allTestsWithQ.length} ta test
                        </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {shownTests.map((test, tIdx) => {
                            const isOpen = !!openAccordions[`q_${tIdx}`];
                            const qCount = (test.questions || []).length;
                            return (
                                <div key={tIdx}>
                                    <button
                                        onClick={() => toggleAccordion(`q_${tIdx}`)}
                                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{tIdx + 1}</span>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">{test.testTitle || `Test #${tIdx + 1}`}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{qCount} ta savol</p>
                                            </div>
                                        </div>
                                        <svg
                                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isOpen && (
                                        <div className="border-t border-gray-100 bg-gray-50/50">
                                            {(test.questions || []).map((q, qIdx) => (
                                                <div key={qIdx} className="flex items-start gap-4 px-6 py-3 border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                                                    <span className="w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-500 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">{qIdx + 1}</span>
                                                    <p className="text-sm text-gray-700 leading-relaxed">{q.question || q.text || q.questionText || "—"}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {hasMoreTests && (
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <span className="text-xs text-gray-400">
                                Ko'rsatilmoqda: <span className="font-semibold text-gray-600">{shownTests.length}</span> / {allTestsWithQ.length}
                            </span>
                            <button
                                onClick={() => setVisibleTests(v => v + PAGE_SIZE)}
                                className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Yana {Math.min(PAGE_SIZE, allTestsWithQ.length - visibleTests)} ta ko'rsatish
                            </button>
                        </div>
                    )}
                    {!hasMoreTests && allTestsWithQ.length > PAGE_SIZE && (
                        <div className="px-6 py-3 border-t border-gray-100 text-center">
                            <span className="text-xs text-gray-400">Barcha {allTestsWithQ.length} ta test ko'rsatildi</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}