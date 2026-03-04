import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Button, Input, Select, Option, Textarea } from "@material-tailwind/react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";

export default function QuestionCreate() {
    const [questionOptions, setQuestionOptions] = useState([
        { text: "", correctAnswer: false },
        { text: "", correctAnswer: false },
        { text: "", correctAnswer: false },
        { text: "", correctAnswer: false },
    ]);
    const [selectedQuestionType, setSelectedQuestionType] = useState(null);
    const [image, setImage] = useState(null);
    const [audio, setAudio] = useState(null);
    const navigate = useNavigate();
    const { ID } = useParams();
    const [question, setQuestion] = useState('');
    const [file, setFile] = useState(null);
    const [fileId, setFileID] = useState();
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [correctAnswerAiDescription, setCorrectAnswerAiDescription] = useState('');

    const questionTypes = [
        { value: 'IMAGE_BASED', label: 'Image-Based' },
        { value: 'LISTENING', label: 'Listening' },
        { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
        { value: 'OPEN_ENDED', label: 'Open-Ended' },
    ];

    const handleAddInput = () => {
        setQuestionOptions([...questionOptions, { text: "", correctAnswer: false }]);
    };

    const handleRemoveInput = (index) => {
        const updatedOptions = questionOptions.filter((_, i) => i !== index);
        setQuestionOptions(updatedOptions);

        // If we remove the correct answer, reset currentAnswer
        if (questionOptions[index].correctAnswer) {
            setCurrentAnswer('');
        }
    };

    const handleInputChange = (e, index) => {
        const updatedOptions = [...questionOptions];
        updatedOptions[index].text = e.target.value;

        // Update currentAnswer if this option was the correct one
        if (updatedOptions[index].correctAnswer) {
            setCurrentAnswer(e.target.value);
        }

        setQuestionOptions(updatedOptions);
    };

    const handleCheckboxChange = (index) => {
        const updatedOptions = questionOptions.map((option, i) => ({
            ...option,
            correctAnswer: i === index
        }));

        // Set the current answer to the newly selected option
        setCurrentAnswer(questionOptions[index].text);
        setQuestionOptions(updatedOptions);
    };

    const handleOpenEndedAnswerChange = (e) => {
        setCurrentAnswer(e.target.value);
    };

    const handleQuestionEditorChange = (content, editor) => {
        setQuestion(content);
    };

  const handleCorrectAnswerAiDescriptionChange = (content) => {
    setCorrectAnswerAiDescription(content);
};
    const handleAudioChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudio(URL.createObjectURL(file));
            const uploadedImageId = await uploadFile(file);
            setFile(uploadedImageId);
        }
    };

    const handleImageChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setImage(URL.createObjectURL(selectedFile));
            const uploadedImageId = await uploadFile(selectedFile);
            setFileID(uploadedImageId);
        }
    };

    const triggerImageFileInput = () => {
        document.getElementById('image-upload-input').click();
    };

    const triggerAudioFileInput = () => {
        document.getElementById('audio-upload-input').click();
    };

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

    const CreateQuiz = async () => {
        // Validate that an answer is selected for non-AI types
        if (selectedQuestionType !== 'AI' && !currentAnswer) {
            Swal.fire({
                title: 'Error!',
                text: 'Select answer',
                icon: 'error',
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });
            return;
        }

        try {
            const newData = {
                question: question,
                quizType: selectedQuestionType,
                option: selectedQuestionType === 'OPEN_ENDED' || selectedQuestionType === 'AI' ? [] : questionOptions.map(option => option.text),
                correctAnswer: selectedQuestionType === 'OPEN_ENDED' ? currentAnswer.toLowerCase().replace(/\s/g, "") :
                    selectedQuestionType === 'AI' ? '' : currentAnswer,
                imageId: fileId || null,
                moduleId: Number(ID),
                audioId: file || null,
                createdBy: localStorage.getItem('userId'),
                correct_answer_ai_description: correctAnswerAiDescription
            };

            const response = await axios.post(`/quiz/create`, newData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            navigate(-1);
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
    };

    return (
        <div className="w-full h-screen  px-10 pb-10 mt-5  overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Savol yaratish</h2>
                    <div className="flex items-center gap-[10px]">
                        <Button
                            onClick={() => navigate(-1)}
                            color="gray"
                            variant="filled"
                            className=""
                        >
                            Back
                        </Button>
                        <Button
                            onClick={CreateQuiz}
                            color="green"
                            variant="filled"
                            className=""
                        >
                            Yaratish
                        </Button>
                    </div>
                </div>
                <div className="flex gap-[10px]">
                    <div className="mb-4 w-[75%] ">
                        <label className="block text-lg font-medium mb-2">Savol</label>
                        <Input
                            type="text"
                            label="Savol..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="mb-4 w-[25%]">
                        <label className="block text-lg font-medium mb-2">Savol turi</label>
                        <Select
                            label="Savol turi"
                            value={selectedQuestionType}
                            onChange={(e) => setSelectedQuestionType(e)}
                            className="w-full"
                        >
                            {questionTypes.map((type) => (
                                <Option key={type.value} value={type.value}>
                                    {type.label}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>


                {selectedQuestionType === "OPEN_ENDED" ? (
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
                ) : selectedQuestionType && selectedQuestionType !== "OPEN_ENDED" && selectedQuestionType !== "AI" ? (
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Variantlar</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {questionOptions.map((option, index) => (
                                <div key={index} className="flex items-center  mb-2">
                                    <Input
                                        type="text"
                                        label={`Variant ${index + 1}`}
                                        value={option.text}
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="mr-2 w-full"
                                    />
                                    <Button
                                        onClick={() => handleRemoveInput(index)}
                                        color="red"
                                        variant="filled"
                                        className="px-4 py-2 ml-2"
                                    >
                                        -
                                    </Button>
                                    <input
                                        type="checkbox"
                                        checked={option.correctAnswer}
                                        onChange={() => handleCheckboxChange(index)}
                                        className="ml-2"
                                    />
                                </div>
                            ))}
                        </div>
                        <Button
                            onClick={handleAddInput}
                            color="green"
                            variant="filled"
                            className="w-full px-4 py-2"
                        >
                            Variant qoshish
                        </Button>
                    </div>
                ) : null}

                {selectedQuestionType === 'IMAGE_BASED' && (
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Upload Image</label>
                        <Button
                            onClick={triggerImageFileInput}
                            color="blue"
                            variant="filled"
                            className="px-4 py-2"
                        >
                            Rasm
                        </Button>
                        <input
                            id="image-upload-input"
                            type="file"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {image && (
                            <div className="mt-4">
                                <p className="text-sm">Image Preview:</p>
                                <img src={image} alt="Image Preview" className="w-full h-auto" />
                            </div>
                        )}
                    </div>
                )}

                {selectedQuestionType === 'LISTENING' && (
                    <div className="mb-4">
                        <label className="block text-lg font-medium mb-2">Upload Audio</label>
                        <Button
                            onClick={triggerAudioFileInput}
                            color="blue"
                            variant="filled"
                            className="px-4 py-2"
                        >
                            Audio
                        </Button>
                        <input
                            id="audio-upload-input"
                            type="file"
                            onChange={handleAudioChange}
                            accept="audio/*"
                            className="hidden"
                        />
                        {audio && (
                            <div className="mt-4">
                                <p className="text-sm">Audio Preview:</p>
                                <audio controls>
                                    <source src={audio} type="audio/mp3" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}
                    </div>
                )}

            {selectedQuestionType && (
    <div className="mb-4">
        <label className="block text-lg font-medium mb-2">AI javob tavsifi</label>
        <ReactQuill
            theme="snow"
            value={correctAnswerAiDescription}
            onChange={handleCorrectAnswerAiDescriptionChange}
            style={{ height: '250px', marginBottom: '50px' }}
            modules={{
                toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                ],
            }}
        />
    </div>
)}


            </div>
        </div>
    );
}