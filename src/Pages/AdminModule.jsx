import React, { useEffect, useState } from "react";
import CreateModule from "../Components/AdminModule/CreateModule";
import DeleteModule from "../Components/AdminModule/DeleteModule";
import EditModule from "../Components/AdminModule/EditModule";
import axios from "axios";
import ReactLoading from 'react-loading';
import { useNavigate, useParams } from "react-router-dom";
import CONFIG from "../utils/Config";

export default function AdminModule() {
    const { ID } = useParams();
    const [course, setCourse] = useState([]);
    const [createModal, setCreateModal] = useState(false);
    const [deleteCourse, setDeleteCourse] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemsData, setItemsData] = useState(null);
    const navigate = useNavigate();

    const getCourse = async () => {
        try {
            const response = await axios.get(`/course/get/one?courseId=${ID}`);
            setCourse(response?.data?.object);
        } catch (error) {
            console.log(error);
        }
    };

    const getModule = async () => {
        try {
            const response = await axios.get(`/module/get?courseId=${ID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setData(response?.data?.object || []);
        } catch (error) {
            if (error?.status === 401) {
                navigate("/login");
                localStorage.clear();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getModule();
        getCourse();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-100 p-6 md:p-10">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-800">{course?.name} modullari</h1>
                <button
                    onClick={() => setCreateModal(true)}
                    className="bg-[#272C4B] text-white py-2 px-6 rounded-md text-sm font-medium transition-all hover:bg-[#1f223d]"
                >
                    Modul yaratish
                </button>
            </div>

            {data && data.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data.map((module) => (
                        <div
                            key={module.id}
                            className="bg-white shadow-md rounded-xl border border-gray-200 p-5 flex flex-col justify-between hover:shadow-lg transition-all"
                        >
                            {/* Icon preview */}
                            {module.iconId && (
                                <img
                                    src={`${CONFIG?.API_URL + module.iconId}`}
                                    alt="module icon"
                                    className="w-16 h-16 object-contain mb-3"
                                />
                            )}

                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-gray-800">{module.name}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {module.createdAt?.split("T")[0]}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end mt-4 space-x-3">
                                <button
                                    onClick={() => {
                                        navigate(`/admin/quiz/${module?.id}`)
                                    }}
                                    className="text-green-600 hover:text-green-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"></path></svg>
                                </button>
                                <button
                                    onClick={() => {
                                        setEditModal(true);
                                        setItemsData(module);
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => {
                                        setDeleteCourse(true);
                                        setItemsData(module?.id);
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-[300px]">
                    <h1 className="text-gray-500">Hozircha modul yo‘q</h1>
                </div>
            )}

            <CreateModule refresh={getModule} isOpen={createModal} onClose={() => setCreateModal(false)} />
            <DeleteModule refresh={getModule} data={itemsData} isOpen={deleteCourse} onClose={() => setDeleteCourse(false)} />
            <EditModule data={itemsData} refresh={getModule} isOpen={editModal} onClose={() => setEditModal(false)} />
        </div>
    );
}
