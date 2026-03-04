import axios from "axios"
import { useEffect, useState } from "react"
import ReactLoading from 'react-loading';
import { Filter, Plus, Eye, Pencil, Globe, Send } from "lucide-react"; // ikonkalar
import { NavLink, useLocation, useParams } from "react-router-dom"

export default function StudentProfile() {
    const { id } = useParams()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const firstName = queryParams.get("firstName");
    const lastName = queryParams.get("lastName");

    const getSudent = async () => {
        try {
            const response = await axios.get(`/result/get`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: { studentId: id }
            })
            setData(response?.data?.object)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSudent()
    }, [])

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen overflow-y-auto bg-gray-100 p-6 md:p-10">
            <div className="w-full bg-white shadow-md p-5 rounded-lg mb-6">
                <h1 className="text-2xl font-bold">
                    {firstName} {lastName}
                </h1>
            </div>

            {data && data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {data.map((i, index) => {
                        const resultId = i?.resultId ?? `res-${index}`;
                        const correct = Number(i?.correctAnswerCount ?? 0);
                        const wrong = Number(i?.wrongAnswerCount ?? 0);
                        const totalEntity = Number(i?.testEntity?.testCount);
                        const total = Number.isFinite(totalEntity) && totalEntity > 0 ? totalEntity : correct + wrong;
                        const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

                        return (
                            <NavLink to={`/admin/result/detail/${resultId}`} key={resultId} className="block">
                                <div className="bg-white shadow-lg rounded-xl p-5 h-full hover:shadow-xl transition">
                                    <h2 className="text-lg font-bold text-gray-800 mb-3">
                                        Test nomi: {i.testEntity?.name}
                                    </h2>
                                    <div className="space-y-2 text-gray-700 text-sm">
                                        <p><span className="font-semibold">To‘g‘ri javoblar:</span> {correct}</p>
                                        <p><span className="font-semibold">Noto‘g‘ri javoblar:</span> {wrong}</p>
                                        <p><span className="font-semibold">Umumiy savollar:</span> {total}</p>
                                        <p><span className="font-semibold">Natija:</span> {percent}%</p>
                                        <p><span className="font-semibold">Yaratilgan sana:</span> {i.testEntity?.createdAt?.split("T")[0] ?? "-"}</p>
                                        <div className="flex gap-4 mt-3 text-sm">
                                            {i.isTelegram === true ? (
                                                <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">
                                                    <Send size={14} /> Telegram
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg">
                                                    <Globe size={14} /> Web
                                                </span>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                        )
                    })}
                </div>
            ) : (
                <div className="bg-white w-full mt-6 h-[200px] flex items-center justify-center rounded-lg shadow">
                    <h1 className="text-gray-600">Ma'lumot yo‘q</h1>
                </div>
            )}
        </div>
    )
}
