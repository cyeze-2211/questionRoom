import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import {
    Card,
    CardBody,
    Typography,
    Chip
} from "@material-tailwind/react";

export default function AdminTestView() {
    const { ID } = useParams();
    const [loading, setLoading] = useState(true);
    const [test, setTest] = useState(null);

    const getTest = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/test/get/by/id`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                params: { id: ID },
            });
            setTest(response.data.object);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTest();
    }, []);

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

    if (!test) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <Typography variant="h5">Test topilmadi</Typography>
            </div>
        );
    }

    return (
        <div className="p-10 space-y-6">
            {/* Информация о тесте */}
            <Card className="w-full shadow-lg">
                <CardBody>
                    <Typography variant="h4" className="mb-2">
                        {test.name}
                    </Typography>
                    <div className="flex flex-wrap gap-3">
                        <Chip value={`Narxi: ${test.price} so'm`} color="blue" />
                        <Chip value={`Vaqt: ${test.testTime} min`} color="green" />
                        <Chip value={`Savollar soni: ${test.testCount}`} color="purple" />
                        {test.isTelegram && <Chip value="Telegram" color="cyan" />}
                        {test.isWeb && <Chip value="Web" color="amber" />}
                    </div>
                </CardBody>
            </Card>

            {/* Вопросы */}
            <div className="space-y-4">
                {test.quiz?.map((q) => (
                    <Card key={q.id} className="w-full shadow-md">
                        <CardBody>
                            <Typography variant="h6" className="mb-1">
                                {q.question}
                            </Typography>
                            <Typography variant="small" color="gray">
                                Tip: {q.quizType}
                            </Typography>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}
