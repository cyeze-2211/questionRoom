import axios from "axios";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { Button } from "@material-tailwind/react";
import { NavLink, useNavigate } from "react-router-dom";

export default function ErrorPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const Divase = localStorage.getItem(`isTelegram`);
    const navigate = useNavigate();

    const getResult = async () => {
        try {
            const response = await axios.get(`/result/get`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                params: {
                    studentId: localStorage.getItem("userId"),
                },
            });
            setData(response?.data?.object || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getResult();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <ReactLoading type="spinningBubbles" color="#000" height={60} width={60} />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 p-4 sm:p-6 pb-32">
            {/* header */}
            <div className="flex items-center justify-between gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Natijalar</h1>
                <Button
                    color="gray"
                    onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                    }}
                    className="bg-black text-white hover:bg-gray-800 px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg"
                >
                    Qayta boshlash
                </Button>
            </div>

            {data && data.length > 0 ? (
                <div className="grid mt-6 gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {data.map((i, index) => {
                        const resultId = i?.resultId ?? `res-${index}`;

                        const correct = Number(i?.correctAnswerCount ?? 0);
                        const wrong = Number(i?.wrongAnswerCount ?? 0);
                        const totalEntity = Number(i?.testEntity?.testCount);

                        const total = Number.isFinite(totalEntity) && totalEntity > 0 ? totalEntity : correct + wrong;

                        const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

                        return (
                            <NavLink to={`/result/${resultId}`} key={resultId} className="block">
                                <div className="bg-white shadow rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
                                    <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-2 truncate">
                                        Test nomi: {i.testEntity?.name}
                                    </h2>

                                    <div className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
                                        <p>
                                            <span className="font-semibold">To‘g‘ri javoblar:</span> {correct}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Noto‘g‘ri javoblar:</span> {wrong}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Umumiy savollar:</span> {total}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Natija:</span> {percent}%
                                        </p>
                                        <p>
                                            <span className="font-semibold">Yaratilgan sana:</span>{" "}
                                            {i.testEntity?.createdAt ? i.testEntity.createdAt.split("T")[0] : "-"}
                                        </p>
                                    </div>
                                </div>
                            </NavLink>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white w-full mt-6 h-36 sm:h-48 flex items-center justify-center rounded-lg shadow">
                    <h1 className="text-gray-600 text-sm sm:text-base">Ma'lumot yo‘q</h1>
                </div>
            )}
        </div>
    );
}
