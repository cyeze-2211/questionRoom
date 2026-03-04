import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
} from "@material-tailwind/react";

export default function FinishModal({ open, onClose, onConfirm }) {
    return (
        <Dialog
            open={open}
            handler={onClose}
            size="sm"
            className="rounded-xl sm:rounded-2xl shadow-xl mx-2 sm:mx-auto max-w-[calc(100vw-16px)] sm:max-w-none"
        >
            <DialogHeader className="text-lg sm:text-xl font-semibold text-gray-800 px-4 sm:px-6 py-3 sm:py-4">
                <span className="text-xl sm:text-2xl mr-2">❓</span>
                <span>Testni tugatmoqchimisiz?</span>
            </DialogHeader>

            <DialogBody 
                divider 
                className="text-gray-600 text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-4 leading-relaxed"
            >
                <p className="mb-2">
                    Siz testni tugatmoqchisiz.
                </p>
                <p>
                    Agar tasdiqlasangiz, javoblaringiz saqlanadi va qayta davom etolmaysiz.
                </p>
            </DialogBody>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4">
                <Button
                    variant="text"
                    color="blue-gray"
                    onClick={onClose}
                    className="rounded-lg w-full sm:w-auto text-sm sm:text-base py-2.5 sm:py-2"
                    size="md"
                >
                    Bekor qilish
                </Button>
                <Button
                    color="red"
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className="rounded-lg shadow-md w-full sm:w-auto text-sm sm:text-base py-2.5 sm:py-2"
                    size="md"
                >
                    Ha, tugataman
                </Button>
            </DialogFooter>
        </Dialog>
    );
}