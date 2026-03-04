import { Button, Input } from '@material-tailwind/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function EditModule({ data, isOpen, onClose, refresh }) {
    const { ID } = useParams();
    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [iconId, setIconId] = useState('');
    const [iconFile, setIconFile] = useState(null);
    const [loading, setLoading] = useState(false); // <-- состояние загрузки

    useEffect(() => {
        if (data) {
            setName(data.name || '');
            setTime(data.testTimeMinute || '');
            setIconId(data.iconId || '');
        }
    }, [data]);

    const handleUploadIcon = async (file) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post("/file/upload", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
                params: {
                    category: 'quiz',
                    userId: localStorage.getItem('userId'),
                },
            });

            setIconId(res.data?.object?.id);
            Swal.fire({
                title: 'Ikonka yuklandi!',
                icon: 'success',
                toast: true,
                position: 'top-end',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Uploadda xatolik.',
                icon: 'error',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIconFile(file);
            handleUploadIcon(file);
        }
    };

    const editModule = async () => {
        setLoading(true);
        try {
            await axios.put(`/module/update`, {
                id: data.id,
                name: name,
                testTimeMinute: time,
                courseId: ID,
                iconId: iconId,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            onClose();
            Swal.fire({
                title: 'Muvaffaqiyatli!',
                icon: 'success',
                position: 'top-end',
                timer: 3000,
                toast: true,
                showConfirmButton: false,
            });
            refresh();
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Error.',
                icon: 'error',
                position: 'top-end',
                timer: 3000,
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
                        <h1 className="text-[#272C4B] text-[22px]">Modul o‘zgartirish</h1>
                        <button onClick={onClose}>
                            <svg className='text-[#5E5C5A] text-[13px]' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14">
                                <path fill="currentColor" fillRule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clipRule="evenodd" />
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
                            disabled={loading}
                        />
                        {/* Ikonka yuklash */}
                        <div className="mt-[20px]">
                            <label className="block text-sm text-gray-700 mb-2">Modul ikonkasi</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
                        </div>

                        <Button
                            onClick={editModule}
                            fullWidth
                            color="gray"
                            className="bg-[#272C4B] mt-[20px] text-white hover:bg-gray-800 flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                            ) : (
                                "O‘zgartirish"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
