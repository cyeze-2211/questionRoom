import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function StudentTestEdit({ isOpen, onClose, student, tests, refresh }) {
    const [testId, setTestId] = useState("");
    const [saving, setSaving] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setMounted(true), 10);
        } else {
            setMounted(false);
        }
    }, [isOpen]);

    useEffect(() => {
        setTestId(student?.testId || "");
    }, [student]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put(`/users/edit`, {
                ...student,
                testId: testId ? Number(testId) : null,
                creatorId: localStorage.getItem("userId"),
                password: "",
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            Swal.fire({
                title: "Muvaffaqiyatli!",
                icon: "success",
                position: "top-end",
                timer: 2000,
                toast: true,
                showConfirmButton: false,
            });

            refresh?.();
            onClose();
        } catch (err) {
            Swal.fire({
                title: "Xatolik!",
                text: err.response?.data?.message || "Error.",
                icon: "error",
                position: "top-end",
                timer: 3000,
                toast: true,
                showConfirmButton: false,
            });
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    const selectedTest = tests?.find(t => String(t.id) === String(testId));

    return (
        <>
            <style>{`
                @keyframes backdropIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(32px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .modal-backdrop {
                    animation: backdropIn 0.25s ease forwards;
                }
                .modal-card {
                    animation: modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .test-option {
                    transition: all 0.18s ease;
                }
                .test-option:hover {
                    transform: translateX(4px);
                }
                .save-btn {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.2s ease;
                }
                .save-btn::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%);
                    background-size: 200% auto;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .save-btn:hover::after {
                    opacity: 1;
                    animation: shimmer 0.8s linear;
                }
                .save-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 20px rgba(34, 197, 94, 0.35);
                }
                .save-btn:active {
                    transform: translateY(0);
                }
                .close-btn {
                    transition: all 0.18s ease;
                }
                .close-btn:hover {
                    transform: rotate(90deg);
                }
                .select-wrapper {
                    transition: all 0.2s ease;
                }
                .select-wrapper:focus-within {
                    transform: scale(1.01);
                }
            `}</style>

            <div
                className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backgroundColor: 'rgba(4, 4, 5, 0.6)', backdropFilter: 'blur(4px)' }}
                onClick={onClose}
            >
                <div
                    className="modal-card bg-white w-full max-w-md rounded-2xl overflow-hidden"
                    style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative px-6 pt-6 pb-5" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                            style={{ background: 'radial-gradient(circle, #60a5fa, transparent)', transform: 'translate(30%, -30%)' }} />
                        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full opacity-10"
                            style={{ background: 'radial-gradient(circle, #34d399, transparent)', transform: 'translate(-30%, 30%)' }} />

                        <div className="relative flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(96,165,250,0.2)' }}>
                                        <svg width="14" height="14" fill="none" stroke="#60a5fa" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                        </svg>
                                    </div>
                                    <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#60a5fa' }}>Test belgilash</span>
                                </div>
                                <h2 className="text-xl font-bold text-white leading-tight">
                                    {student?.firstName} {student?.lastName}
                                </h2>
                                {student?.username && (
                                    <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{student.username}</p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="close-btn w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
                            >
                                <svg width="14" height="14" fill="currentColor" viewBox="0 0 14 14">
                                    <path fillRule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clipRule="evenodd"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5">
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#64748b' }}>
                            Testni tanlang
                        </label>

                        <div className="select-wrapper relative">
                            <select
                                value={testId}
                                onChange={(e) => setTestId(e.target.value)}
                                className="w-full appearance-none rounded-xl border-2 px-4 py-3 pr-10 text-sm font-medium outline-none transition-all"
                                style={{
                                    borderColor: testId ? '#3b82f6' : '#e2e8f0',
                                    background: testId ? '#eff6ff' : '#f8fafc',
                                    color: testId ? '#1e40af' : '#64748b',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">— Test tanlanmagan —</option>
                                {tests?.length > 0 ? (
                                    tests.map((test) => (
                                        <option key={test.id} value={test.id}>
                                            {test.name || `Test #${test.id}`}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Testlar mavjud emas</option>
                                )}
                            </select>
                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: testId ? '#3b82f6' : '#94a3b8' }}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path d="M6 9l6 6 6-6"/>
                                </svg>
                            </div>
                        </div>

              
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100 active:scale-95"
                            style={{ border: '1.5px solid #e2e8f0', color: '#64748b' }}
                        >
                            Bekor qilish
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="save-btn flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                            style={{
                                background: saving ? '#86efac' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                                cursor: saving ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {saving ? (
                                <>
                                    <svg style={{ animation: 'spin 0.7s linear infinite' }} width="15" height="15" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                    </svg>
                                    Saqlanmoqda...
                                </>
                            ) : (
                                <>
                                    <svg width="15" height="15" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path d="M5 13l4 4L19 7"/>
                                    </svg>
                                    Saqlash
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}