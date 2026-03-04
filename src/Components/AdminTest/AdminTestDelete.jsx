import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
} from "@material-tailwind/react";
import Swal from 'sweetalert2';
import axios from "axios";

export default function AdminTestDelete({ id, refresh }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    const TestDelete = async () => {
        try {
            const response = await axios.delete(`/test/delete`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                params: {
                    id: id
                }
            })
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
            refresh()
            handleOpen()
        } catch (error) {
            console.log(error)
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
        }
    }

    return (
        <>
            {/* Btn to open modal */}
            <Button color="red" onClick={handleOpen}>
                Delete
            </Button>

            {/* Modal */}
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>
                    <Typography variant="h5" color="red">
                        O‘chirishni tasdiqlang
                    </Typography>
                </DialogHeader>
                <DialogBody divider>
                    <Typography color="blue-gray">
                        Siz rostdan ham ushbu testni o‘chirmoqchimisiz? Bu amalni qaytarib
                        bo‘lmaydi.
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="blue-gray"
                        onClick={handleOpen}
                        className="mr-2"
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        color="red"
                        onClick={TestDelete}
                    >
                        O‘chirish
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
