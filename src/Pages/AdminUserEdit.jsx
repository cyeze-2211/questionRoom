import { useEffect, useState } from "react";
import { Input, Button, Card, CardBody, Typography } from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminUserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: id,
        accountType: "STUDENT",
        address: "",
        addressDistrict: "",
        addressMfy: "",
        addressRegion: "",
        balance: null,
        creatorId: localStorage.getItem("userId"),
        dateBirth: "",
        email: "",
        firstName: "",
        lastName: "",
        genderType: "",
        groupId: null,
        password: "",
        phoneNumber: "",
        school: "",
        schoolClass: "",
        telegramChatId: null,
        testId: null,
    });

    const [groups, setGroups] = useState([]);
    const [tests, setTests] = useState([]);

    // --- Get One User ---
    const getUser = async () => {
    try {
        const res = await axios.get(`/users/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const user = res.data?.object || {};
        const { 
            password, authorities, enabled, 
            accountNonExpired, accountNonLocked, 
            credentialsNonExpired, username,
            createdAt, createdBy, deleted,
            ...safeUser 
        } = user;

        setFormData((prev) => ({
            ...prev,
            ...safeUser,
            password: "",
        }));
    } catch (err) {
        console.error("Error fetching user:", err);
    }
};


    const getAllGroups = async () => {
        try {
            const response = await axios.get("/group/get/all", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setGroups(response?.data?.object || []);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    const getAllTest = async () => {
        try {
            const response = await axios.get("/test/get?isTelegram=true&isWeb=true", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTests(response?.data?.object || []);
        } catch (error) {
            console.error("Error fetching tests:", error);
        }
    };

    useEffect(() => {
        getUser();
        getAllGroups();
        getAllTest();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = async () => {
         try {
        const submitData = {
            ...formData,
            ...(formData.password ? {} : { password: undefined }),
        };

        await axios.put(`/users/edit`, submitData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
            Swal.fire({
                title: "Muvaffaqiyatli yangilandi!",
                icon: "success",
                position: "top-end",
                timer: 3000,
                toast: true,
                showConfirmButton: false,
            });
            navigate(-1);
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Xatolik!",
                text: err.response?.data?.message || "Error.",
                icon: "error",
                position: "top-end",
                timer: 3000,
                toast: true,
                showConfirmButton: false,
            });
        }
    };

    return (
        <div className="mx-auto p-10">
            <div className="flex items-center justify-between mb-6">
                <Typography variant="h4" color="blue-gray" className="font-bold">
                    Foydalanuvchini tahrirlash
                </Typography>
                <Button color="blue" onClick={handleSubmit} className="px-6 py-2 rounded-lg">
                    Saqlash
                </Button>
            </div>

            <Card shadow={true} className="p-4">
                <CardBody className="space-y-8">
                    {/* Shaxsiy ma'lumotlar */}
                    <div>
                        <Typography variant="h6" className="mb-4 text-blue-600">
                            Shaxsiy ma'lumotlar
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label={<>Ism <span className="text-red-500">*</span></>} name="firstName" value={formData.firstName || ""} onChange={handleChange} />
                            <Input label={<>Familiya <span className="text-red-500">*</span></>} name="lastName" value={formData.lastName || ""} onChange={handleChange} />
                            <Input label={<>Tug'ilgan sana <span className="text-red-500">*</span></>} type="date" name="dateBirth" value={formData.dateBirth || ""} onChange={handleChange} />
                            <div className="flex flex-col">
                                <select
                                    name={<>Jins <span className="text-red-500">*</span></>}
                                    value={formData.genderType || ""}
                                    onChange={handleChange}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tanlang</option>
                                    <option value="ERKAK">Erkak</option>
                                    <option value="AYOL">Ayol</option>
                                </select>
                            </div>
                            <Input  label={<>Parol <span className="text-red-500">*</span></>} type="password" name="password" value={formData.password || ""} onChange={handleChange} />
                        </div>
                    </div>

                  
                    <div>
                        <Typography variant="h6" className="mb-4 text-blue-600">
                            Kontakt
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input  label={<>Telefon raqam <span className="text-red-500">*</span></>} name="phoneNumber" value={formData.phoneNumber || ""} onChange={handleChange} />
                            <Input label={<>Email </>} type="email" name="email" value={formData.email || ""} onChange={handleChange} />
                            <Input label={<>Telegram Chat ID <span className="text-red-500">*</span></>} type="number" name="telegramChatId" value={formData.telegramChatId || ""} onChange={handleChange} />
                            <Input label={<>Balans <span className="text-red-500">*</span></>} type="number" name="balance" value={formData.balance || ""} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Manzil */}
                    <div>
                        <Typography variant="h6" className="mb-4 text-blue-600">
                            Manzil
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Viloyat" name="addressRegion" value={formData.addressRegion || ""} onChange={handleChange} />
                            <Input label="Tuman" name="addressDistrict" value={formData.addressDistrict || ""} onChange={handleChange} />
                            <Input label="MFY" name="addressMfy" value={formData.addressMfy || ""} onChange={handleChange} />
                            <Input label="Manzil" name="address" value={formData.address || ""} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Maktab ma’lumotlari */}
                    <div>
                        <Typography variant="h6" className="mb-4 text-blue-600">
                            Maktab ma’lumotlari
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Maktab" name="school" value={formData.school || ""} onChange={handleChange} />
                            <Input label="Sinf" name="schoolClass" value={formData.schoolClass || ""} onChange={handleChange} />

                            {/* Test ID Select */}
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium text-gray-700">Test</label>
                                <select
                                    name="testId"
                                    value={formData.testId || ""}
                                    onChange={handleChange}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Test tanlang</option>
                                    {tests?.length > 0 ? (
                                        tests.map((test) => (
                                            <option key={test.id} value={test.id}>
                                                {test.name || `Test #${test.id}`}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Testlar mavjud emas</option>
                                    )}
                                </select>
                            </div>

                            {/* Group ID Select */}
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium text-gray-700">Guruh</label>
                                <select
                                    name="groupId"
                                    value={formData.groupId || ""}
                                    onChange={handleChange}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Guruh tanlang</option>
                                    {groups?.length > 0 ? (
                                        groups.map((group) => (
                                            <option key={group.id} value={group.id}>
                                                {group.name || `Guruh #${group.id}`}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Guruhlar mavjud emas</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
