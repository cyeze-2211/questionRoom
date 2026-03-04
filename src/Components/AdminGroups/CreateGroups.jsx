import { useState } from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Input,
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import axios from "axios";

export default function CreateGroups({ refresh }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(!open);

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
                    category: "quiz",
                    userId: localStorage.getItem("userId"),
                },
            });

            return response?.data?.object?.id;
        } catch (error) {
            Swal.fire({
                title: "Xatolik!",
                text: "Rasm yuklashda muammo bo‘ldi.",
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

    const handleSubmit = async () => {
        if (!name) {
            Swal.fire("Ogohlantirish", "Guruh nomini kiriting", "warning");
            return;
        }
        if (!file) {
            Swal.fire("Ogohlantirish", "Rasm tanlang", "warning");
            return;
        }

        setLoading(true);
        try {
            const iconId = await uploadFile(file);
            if (!iconId) return;

            await axios.post(
                `/group/create`,
                { iconId, name },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

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
            setName("");
            setFile(null);
            handleOpen();

            if (refresh) refresh();
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
        <>
            <button
                onClick={handleOpen}
                className="bg-[#272C4B] text-white py-2 px-6 rounded-md text-sm font-medium transition-all hover:bg-[#272c4be3]"
            >
                Yaratish
            </button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Yangi guruh yaratish</DialogHeader>
                <DialogBody divider>
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Guruh nomi"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-500 
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-[#272C4B] file:text-white
              hover:file:bg-[#272c4be3]"
                        />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-2"
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Yaratilmoqda..." : "Yaratish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
