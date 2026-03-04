import React, { useEffect, useState , useCallback  } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Button,
} from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import QuizDelete from "../Components/AdminQuiz/QuizDelete";
import QuestionEdit from "../Components/AdminQuiz/QuestionEdit";
import ReactLoading from "react-loading";

export default function AdminQuiz() {
    const navigate = useNavigate();
    const { ID } = useParams();
    const [loading, setLoading] = useState(true);
    const [deleteCourse, setDeleteCourse] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [quize, setQuize] = useState([]);
    const [itemsData, setItemsData] = useState(null);
    const [EditData, setEditData] = useState(null);
 const GetQuiz = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/quiz/get/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                params: { quizModuleId: ID },
            });
            const quiz = Array.isArray(response?.data?.object)
                ? response.data.object
                : [];
            setQuize(quiz);
        } catch (error) {
            console.error(error);
            setQuize([]);
            if (error?.status === 401) {
                navigate("/login");
                localStorage.clear();
            }
        } finally {
            setLoading(false);
        }
    }, [ID]);

    useEffect(() => {
        GetQuiz();
    }, [GetQuiz]);

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

    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-100 p-6 md:p-10">
            {/* Главная карточка */}
            <Card className="w-full shadow-lg mb-6">
                <CardHeader
                    floated={false}
                    shadow={false}
                    className="rounded-none flex justify-between items-center p-4 border-b"
                >
                    <Typography variant="h5" color="blue-gray">
                        Barcha savollar
                    </Typography>
                    <Button
                        onClick={() => navigate(`/admin/quiz/create/${ID}`)}
                        className="bg-[#272C4B] hover:bg-[#272c4be3]"
                    >
                        Savol yaratish
                    </Button>
                </CardHeader>

                <CardBody className="flex flex-col gap-4">
                    {quize && quize.length > 0 ? (
                        quize.map((course) => (
                            <Card
                                key={course.id}
                                className="w-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <CardBody className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div>
                                        <Typography
                                            variant="h6"
                                            color="blue-gray"
                                            className="mb-1"
                                        >
                                            {course.question}
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            color="gray"
                                        >
                                            Savol turi: {course.quizType}
                                        </Typography>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                setEditModal(true);
                                                setEditData(course);
                                            }}
                                            className="text-blue-600 text-[22px] hover:text-blue-800"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"></path></svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDeleteCourse(true);
                                                setItemsData(course?.id);
                                            }}
                                            className="text-red-600 text-[22px] hover:text-red-800"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path></svg>
                                        </button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-[200px]">
                            <Typography color="gray">Ma'lumot yo'q</Typography>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Модалки */}
         <QuizDelete
            refresh={GetQuiz}
            data={itemsData}
            isOpen={deleteCourse}
            onClose={() => setDeleteCourse(false)}
        />
            <QuestionEdit
            refresh={GetQuiz}
            data={EditData}
            isOpen={editModal}
            onClose={() => setEditModal(false)}
        />
        </div>
    );
}
