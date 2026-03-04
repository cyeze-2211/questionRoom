import React, { useEffect, useState } from "react";
import { Select, Option, Button, Input } from "@material-tailwind/react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import QuizDelete from "../Components/AdminQuiz/QuizDelete";
import QuestionEdit from "../Components/AdminQuiz/QuestionEdit";
import ReactLoading from 'react-loading';


export default function AdminRating() {
    const navigate = useNavigate();
    const [testData, setTestData] = useState([]);
    const [rating, setRating] = useState([]);
    const [loading, setLoading] = useState(false);

    const [testId, setTestId] = useState(null);
    const [itemsData, setItemsData] = useState(null);
    const [EditData, setEditData] = useState(null);

    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    // Получить тесты
    const getAllTest = async () => {
        try {
            const response = await axios.get(`/test/get`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTestData(response?.data?.object || []);
        } catch (error) {
            console.log(error);
        }
    };

    // Sana formatlash helper function
    const formatDateToDDMMYYYY = (dateStr) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
    };

    // Получить рейтинг
    const getRating = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/result/get/rating`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                params: {
                    start: formatDateToDDMMYYYY(start),
                    end: formatDateToDDMMYYYY(end),
                    testId,
                },
            });

            const rat = Array.isArray(response?.data?.object)
                ? response.data.object
                : [];
            setRating(rat);
        } catch (error) {
            console.error(error);
            setRating([]);
            if (error?.status === 401) {
                navigate("/login");
                localStorage.clear();
            }
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getAllTest();
    }, []);


    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
            </div>
        );
    }


    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-100 p-6 md:p-10">
            {/* Фильтры */}
            <div className="flex items-center gap-4 mb-6">
                {/* Выбор теста */}
                <Select
                    className="bg-white"
                    label="Test tanlash"
                    onChange={(value) => setTestId(value)}
                >
                    {testData?.map((test) => (
                        <Option key={test.id} value={test.id}>
                            {test.name}
                        </Option>
                    ))}
                </Select>

                {/* Дата start */}
                <Input
                    type="date"
                    label="Boshlanish sanasi"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="bg-white"
                />

                {/* Дата end */}
                <Input
                    type="date"
                    label="Tugash sanasi"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="bg-white"
                />

                {/* Кнопка */}
                <Button className="w-[300px]" color="blue" onClick={getRating} disabled={!testId}>
                    Filterlash
                </Button>
            </div>

            {/* Таблица */}
            <div className="bg-white p-6 rounded-lg shadow-lg shadow-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Reyting</h1>
                </div>

                {rating?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left table-auto">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">№</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Ism Familiya</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Tel</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Natija %</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Savollar soni</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">To'g'ri javob</th>
                                    <th className="py-3 px-4 text-sm font-medium text-gray-600 text-center">Xato javob</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rating?.map((i, index) => {
                                    const totalCount =
                                        (i?.wrongAnswerCount || 0) +
                                        (i?.correctAnswerCount || 0);

                                    return (
                                        <tr
                                            key={i.studentId}
                                            className="border-t border-t-[2px] cursor-pointer text-center hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4 text-sm text-gray-800 text-center">
                                                {index + 1}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-800 text-center">
                                                <NavLink
                                                    className="underline"
                                                    to={`/admin/student/${i?.studentId}?firstName=${i.studentName}`}
                                                >
                                                    {i?.user?.firstName} {i?.user?.lastName}
                                                </NavLink>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-800 text-center">
                                                {i?.user?.phoneNumber}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-800 text-center">
                                                {totalCount > 0
                                                    ? ((i.correctAnswerCount / totalCount) * 100).toFixed(2) + "%"
                                                    : "0%"}
                                            </td>

                                            <td className="py-3 px-4 text-sm text-gray-800 text-center">
                                                {totalCount}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-800 text-center">
                                                {i?.correctAnswerCount}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-800 text-center">
                                                {i?.wrongAnswerCount}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[300px]">
                        <h1>Ma'lumot yo'q</h1>
                    </div>
                )}
            </div>

            {/* Модалки */}
            <QuizDelete
                refresh={() => { }}
                data={itemsData}
                isOpen={false}
                onClose={() => { }}
            />
            <QuestionEdit data={EditData} isOpen={false} onClose={() => { }} />
        </div>
    );
}
