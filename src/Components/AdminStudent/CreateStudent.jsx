import { Button, Input, Select, Option, Textarea } from '@material-tailwind/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Select2 from 'react-select';

export default function CreateStudent({ isOpen, onClose, refresh }) {
    const [courseId, setCourseId] = useState(null);
    const [courseData, setCourseData] = useState([]);
    const [dataBirth, setDataBirth] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState();
    const [gender, setGender] = useState(null);
    const [Group, setGroup] = useState(null);
    const [school, setSchool] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState(''); // Add address state

    const resetForm = () => {
        setLastName('');
        setFirstName('');
        setDataBirth('');
        setPassword('');
        setCourseId(null);
        setGroup('');
        setGender(null);
        setSchool('');
        setPhoneNumber('');
        setEmail('');
        setAddress(''); // Reset address field
    };

    const getCourse = async () => {
        try {
            const response = await axios.get('/course/get/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const courses = Array.isArray(response?.data?.object) ? response.data.object : [];
            setCourseData(courses);
        } catch (error) {
            console.error(error);
            setCourseData([]);
        }
    };

    useEffect(() => {
        if (isOpen) {
            getCourse();
        }
    }, [isOpen]);

    const createStudent = async () => {
        if (!courseId) {
            return Swal.fire({
                title: 'Error!',
                text: "Kurs tanlanmagan",
                icon: 'error',
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });
        }
        try {
            const newData = {
                accountType: 'STUDENT',
                courseId: courseId?.value,
                creatorId: localStorage.getItem('userId'),
                dateBirth: dataBirth,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                password: password,
                gender: gender,
                group: String(Group),
                email: email,
                school: school,
                address: address, // Include address field
            };
            const response = await axios.post('/users/admin', newData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            getCourse();
            onClose();
            resetForm();
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
        }
    };

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const handleSelectChange = (selectedOption) => {
        setCourseId(selectedOption)
    };

    const courseOptions = courseData.map(course => ({
        value: course.id,
        label: course.name
    }));

    return (
        <div className={`modal2 ${isOpen ? "open" : ""}`} onClick={onClose}>
            <div className={`Modal2Content ${isOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
                <div className='p-[10px] pb-[30px]'>
                    <div className='flex items-center justify-between pr-[10px] pb-[15px]'>
                        <h1 className="text-[#272C4B] text-[22px]">Talaba yaratish</h1>
                        <button onClick={onClose}>
                            <svg className='text-[#5E5C5A] text-[13px]' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14">
                                <path fill="currentColor" fillRule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    <div>
                        <div className='flex items-center justify-between gap-[10px]'>
                            <Input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                label="Ism"
                                color="gray"
                                type="text"
                                required
                                className="border-black"
                            />
                            <Input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                label="Familiya"
                                color="gray"
                                type="text"
                                required
                                className="border-black"
                            />
                        </div>
                        <div className='mt-[20px]'>
                            <Select2
                                options={courseOptions}
                                onChange={handleSelectChange}
                                value={courseId}
                                placeholder="Kursni tanlang"
                                isClearable
                            />
                        </div>
                        <div className='flex items-center gap-[10px]'>
                            <div className='mt-[20px] w-full'>
                                <Input
                                    value={dataBirth}
                                    onChange={(e) => setDataBirth(e.target.value)}
                                    label="Tug'ilgan sana"
                                    color="gray"
                                    type="date"
                                    required
                                    className="border-black"
                                />
                            </div>
                            <div className='mt-[20px] w-full'>
                                <Select
                                    className="bg-[white]"
                                    label="Jinsi"
                                    value={gender}
                                    onChange={(value) => setGender(value)}
                                >
                                    <Option key="male" value="ERKAK">
                                        Erkak
                                    </Option>
                                    <Option key="female" value="AYOL">
                                        Ayol
                                    </Option>
                                </Select>
                            </div>
                        </div>
                        <div className='flex items-center gap-[10px]'>
                            <div className='mt-[20px] w-full'>
                                <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    label="Parol"
                                    color="gray"
                                    type="text"
                                    required
                                    className="border-black"
                                />
                            </div>
                            <div className='mt-[20px] w-full'>
                                <Input
                                    value={Group}
                                    onChange={(e) => setGroup(e.target.value)}
                                    label="Sinif"
                                    color="gray"
                                    type="number"
                                    required
                                    className="border-black"
                                />
                            </div>
                        </div>
                        <div className='flex items-center gap-[10px]'>
                            <div className='mt-[20px] w-full'>
                                <Input
                                    value={school}
                                    onChange={(e) => setSchool(e.target.value)}
                                    label="Maktab"
                                    color="gray"
                                    type="text"
                                    required
                                    className="border-black"
                                />
                            </div>
                            <div className='mt-[20px] w-full'>
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    label="Email"
                                    color="gray"
                                    type="text"
                                    required
                                    className="border-black"
                                />
                            </div>
                        </div>
                        <div className='mt-[20px]'>
                            <Input
                                value={phoneNumber}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    const numericValue = input.replace(/\D/g, "");
                                    let formattedValue = "+998";
                                    if (numericValue.startsWith("998")) {
                                        formattedValue += numericValue.slice(3, 12);
                                    } else {
                                        formattedValue += numericValue.slice(0, 9);
                                    }
                                    setPhoneNumber(formattedValue);
                                }}
                                label="Telefon raqam"
                                color="gray"
                                type="text"
                                required
                                className="border-black"
                                maxLength={13}
                            />
                        </div>
                        <div className='mt-[20px]'>
                            <Textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                label="Manzil"
                                color="gray"
                                required
                                className="border-black"
                            />
                        </div>
                    </div>
                    <div className='flex justify-center mt-[20px]'>
                        <Button
                            onClick={createStudent}
                            fullWidth
                            color="gray"
                            className="bg-[#272C4B] mt-[20px] text-white hover:bg-gray-800"
                        >
                            Yaratish
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
