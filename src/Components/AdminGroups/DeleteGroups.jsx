import { useState } from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import axios from "axios";

export default function DeleteGroups({ groupId, onDeleted }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    const handleDelete = async () => {
        try {
            await axios.delete(`/group/delete?id=${groupId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            Swal.fire({
                title: "O‘chirildi!",
                text: "Guruh muvaffaqiyatli o‘chirildi.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: "top-end",
            });

            setOpen(false);
            if (onDeleted) onDeleted(groupId);
        } catch (error) {
            Swal.fire({
                title: "Xato!",
                text: "Guruhni o‘chirishda xatolik yuz berdi.",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
                toast: true,
                position: "top-end",
            });
        }
    };

    return (
        <>
            <Button
                className="w-full flex items-center justify-center"
                size="sm"
                onClick={handleOpen}
            >
                <svg
                    className="text-[20px]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"
                    ></path>
                </svg>
            </Button>

            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogHeader>
                    <Typography variant="h6" color="blue-gray">
                        Guruhni o‘chirish
                    </Typography>
                </DialogHeader>

                <DialogBody divider>
                    <Typography>
                        Siz rostdan ham ushbu guruhni o‘chirmoqchimisiz? Bu amal qaytarib
                        bo‘lmaydi.
                    </Typography>
                </DialogBody>

                <DialogFooter className="flex justify-end gap-2">
                    <Button
                        variant="text"
                        color="blue-gray"
                        onClick={handleOpen}
                        className="mr-2"
                    >
                        Bekor qilish
                    </Button>
                    <Button color="red" onClick={handleDelete}>
                        O‘chirish
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
