import axios from "axios";
import Header from "../Components/User/Header";
import WarningModal from "../Components/WarningModal";
import { useEffect, useState } from "react";
import QuizCard from "../Components/User/QuizCard";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";
import FinishModal from "../Components/FinishModal";

export default function Home() {
    const location = useLocation();
    const Device = localStorage.getItem('isTelegram')
    const activeTestId = location.state?.testID || localStorage.getItem("testId");
    const [startExam, setStartExam] = useState(false);
    const [hasShownModal, setHasShownModal] = useState(false);
    const [Test, setTest] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [openEndedAnswers, setOpenEndedAnswers] = useState({});
    const [shuffledQuizData, setShuffledQuizData] = useState([]);
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);


    const getTest = async () => {
        try {
            const response = await axios.get(`/test/get/by/id/for/test`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                params: { id: activeTestId },
            });

            const test = response?.data?.object;
            setTest(test);

            const seconds = (test?.testTime || 0) * 60;
            setTimeLeft(seconds); // Устанавливаем время, но не запускаем таймер

            setTotalQuestions(Math.min(test?.quiz?.length || 0, 30));
            setIncorrectAnswers(Math.min(test?.quiz?.length || 0, 30));
        } catch (error) {
            console.log(error);
            if (error?.status === 401) {
                navigate("/login");
                localStorage.clear();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleScoreUpdate = (correct, incorrect) => {
        setCorrectAnswers(correct);
        setIncorrectAnswers(incorrect);
    };

    const handleQuizDataUpdate = (selectedOpts, openEndedAns, shuffledData) => {
        setSelectedOptions(selectedOpts);
        setOpenEndedAnswers(openEndedAns);
        setShuffledQuizData(shuffledData);
    };

    // Загружаем тест при монтировании компонента
    useEffect(() => {
        getTest();
    }, []);

    // Запускаем таймер только после подтверждения модального окна
    useEffect(() => {
        if (!startExam || timeLeft === null || timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    handleFinishTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, startExam, navigate]);

    const handleFinishTest = async () => {
        try {
            const studentId = localStorage.getItem('userId');

            // Подготавливаем данные для отправки
            const correctAnswerQuizIds = [];
            const wrongAnswerQuizIds = [];


            // Используем Test?.quiz если shuffledQuizData пустой
            const quizDataToUse = shuffledQuizData.length > 0 ? shuffledQuizData : (Test?.quiz || []).slice(0, 30);


            // Проходим по всем вопросам теста
            quizDataToUse.forEach(question => {
                if (question.quizType === 'OPEN_ENDED') {
                    // Для открытых вопросов
                    const userAnswer = openEndedAnswers[question.id];

                    // Проверяем, был ли дан ответ
                    if (!userAnswer || userAnswer.trim() === '') {
                        // Вопрос не был отвечан
                        wrongAnswerQuizIds.push({
                            quizId: question.id,
                            wrongAnswer: ""
                        });
                    } else {
                        // Вопрос был отвечан, проверяем правильность
                        const normalizedUserAnswer = userAnswer.toLowerCase().replace(/\s/g, "");
                        const normalizedCorrectAnswer = question.correctAnswer.toLowerCase().replace(/\s/g, "");

                        if (normalizedUserAnswer === normalizedCorrectAnswer) {
                            correctAnswerQuizIds.push(question.id);
                        } else {
                            wrongAnswerQuizIds.push({
                                quizId: question.id,
                                wrongAnswer: userAnswer
                            });
                        }
                    }
                } else {
                    // Для вопросов с множественным выбором
                    const userAnswer = selectedOptions[question.id];

                    // Проверяем, был ли выбран ответ
                    if (!userAnswer || userAnswer === undefined) {
                        // Вопрос не был отвечан
                        wrongAnswerQuizIds.push({
                            quizId: question.id,
                            wrongAnswer: ""
                        });
                    } else {
                        // Вопрос был отвечан, проверяем правильность
                        if (userAnswer === question.correctAnswer) {
                            correctAnswerQuizIds.push(question.id);
                        } else {
                            wrongAnswerQuizIds.push({
                                quizId: question.id,
                                wrongAnswer: userAnswer
                            });
                        }
                    }
                }
            });

            const requestData = {
                correctAnswerCount: correctAnswerQuizIds.length,
                correctAnswerQuizIds: correctAnswerQuizIds,
                wrongAnswerCount: wrongAnswerQuizIds.length,
                wrongAnswerQuizIds: wrongAnswerQuizIds,
                studentId: parseInt(studentId),
                testId: parseInt(activeTestId),
                isTelegram: Device === 'telegram' ? true : false,
                isWeb: Device === 'telegram' ? false : true
            };
            // Отправляем результаты на сервер
            const response = await axios.post('/result/create', requestData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            Swal.fire({
                title: "Test tugadi!",
                text: "Natijangiz saqlandi.",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                if (Device === "telegram") {
                    navigate("/result");
                } else {
                    navigate(`/result/${response?.data?.object?.id}`);
                }
            });


        } catch (error) {
            console.error('Xatolik test natijalarini yuborishda:', error);
            Swal.fire({
                title: "Xatolik",
                text: "Natijalarni saqlashda xatolik yuz berdi.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    if (loading) {
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

    // Показываем модальное окно после загрузки теста, но до начала экзамена
    if (!hasShownModal && Test) {
        return (
            <WarningModal
                data={Test}
                startExam={() => {
                    setStartExam(true);
                    setHasShownModal(true);
                }}
            />
        );
    }

    if (Test === null) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-100 p-6">
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                        Test yakunlandi
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Siz testni muvaffaqiyatli tugatdingiz. Iltimos, qaytadan tizimga
                        kirish uchun login sahifasiga o‘ting.
                    </p>
                    <NavLink
                        to="/login"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                    >
                        Loginga qaytish
                    </NavLink>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-[50px] relative h-full bg-cover bg-center bg-no-repeat">
            <Header setOpenModal={setOpenModal} timeLeft={timeLeft} />
            <QuizCard
                quizData={Test?.quiz}
                onScoreUpdate={handleScoreUpdate}
                onQuizDataUpdate={handleQuizDataUpdate}
                testTime={Test?.testTime}
                correctAnswers={correctAnswers}
                incorrectAnswers={incorrectAnswers}
                totalQuestions={totalQuestions}
            />
            <FinishModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={handleFinishTest}
            />
        </div>
    );
}