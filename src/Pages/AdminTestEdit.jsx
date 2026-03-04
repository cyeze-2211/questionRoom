import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardBody, Checkbox, Input, Typography, Button } from "@material-tailwind/react";
import ReactLoading from "react-loading";
import Swal from 'sweetalert2';
import { useParams } from "react-router-dom";

const useNavigate = () => (path) => console.log('Navigate to:', path);

export default function AdminTestEdit() {
    const { id } = useParams();
    const navigate = useNavigate()
    const [courseData, setCourseData] = useState([])
    const [moduleData, setModuleData] = useState([])
    const [quize, setQuize] = useState([])
    const [selectedQuestions, setSelectedQuestions] = useState([])
    const [selectedQuestionIds, setSelectedQuestionIds] = useState([])
    const [moduleId, setModuleId] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [selectedModule, setSelectedModule] = useState(null)
    const [selectedQuiz, setSelectedQuiz] = useState(null)
    const [loading, setLoading] = useState({
        courses: false,
        modules: false,
        quizzes: false,
        questions: false,
        test: false
    });
    const [form, setForm] = useState({
        isTelegram: true,
        isWeb: true,
        name: "",
        price: '',
        testCount: '',
        testTime: '',
    });

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const getTest = async () => {
        setLoading(prev => ({ ...prev, test: true }));
        try {
            const response = await axios.get(`/test/get/by/id`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                params: { id: id },
            });
            const testData = response.data.object;

            // Заполняем форму данными теста
            setForm({
                isTelegram: testData.isTelegram,
                isWeb: testData.isWeb,
                name: testData.name,
                price: testData.price.toString(),
                testCount: testData.testCount.toString(),
                testTime: testData.testTime.toString(),
            });

            // Устанавливаем выбранные вопросы
            if (testData.quiz && testData.quiz.length > 0) {
                setSelectedQuestionIds(testData.quiz);
                setSelectedQuestions(testData.quiz);
            }

        } catch (error) {
            console.log(error);
            if (error?.response?.status === 401) {
                navigate('/login')
                localStorage.clear()
            }
        } finally {
            setLoading(prev => ({ ...prev, test: false }));
        }
    };

    const getCourse = async () => {
        setLoading(prev => ({ ...prev, courses: true }));
        try {
            const response = await axios.get(`/course/get/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            setCourseData(response?.data?.object || [])
        } catch (error) {
            if (error?.response?.status === 401) {
                navigate('/login')
                localStorage.clear()
            }
        } finally {
            setLoading(prev => ({ ...prev, courses: false }));
        }
    }

    const GetModulesByCourse = async (courseId) => {
        setLoading(prev => ({ ...prev, modules: true }));
        try {
            const response = await axios.get(`/module/get`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    courseId: courseId
                }
            });
            const modules = Array.isArray(response?.data?.object) ? response.data.object : [];
            setModuleData(modules);
            setQuize([]);
        } catch (error) {
            console.error(error);
            setModuleData([]);
            if (error?.response?.status === 401) {
                navigate('/login')
                localStorage.clear()
            }
        } finally {
            setLoading(prev => ({ ...prev, modules: false }));
        }
    };

    const GetQuiz = async (moduleID) => {
        setModuleId(moduleID)
        setLoading(prev => ({ ...prev, quizzes: true }));
        try {
            const response = await axios.get(`/quiz/get/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    quizModuleId: moduleID
                }
            });
            const quiz = Array.isArray(response?.data?.object) ? response.data.object : [];
            setQuize(quiz);
        } catch (error) {
            console.error(error);
            setQuize([]);
            if (error?.response?.status === 401) {
                navigate('/login')
                localStorage.clear()
            }
        } finally {
            setLoading(prev => ({ ...prev, quizzes: false }));
        }
    };

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
        setSelectedModule(null);
        setSelectedQuiz(null);
        GetModulesByCourse(course.id);
    };

    const handleModuleClick = (module) => {
        setSelectedModule(module);
        setSelectedQuiz(null);
        GetQuiz(module.id);
    };

    const handleQuizClick = (quiz) => {
        setSelectedQuiz(quiz);
        setSelectedQuestionIds(prev => {
            if (prev.some(q => q.id === quiz.id)) {
                return prev.filter(q => q.id !== quiz.id);
            } else {
                return [...prev, quiz];
            }
        });
    };

    const handleQuestionClick = (question) => {
        setSelectedQuestionIds(prev => {
            if (prev.some(q => q.id === question.id)) {
                return prev.filter(q => q.id !== question.id);
            } else {
                return [...prev, question];
            }
        });
    };

    const updateTest = async () => {
        try {
            const testData = {
                id: id,
                isTelegram: form.isTelegram,
                isWeb: form.isWeb,
                name: form.name,
                price: parseInt(form.price),
                quizIds: selectedQuestionIds.map(q => q.id),
                testCount: parseInt(form.testCount),
                testTime: parseInt(form.testTime)
            };

            const response = await axios.put(`/test/update`, testData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
            });
            Swal.fire({
                title: 'Muvaffaqiyatli yangilandi!',
                icon: 'success',
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });
            navigate(-1);
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Error.',
                icon: 'error',
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });
            if (error?.response?.status === 401) {
                navigate('/login')
                localStorage.clear()
            }
        }
    };

    useEffect(() => {
        getCourse();
        if (id) {
            getTest();
        }
    }, [id])

    if (loading.test) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <ReactLoading
                    type="spinningBubbles"
                    color="#000"
                    height={100}
                    width={100}
                />
            </div>
        );
    }

    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-100 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 ">
                        {id ? "Testni tahrirlash" : "Test yaratish"}
                    </h1>
                    <Button
                        onClick={updateTest}
                        className="bg-green-500 hover:bg-green-600"
                        disabled={!form.name || selectedQuestionIds.length === 0}
                    >
                        {id ? "Testni yangilash" : "Test yaratish"} ({selectedQuestionIds.length} ta savol)
                    </Button>
                </div>
                <Card className="w-full mb-[20px] shadow-md">
                    <CardBody className="">
                        <div className="flex gap-4 ">
                            <Input
                                label="Nomi"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="flex-1 min-w-[200px]"
                            />

                            <Input
                                label="Narxi"
                                type="text"
                                value={form.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                                onChange={(e) =>
                                    handleChange("price", e.target.value.replace(/\s/g, ""))
                                }
                                className="flex-1 min-w-[200px]"
                            />

                            <Input
                                label="Test soni"
                                type="number"
                                value={form.testCount}
                                onChange={(e) => handleChange("testCount", e.target.value)}
                                className="flex-1 min-w-[200px]"
                            />

                            <Input
                                label="Test vaqti (daq)"
                                type="number"
                                value={form.testTime}
                                onChange={(e) => handleChange("testTime", e.target.value)}
                                className="flex-1 min-w-[200px]"
                            />

                            <div className="flex items-center gap-6">
                                <Checkbox
                                    label="Telegram"
                                    checked={form.isTelegram}
                                    onChange={(e) => handleChange("isTelegram", e.target.checked)}
                                />
                                <Checkbox
                                    label="Web"
                                    checked={form.isWeb}
                                    onChange={(e) => handleChange("isWeb", e.target.checked)}
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Колонка 1: Курсы */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                            Kurslar
                        </h2>
                        {loading.courses ? (
                            <div className="flex justify-center items-center py-8">
                                <ReactLoading type="spinningBubbles" color="#000" height={40} width={40} />
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {courseData.map((course) => (
                                    <div
                                        key={course.id}
                                        onClick={() => handleCourseClick(course)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedCourse?.id === course.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <h3 className="font-medium text-gray-900">{course.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                                    </div>
                                ))}
                                {courseData.length === 0 && (
                                    <p className="text-gray-500 text-center py-8">Kurs yo'q</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Колонка 2: Модули */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                            Modullar
                        </h2>
                        {!selectedCourse ? (
                            <p className="text-gray-500 text-center py-8">Kursni tanlang</p>
                        ) : loading.modules ? (
                            <div className="flex justify-center items-center py-8">
                                <ReactLoading type="spinningBubbles" color="#000" height={40} width={40} />
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {moduleData.map((module) => (
                                    <div
                                        key={module.id}
                                        onClick={() => handleModuleClick(module)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedModule?.id === module.id
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <h3 className="font-medium text-gray-900">{module.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                    </div>
                                ))}
                                {moduleData.length === 0 && (
                                    <p className="text-gray-500 text-center py-8">Modul yo'q</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                            Savollar
                        </h2>
                        {!selectedModule ? (
                            <p className="text-gray-500 text-center py-8">Modulni tanlang</p>
                        ) : loading.quizzes ? (
                            <div className="flex justify-center items-center py-8">
                                <ReactLoading type="spinningBubbles" color="#000" height={40} width={40} />
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {quize.map((quiz) => (
                                    <div
                                        key={quiz.id}
                                        onClick={() => handleQuizClick(quiz)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedQuestionIds.some(q => q.id === quiz.id)
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{quiz?.question}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{quiz.quizType}</p>
                                            </div>
                                            {selectedQuestionIds.some(q => q.id === quiz.id) && (
                                                <span className="text-green-600 font-bold text-lg">✓</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {quize.length === 0 && (
                                    <p className="text-gray-500 text-center py-8">Kviz yo'q</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Список выбранных вопросов */}
                {selectedQuestionIds.length > 0 && (
                    <Card className="w-full mt-6 shadow-md">
                        <CardBody>
                            <Typography variant="h6" className="mb-4">
                                Tanlangan savollar ({selectedQuestionIds.length} ta):
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                                {selectedQuestionIds.map((question, index) => (
                                    <div
                                        key={question.id}
                                        className="p-3 bg-gray-50 rounded-lg border cursor-pointer hover:bg-red-50"
                                        onClick={() => handleQuestionClick(question)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-medium text-gray-800 flex-1">
                                                {index + 1}. {question.question}
                                            </p>
                                            <button className="text-red-500 hover:text-red-700 ml-2">
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                )}

            </div>
        </div>
    )
}