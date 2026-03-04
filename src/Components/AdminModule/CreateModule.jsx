import { Button, Input } from '@material-tailwind/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function CreateModule({ refresh, isOpen, onClose }) {
    const { ID } = useParams();
    const [name, setName] = useState('');
    const [sort, setSort] = useState('');
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

            return response?.data?.object.id;
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

    const createModule = async () => {
        try {
            setLoading(true);

            let iconId = null;
            if (file) {
                const uploadedId = await uploadFile(file);
                if (uploadedId) iconId = uploadedId;
            }

            const newData = {
                name: name,
                courseId: ID,
                iconId: iconId,
                sort: sort
            };

            await axios.post(`/module/create`, newData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            onClose();
            setName('');
            setSort('');
            setFile(null);
            refresh();
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
            setLoading(false);
        }
    };

    return (
        <div className={`modal2 ${isOpen ? "open" : ""}`} onClick={onClose}>
            <div className={`Modal2Content ${isOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
                <div className='p-[10px] pb-[30px]'>
                    <div className='flex items-center justify-between pr-[10px] pb-[15px]'>
                        <h1 className="text-[#272C4B] text-[22px]">
                            Modul yaratish
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
                            label="Modul nomi"
                            color="gray"
                            type="text"
                            required
                            className="border-black"
                        />

                        <div className='mt-[20px]'>
                            <Input
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                label="Sort"
                                color="gray"
                                type="number"
                                required
                                className="border-black"
                            />
                        </div>

                        <div className='mt-[20px]'>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <Button
                            onClick={createModule}
                            fullWidth
                            disabled={loading}
                            color="gray"
                            className={`bg-[#272C4B] mt-[20px] text-white hover:bg-gray-800 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Yuklanmoqda..." : "Yaratish"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
