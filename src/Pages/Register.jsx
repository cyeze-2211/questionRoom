import React, { useState, useEffect } from 'react';
import { Button, Input } from '@material-tailwind/react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import WebApp from "@twa-dev/sdk";
import Swal from 'sweetalert2';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('+998-');
    const [password, setPassword] = useState('');
    const [chatId, setChatId] = useState(null);
    const navigate = useNavigate();
    const [data, setData] = useState()

    useEffect(() => {
        WebApp.ready();

        const data = WebApp.initDataUnsafe;
        const userIdValue = data?.user?.id || null;
        const chatIdValue = (data?.chat?.id ?? userIdValue) || null;

        setChatId(chatIdValue);

        if (chatIdValue) {
            localStorage.setItem('isTelegram', 'telegram');
        } else {
            localStorage.setItem('isTelegram', 'web');
        }
    }, []);

    const formatPhoneNumber = (value) => {
        // Убираем все нецифровые символы кроме +
        const numericValue = value.replace(/[^\d+]/g, '');

        // Если пользователь удалил +998, возвращаем его
        if (!numericValue.startsWith('+998')) {
            return '+998-';
        }

        // Извлекаем только цифры после +998
        const digits = numericValue.slice(4);

        let formatted = '+998-';

        if (digits.length > 0) {
            // Первые 2 цифры
            formatted += digits.slice(0, 2);

            if (digits.length > 2) {
                // Добавляем дефис и следующие 3 цифры
                formatted += '-' + digits.slice(2, 5);

                if (digits.length > 5) {
                    // Добавляем дефис и следующие 2 цифры
                    formatted += '-' + digits.slice(5, 7);

                    if (digits.length > 7) {
                        // Добавляем дефис и последние 2 цифры
                        formatted += '-' + digits.slice(7, 9);
                    }
                }
            }
        }

        return formatted;
    };

    const handlePhoneChange = (e) => {
        const input = e.target.value;
        const formatted = formatPhoneNumber(input);
        setPhoneNumber(formatted);
    };

    const handleRegister = async () => {
        try {
            // Удаляем дефисы из номера телефона для отправки на сервер
            const cleanPhoneNumber = phoneNumber.replace(/-/g, '');

            const payload = {
                accountType: "STUDENT",
                firstName,
                lastName,
                genderType: 'ERKAK',
                password: '12345678',
                telegramChatId: chatId,
                phoneNumber: cleanPhoneNumber
            };
            setData(payload)
            const response = await axios.post(`/users/admin`, payload);
            navigate('/login')
            Swal.fire({
                title: 'Muvaffaqiyatli!',
                icon: 'success',
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                title: 'Xatolik!',
                text: error.response?.data?.message || 'Error.',
                icon: 'error',
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });
        }
    };

    return (
        <div className="Login min-h-screen flex items-center justify-center relative">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#0000006d] z-40"></div>
            <div className="w-full max-w-md p-6 border-[2px] relative z-50 border-black bg-white rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-semibold text-center mb-6">Ro'yxatdan o'tish</h2>

                <div className="space-y-4">
                    <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        label="Ism"
                        color="gray"
                        type="text"
                        required
                        className="border-black"
                    />
                    <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        label="Familiya"
                        color="gray"
                        type="text"
                        required
                        className="border-black"
                    />
                    <Input
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        label="Telefon raqam"
                        color="gray"
                        type="text"
                        required
                        maxLength={17} // +998-97-020-68-68 = 17 символов
                        className="border-black"
                        placeholder="+998-97-020-68-68"
                    />

                    <Button
                        fullWidth
                        color="gray"
                        onClick={handleRegister}
                        className="bg-black text-white hover:bg-gray-800"
                    >
                        Saqlash
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Register;