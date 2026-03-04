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

export default function EditGroups({ group, onUpdated }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(group?.name || "");
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
            Swal.fire("Xatolik!", "Rasm yuklanmadi", "error");
            return null;
        }
    };

    const handleSubmit = async () => {
        if (!name) {
            Swal.fire("Ogohlantirish", "Guruh nomini kiriting", "warning");
            return;
        }

        setLoading(true);
        try {
            let iconId = group.iconId; // eski rasm id
            if (file) {
                const uploadedId = await uploadFile(file);
                if (uploadedId) {
                    iconId = uploadedId;
                }
            }

            await axios.put(
                `/group/update`,
                { iconId, name, id: group?.id },
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
            handleOpen();
            if (onUpdated) onUpdated();
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
            <Button onClick={handleOpen} className="w-full flex items-center justify-center" size="sm" >
                <svg className="text-[20px]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"></path></svg>
            </Button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Guruhni tahrirlash</DialogHeader>
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
                        {group?.image && !file && (
                            <img
                                src={group.image}
                                alt="Old Icon"
                                className="w-32 h-32 object-cover rounded-md border"
                            />
                        )}
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
                        color="green"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Yangilanmoqda..." : "Yangilash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
