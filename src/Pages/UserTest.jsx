import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";
import {
    Card,
    CardBody,
    Typography,
    Button,
} from "@material-tailwind/react";
import { NavLink } from "react-router-dom";

export default function UserTest() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const getAllTest = async () => {
        try {
            const response = await axios.get(`/test/get?isTelegram=true&isWeb=true`);
            setTests(response.data?.object || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getUser = async () => {
        try {
            const response = await axios.get(`/users/${localStorage.getItem("userId")}`);
            setUser(response.data?.object);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllTest();
        getUser();
    }, []);

    // narxni formatlash
    const formatPrice = (price) => {
        if (!price && price !== 0) return "";
        return new Intl.NumberFormat("uz-UZ").format(price);
    };

    const handleNotEnoughBalance = (balance, price) => {
        Swal.fire({
            icon: "warning",
            title: "Balans yetarli emas!",
            html: `
                <p>Sizning balansingiz: <b>${formatPrice(balance)} so‘m</b></p>
                <p>Test narxi: <b>${formatPrice(price)} so‘m</b></p>
                <p>Iltimos, Telegram bot orqali balansingizni to‘ldiring.</p>
            `,
            confirmButtonText: "Yopish",
            confirmButtonColor: "#3085d6",
        });
    };

    if (loading || !user) {
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
        <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-[32px] font-bold mb-6 text-center text-gray-800">
                Testlar ro‘yxati
            </h1>

            {tests.length === 0 ? (
                <Typography className="text-lg text-gray-600 text-center">
                    Hozircha testlar mavjud emas
                </Typography>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full">
                    {tests.map((test) => {
                        const canStart = user.balance >= test.price;
                        return (
                            <Card
                                key={test.id}
                                className="shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                            >
                                <CardBody className="text-center flex flex-col justify-between">
                                    <div>
                                        <Typography
                                            variant="h6"
                                            className="mb-3 font-bold text-gray-900 text-lg"
                                        >
                                            {test.name}
                                        </Typography>
                                        <Typography className="text-sm text-gray-700 mb-1">
                                            Vaqti: {test.testTime} daqiqa
                                        </Typography>

                                        <Typography className="text-sm text-gray-700 mb-1">
                                            Savollar soni: {test.testCount}
                                        </Typography>

                                        <Typography className="text-sm font-semibold text-gray-900">
                                            Narxi: {formatPrice(test.price)} so‘m
                                        </Typography>
                                    </div>

                                    {canStart ? (
                                        <NavLink
                                            to={`/home`}
                                            state={{ testID: test.id }}
                                        >
                                            <Button
                                                className="mt-4 w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4"
                                            >
                                                Boshlash
                                            </Button>
                                        </NavLink>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                handleNotEnoughBalance(user.balance, test.price)
                                            }
                                            className="mt-4 w-full rounded-xl bg-gray-400 text-white font-bold py-2 px-4 opacity-70 cursor-not-allowed"
                                        >
                                            Boshlash
                                        </Button>
                                    )}
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
