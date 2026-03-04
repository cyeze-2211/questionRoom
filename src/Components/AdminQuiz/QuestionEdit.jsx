import { Button, Input } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


export default function QuestionEdit({ isOpen, onClose, data , refresh  }) {

    const [question, setQuestion] = useState('')
    const [questionOptions, setQuestionOptions] = useState([]) // Now just an array of strings
    const [currentAnswer, setCurrentAnswer] = useState('')

    console.log(data)

    useEffect(() => {
        setQuestion(data?.question || '')
        setQuestionOptions(data?.option || []) // Assuming `options` is an array of strings
        setCurrentAnswer(data?.correctAnswer || '')
    }, [data])



    const handleCheckboxChange = (index) => {
        const selectedOption = questionOptions[index]; // Get the selected option
        setCurrentAnswer(selectedOption); // Update the current answer
    };

    const handleInputChange = (e, index) => {
        const updatedOptions = [...questionOptions];
        updatedOptions[index] = e.target.value;
        setQuestionOptions(updatedOptions);
    }
    const handleOpenEndedAnswerChange = (e) => {
        setCurrentAnswer(e.target.value);
    };



    const EditQuestion = async () => {
        try {
            const editData = {
    audioId: data?.audioId,
    correctAnswer: data?.quizType === "OPEN_ENDED" 
        ? currentAnswer.toLowerCase().replace(/\s/g, "") 
        : currentAnswer,
    createdBy: localStorage.getItem('userId'),
    id: data?.id,
    imageId: data?.imageId,
    moduleId: data?.moduleId,
    option: questionOptions,
    question: question,
    quizType: data?.quizType
}
            await axios.put(`/quiz/update`, editData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            onClose()
             refresh?.();
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
        }
    }

    return (
        <div className={`modal2 ${isOpen ? "open" : ""}`} onClick={onClose}>
            <div className={`Modal2Content ${isOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
                <div className='p-[10px] pb-[30px]'>
                    <div className='flex items-center justify-between p-[10px] pb-[15px]'>
                        <h2>
                            Savol o'zgartirish
                        </h2>
                        <button onClick={onClose}>
                            <svg className='text-[#5E5C5A] text-[10px]' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14">
                                <path fill="currentColor" fillRule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    <div>
                        <div className="mb-4">
                            <label className="block text-lg font-medium mb-2">Savol</label>
                            <Input
                                type="text"
                                label="Savol..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        {data?.quizType === "OPEN_ENDED" ? (
                            <div className="mb-4">
                                <label className="block text-lg font-medium mb-2">Javob</label>
                                <Input
                                    type="text"
                                    label="Javob"
                                    value={currentAnswer}
                                    onChange={handleOpenEndedAnswerChange}
                                    className="w-full"
                                />
                            </div>
                        ) : (
                            <div className="mb-4">
                                <label className="block text-lg font-medium mb-2">Variantlar</label>
                                {questionOptions?.map((option, index) => (
                                    <div key={index} className="flex items-center mb-4">
                                        <Input
                                            type="text"
                                            label={`Variant ${index + 1}`}
                                            value={option} // Just the option value now
                                            onChange={(e) => handleInputChange(e, index)}
                                            className="mr-2 w-full"
                                        />
                                        <input
                                            type="checkbox"
                                            checked={option === currentAnswer} // Check if this option is the selected one
                                            onChange={() => handleCheckboxChange(index)} // Select this option
                                            className="ml-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        <Button onClick={EditQuestion}>
                            O'zgartirish
                        </Button>
                    </div>
                </div>
            </div >
        </div >
    )
}
