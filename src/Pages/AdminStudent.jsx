import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from 'react-loading';
import CreateStudent from "../Components/AdminStudent/CreateStudent";
import DeleteStudent from "../Components/AdminStudent/DeleteStudent";
import { Button, Input, Select, Option } from '@material-tailwind/react';
import EditStudent from "../Components/AdminStudent/EditStudent";
import { NavLink, useNavigate } from "react-router-dom";
import StudentTestEdit from "../Components/AdminStudent/StudentTestEdit";

export default function AdminStudent() {
    const [createModal, setCreateModal] = useState(false);
    const [firstName, setFirstName] = useState('')
    const [deleteCourse, setDeleteCourse] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [itemsData, setItemsData] = useState(null)
    const navigate = useNavigate()
    const [phoneNumber, setPhoneNumber] = useState('')
    const [lastName, setLastName] = useState('')
    const [gender, setGender] = useState(null)
    const [email, setEmail] = useState('')
    const [school, setSchool] = useState('')
    const [sinif, setSinif] = useState('')
const [testEditModal, setTestEditModal] = useState(false);
const [testEditStudent, setTestEditStudent] = useState(null);
    // Новые фильтры
    const [selectedGroupId, setSelectedGroupId] = useState('')
    const [selectedSchool, setSelectedSchool] = useState('')
    const [telegramChatId, setTelegramChatId] = useState('')
    const [selectedTestId, setSelectedTestId] = useState('')

    // Состояние аккордеона
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 20
    });

    const [groups, setGroups] = useState([]);
    const [tests, setTests] = useState([]);
    const [schools, setSchools] = useState([]);

    const getAllGroups = async () => {
        try {
            const response = await axios.get("/group/get/all", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setGroups(response?.data?.object || []);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    const getAllTest = async () => {
        try {
            const response = await axios.get("/test/get?isTelegram=true&isWeb=true", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setTests(response?.data?.object || []);
        } catch (error) {
            console.error("Error fetching tests:", error);
        }
    };

    const getStudent = async (page = 0) => {
        try {
            const response = await axios.get(`/users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    phoneNumber: phoneNumber,
                    accountType: 'STUDENT',
                    firstName: firstName,
                    lastName: lastName,
                    page: page,
                    size: pagination.pageSize,
                    genderType: gender,
                    email: email,
                    school: selectedSchool,
                    group: sinif,
                    groupId: selectedGroupId,
                    telegramChatId: telegramChatId,
                    testId: selectedTestId
                }
            });

            const responseData = response?.data?.object;
            setData(responseData.content);
            setPagination({
                currentPage: responseData.number,
                totalPages: responseData.totalPages,
                totalElements: responseData.totalElements,
                pageSize: responseData.size
            });
        } catch (error) {
            console.log(error);
            if (error?.status === 401) {
                navigate('/login')
                localStorage.clear()
            }
        } finally {
            setLoading(false)
        }
    };

    const clearFilters = () => {
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setGender(null);
        setEmail('');
        setSelectedSchool('');
        setSinif('');
        setSelectedGroupId('');
        setTelegramChatId('');
        setSelectedTestId('');
    };

    useEffect(() => {
        getStudent();
        getAllGroups();
        getAllTest();
    }, []);

    const handlePageChange = (page) => {
        if (page >= 0 && page < pagination.totalPages) {
            getStudent(page);
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
            </div>
        );
    }

    return (
        <div className="w-full h-screen overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10">
            <div className="bg-white p-6 rounded-xl shadow-xl shadow-gray-200/50 border border-gray-100">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Barcha talabalar
                        </h1>
                    </div>
                    <NavLink to={`/admin/student/create`}>
                        <Button>
                            <span>Talaba yaratish</span>
                        </Button>
                    </NavLink>
                </div>

                <div className="mb-6">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 transition-all duration-200"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Filtrlar</h3>
                                    <p className="text-sm text-gray-500">Qidiruv parametrlarini sozlash</p>
                                </div>
                            </div>
                            <div className={`transform transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>

                        <div className={`transition-all duration-300 ease-in-out ${isFilterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                            <div className="px-6 pb-6 border-t border-gray-200 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                                    {/* Existing filters */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Ism</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="Ismni kiriting..."
                                            className="border border-gray-300 focus:border-blue-500 rounded-lg p-2 w-full"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Familiya</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Familiyani kiriting..."
                                            className="border border-gray-300 focus:border-blue-500 rounded-lg p-2 w-full"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Telefon</label>
                                        <input
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                const input = e.target.value;
                                                const numericValue = input.replace(/\D/g, "");
                                                let formattedValue = "+998";

                                                if (numericValue.startsWith("998")) {
                                                    formattedValue += numericValue.slice(3, 12);
                                                } else {
                                                    formattedValue += numericValue.slice(0, 9);
                                                }
                                                setPhoneNumber(formattedValue);
                                            }}
                                            placeholder="+998 XX XXX XX XX"
                                            className="border border-gray-300 focus:border-blue-500 rounded-lg p-2 w-full"
                                            maxLength={13}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Jinsi</label>
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="border border-gray-300 focus:border-blue-500 rounded-lg p-2 w-full"
                                        >
                                            <option value="">Tanlang</option>
                                            <option value="ERKAK">Erkak</option>
                                            <option value="AYOL">Ayol</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="email@example.com"
                                            className="border border-gray-300 focus:border-blue-500 rounded-lg p-2 w-full"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Sinif</label>
                                        <input
                                            type="text"
                                            value={sinif}
                                            onChange={(e) => setSinif(e.target.value)}
                                            placeholder="Sinf raqami..."
                                            className="border border-gray-300 focus:border-blue-500 rounded-lg p-2 w-full"
                                        />
                                    </div>

                                    {/* New filters */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Guruh</label>
                                        <select
                                            value={selectedGroupId}
                                            onChange={(e) => setSelectedGroupId(e.target.value)}
                                            className="border border-gray-300 focus:border-blue-500 rounded-lg p-2 w-full"
                                        >
                                            <option value="">Barcha guruhlar</option>
                                            {groups.map((group) => (
                                                <option key={group.id} value={group.id}>
                                                    {group.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Maktab</label>
                                        <input
                                            type="text"
                                            value={selectedSchool}
                                            onChange={(e) => setSelectedSchool(e.target.value)}
                                            placeholder="Maktab raqami..."
                                            className="border border-gray-300 focus:border-blue-500 rounded-lg p-2 w-full"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Telegram Chat ID</label>
                                        <input
                                            type="text"
                                            value={telegramChatId}
                                            onChange={(e) => setTelegramChatId(e.target.value)}
                                            placeholder="Chat ID ni kiriting..."
                                            className="border border-gray-300 focus:border-blue-500 rounded-lg p-2 w-full"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Test</label>
                                        <select
                                            value={selectedTestId}
                                            onChange={(e) => setSelectedTestId(e.target.value)}
                                            className="border border-gray-300 focus:border-blue-500 rounded-lg p-2 w-full"
                                        >
                                            <option value="">Barcha testlar</option>
                                            {tests.map((test) => (
                                                <option key={test.id} value={test.id}>
                                                    {test.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">

                                    <Button className="flex items-center gap-[5px]" onClick={() => getStudent(0)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span>Qidirish</span>
                                    </Button>

                                    <button
                                        onClick={clearFilters}
                                        className="border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2 p-2 transition-all"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span>Tozalash</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results count */}
                {pagination.totalElements > 0 && (
                    <div className="mb-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700 font-medium">
                            Jami <span className="font-bold">{pagination.totalElements}</span> ta natija topildi
                        </p>
                    </div>
                )}

                {/* Table */}
                {data && data?.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Ism</th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Tug'ilgan kun</th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Telefon</th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Hisob</th>
                                    <th className="py-4 px-6 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Sozlama</th>
                                     <th className="py-4 px-6 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Test</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {data?.map((course, index) => (
                                    <tr key={course.id} className={`transition-all hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                        <td className="py-4 px-6">
                                            <NavLink
                                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                                                to={`/admin/student/${course?.id}?firstName=${course.firstName}&lastName=${course.lastName}`}
                                            >
                                                {course.firstName} {course.lastName}
                                            </NavLink>
                                        </td>
                                        <td className="py-4 px-6 text-gray-700">{course?.dateBirth}</td>
                                        <td className="py-4 px-6 text-gray-700">{course?.username}</td>
                                        <td className="py-4 px-6">
                                           {course?.balance} UZS
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-center space-x-2">
                                                <NavLink to={`/admin/student/edit/${course?.id}`}>
                                                    <button
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all"
                                                        title="Tahrirlash"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                </NavLink>
                                                <button
                                                    onClick={() => { setDeleteCourse(true); setItemsData(course?.id) }}
                                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all"
                                                    title="O'chirish"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setTestEditModal(true);
                                                        setTestEditStudent(course);
                                                    }}
                                                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all"
                                                    title="Test belgilash"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                                <NavLink
                                                    to={`/admin/history/${course?.id}`}
                                                    className="p-2 text-violet-600 hover:text-violet-800 hover:bg-violet-100 rounded-lg transition-all inline-flex"
                                                    title="Ta'lim tarixi"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </NavLink>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Hech qanday ma'lumot topilmadi</h3>
                        <p className="text-gray-500">Qidiruv parametrlarini o'zgartirib ko'ring</p>
                    </div>
                )}

                {pagination.totalPages > 1 && (
                    <div className="mt-8 bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">{pagination.currentPage * pagination.pageSize + 1}</span>
                                {' - '}
                                <span className="font-medium">
                                    {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)}
                                </span>
                                {' / '}
                                <span className="font-medium">{pagination.totalElements}</span>
                                {' natija'}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    className={`p-2 rounded-lg text-sm font-medium transition-all ${pagination.currentPage === 0
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                                        }`}
                                    disabled={pagination.currentPage === 0}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <div className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700">
                                    {pagination.currentPage + 1} / {pagination.totalPages}
                                </div>

                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    className={`p-2 rounded-lg text-sm font-medium transition-all ${pagination.currentPage === pagination.totalPages - 1
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                                        }`}
                                    disabled={pagination.currentPage === pagination.totalPages - 1}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
<StudentTestEdit
    isOpen={testEditModal}
    onClose={() => setTestEditModal(false)}
    student={testEditStudent}
    tests={tests}
    refresh={getStudent}
/>
            <CreateStudent refresh={getStudent} isOpen={createModal} onClose={() => setCreateModal(false)} />
            <DeleteStudent refresh={getStudent} data={itemsData} isOpen={deleteCourse} onClose={() => setDeleteCourse(false)} />
            <EditStudent data={itemsData} refresh={getStudent} isOpen={editModal} onClose={() => setEditModal(false)} />
        </div>
    );
}