import { Button, Input } from '@material-tailwind/react';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function CreateCourse({ isOpen, onClose, refresh }) {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const uploadFile = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(`/file/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
                params: {
                    category: 'quiz',
                    userId: localStorage.getItem('userId'),
                },
            });

            return response?.data?.object?.id;
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "Failed to upload the file.",
                icon: "error",
                position: "top-end",
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });
            return null;
        }
    };

    const handleCreateCourse = async () => {
        try {
            setLoading(true); // включаем загрузку

            let iconId = null;
            if (file) {
                iconId = await uploadFile(file);
                if (!iconId) {
                    setLoading(false);
                    return;
                }
            }

            const newData = {
                name: name,
                iconId: iconId,
            };

            await axios.post('course/create', newData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            refresh();
            setName('');
            setFile(null);
            onClose();
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
        } finally {
            setLoading(false); // выключаем загрузку
        }
    };

    return (
        <div className={`modal2 ${isOpen ? "open" : ""}`} onClick={onClose}>
            <div className={`Modal2Content ${isOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
                <div className='p-[10px] pb-[30px]'>
                    <div className='flex items-center justify-between pr-[10px] pb-[15px]'>
                        <h1 className="text-[#272C4B] text-[22px]">
                            Kurs yaratish
                        </h1>
                        <button onClick={onClose}>
                            <svg className='text-[#5E5C5A] text-[13px]' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14">
                                <path fill="currentColor" fillRule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    <div>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            label="Kurs nomi"
                            color="gray"
                            type="text"
                            required
                            className="border-black"
                        />

                        {/* File input */}
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="mt-4"
                        />

                        <Button
                            onClick={handleCreateCourse}
                            fullWidth
                            color="gray"
                            disabled={loading} // блокируем кнопку
                            className={`bg-[#272C4B] mt-[20px] text-white hover:bg-gray-800 flex items-center justify-center`}
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    ></path>
                                </svg>
                            ) : (
                                "Yaratish"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
