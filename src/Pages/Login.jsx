import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Typography } from '@material-tailwind/react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import ReactLoading from "react-loading";
import WebApp from "@twa-dev/sdk";
import Swal from 'sweetalert2';

// Константы для ролей и статусов
const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

const ROLE_KEYS = {
  ADMIN: 'DQWIJDWIOEFAD',
  USER: 'FWENFDEWST'
};

const STORAGE_KEYS = {
  TOKEN: 'token',
  TEST_ID: 'testId',
  USER_ID: 'userId',
  ROLE: 'role',
  IS_TELEGRAM: 'isTelegram'
};

const PLATFORM = {
  TELEGRAM: 'telegram',
  WEB: 'web'
};

const Login = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTelegramLogin, setIsTelegramLogin] = useState(false);

  const navigate = useNavigate();

  // Инициализация Telegram WebApp
  useEffect(() => {
    const initializeTelegram = () => {
      try {
        WebApp.ready();
        const data = WebApp.initDataUnsafe;
        const userIdValue = data?.user?.id || null;
        const chatIdValue = (data?.chat?.id ?? userIdValue) || null;

        setChatId(chatIdValue);

        const platform = chatIdValue ? PLATFORM.TELEGRAM : PLATFORM.WEB;
        localStorage.setItem(STORAGE_KEYS.IS_TELEGRAM, platform);

        if (chatIdValue) {
          setIsTelegramLogin(true);
        }
      } catch (error) {
        console.error('Telegram WebApp initialization failed:', error);
        localStorage.setItem(STORAGE_KEYS.IS_TELEGRAM, PLATFORM.WEB);
      }
    };

    initializeTelegram();
  }, []);

  // Форматирование номера телефона
  const formatPhoneNumber = useCallback((input) => {
    const numericValue = input.replace(/\D/g, '');
    let formattedValue = '+998';

    if (numericValue.startsWith('998')) {
      formattedValue += numericValue.slice(3, 12);
    } else {
      formattedValue += numericValue.slice(0, 9);
    }

    return formattedValue;
  }, []);

  // Обновление полей формы
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'login' ? formatPhoneNumber(value) : value
    }));
  }, [formatPhoneNumber]);

  // Сохранение данных пользователя в localStorage
  const saveUserData = useCallback((userData) => {
    const { token, object } = userData;

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.TEST_ID, object.testId);
    localStorage.setItem(STORAGE_KEYS.USER_ID, object.id);

    const roleKey = object.accountType === ROLES.ADMIN
      ? ROLE_KEYS.ADMIN
      : ROLE_KEYS.USER;
    localStorage.setItem(STORAGE_KEYS.ROLE, roleKey);
  }, []);

  // Навигация в зависимости от роли
  const navigateByRole = useCallback((role) => {
    let route;

    if (role === ROLES.ADMIN) {
      route = '/admin/course';
    } else {
      // Для обычных пользователей проверяем платформу
      const platform = localStorage.getItem(STORAGE_KEYS.IS_TELEGRAM);
      route = platform === PLATFORM.TELEGRAM ? '/user/tests' : '/home';
    }

    navigate(route);
  }, [navigate]);

  // Показ уведомлений
  const showNotification = useCallback((type, title, text = '') => {
    const config = {
      title,
      text,
      icon: type,
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showCloseButton: true,
      toast: true,
      showConfirmButton: false,
    };

    Swal.fire(config);
  }, []);
  const performLogin = useCallback(async (loginData) => {
    try {
      const response = await axios.post('/auth/login', {}, {
        params: loginData
      });
      if (response?.data?.code === 200) {
        saveUserData(response.data);
        navigateByRole(response.data.object.accountType);
        showNotification('success', 'Muvaffaqiyatli!');
        return true;
      } else {
        showNotification('error', 'Error!', response?.data?.message || 'Error.');
        return false;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Tizimda xatolik yuz berdi.';
      showNotification('error', 'Error!', errorMessage);
      return false;
    }
  }, [saveUserData, navigateByRole, showNotification]);

  // Обработчик обычного логина
  const handleLogin = useCallback(async () => {
    if (!formData.login || !formData.password) {
      showNotification('error', 'Error!', 'Barcha maydonlarni to\'ldiring.');
      return;
    }

    setIsLoading(true);
    try {
      await performLogin({
        login: formData.login,
        password: formData.password
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, performLogin, showNotification]);

  // Telegram автологин
  const handleTelegramLogin = useCallback(async () => {
    if (!chatId) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`/users/telegram/id?telegramId=${chatId}`);
      if (response?.data?.object?.user?.phoneNumber) {
        const success = await performLogin({
          login: response.data.object.user.phoneNumber,
          password: '12345678'
        });

        if (!success) {
          setIsTelegramLogin(false);
        }
      } else {
        setIsTelegramLogin(false);
        navigate('/register')
        // showNotification('error', 'Error!', 'Telegram akkaunt topilmadi.');
      }
    } catch (error) {
      console.error('Telegram login error:', error);
      setIsTelegramLogin(false);
      showNotification('error', 'Error!', 'Telegram orqali kirish amalga oshmadi.');
    } finally {
      setIsLoading(false);
    }
  }, [chatId, performLogin, showNotification]);

  // Автоматический Telegram логин
  useEffect(() => {
    if (chatId && isTelegramLogin) {
      handleTelegramLogin();
    }
  }, [chatId, isTelegramLogin, handleTelegramLogin]);

  // Обработчик нажатия Enter
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  }, [handleLogin, isLoading]);

  if (isTelegramLogin && isLoading) {
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
    <div className="Login min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-black bg-opacity-40 z-40"></div>

      <div className="w-full max-w-md p-6 border-2 relative z-50 border-black bg-white rounded-lg shadow-lg">
        <Typography variant="h4" className="text-center mb-6 font-semibold">
          Kirish {chatId}
        </Typography>

        <div className="space-y-4" onKeyPress={handleKeyPress}>
          <Input
            value={formData.login}
            onChange={(e) => handleInputChange('login', e.target.value)}
            label="Telefon raqam"
            color="gray"
            type="tel"
            required
            disabled={isLoading}
            className="border-black"
            maxLength={13}
            placeholder="+998901234567"
          />

          <Input
            label="Parol"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            color="gray"
            type="password"
            required
            disabled={isLoading}
            className="border-black"
            minLength={6}
          />

          <Button
            fullWidth
            color="gray"
            onClick={handleLogin}
            disabled={isLoading || !formData.login || !formData.password}
            className="bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Yuklanmoqda...
              </div>
            ) : (
              'Kirish'
            )}
          </Button>
          <div className="text-center mt-5">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;