import { useEffect, useState } from "react";
import { Input, Button, Select, Option, Card, CardBody, Typography } from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function AdminUserCreate() {
    const [formData, setFormData] = useState({
        accountType: "STUDENT",
        address: "",
        addressDistrict: "",
        addressMfy: "",
        addressRegion: "",
        balance: null,
        creatorId: localStorage.getItem("userId"),
        dateBirth: "",
        email: "",
        fatherName: "",
        firstName: "",
        lastName: "",
        motherName: "",
        genderType: "",
        groupId: null,
        password: "",
        phoneNumber: "+998",
        school: "",
        schoolClass: "",
        telegramChatId: null,
        telegramChatIdFather: null,
        telegramChatIdMother: null,
        testId: null,
    });
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [tests, setTests] = useState([]);

    const getAllGroups = async () => {
        try {
            const res = await axios.get("/group/get/all", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setGroups(res?.data?.object || []);
        } catch (e) { console.error(e); }
    };

    const getAllTest = async () => {
        try {
            const res = await axios.get("/test/get?isTelegram=true&isWeb=true", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTests(res?.data?.object || []);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        getAllGroups();
        getAllTest();
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? null : Number(value)) : value,
        }));
    };

    const handleSelect = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            await axios.post("/users/admin", formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            Swal.fire({ title: 'Muvaffaqiyatli!', icon: 'success', position: 'top-end', timer: 3000, timerProgressBar: true, showCloseButton: true, toast: true, showConfirmButton: false });
            navigate(-1);
        } catch (err) {
            Swal.fire({ title: 'Error!', text: err.response?.data?.message || 'Error.', icon: 'error', position: 'top-end', timer: 3000, timerProgressBar: true, showCloseButton: true, toast: true, showConfirmButton: false });
        }
    };

    const sectionTitle = (text) => (
        <Typography variant="h6" className="mb-4 text-blue-600">{text}</Typography>
    );

    return (
        <div className="mx-auto p-10">
            <div className="flex items-center justify-between mb-6">
                <Typography variant="h4" color="blue-gray" className="font-bold">
                    Foydalanuvchi yaratish
                </Typography>
                <Button color="blue" onClick={handleSubmit} className="px-6 py-2 rounded-lg">
                    Saqlash
                </Button>
            </div>

            <Card shadow={true} className="p-4">
                <CardBody className="space-y-8">

                    {/* Shaxsiy ma'lumotlar */}
                    <div>
                        {sectionTitle("Shaxsiy ma'lumotlar")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Ism" name="firstName" value={formData.firstName} onChange={handleChange} />
                            <Input label="Familiya" name="lastName" value={formData.lastName} onChange={handleChange} />
                            <Input label="Otasining ismi" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                            <Input label="Onasining ismi" name="motherName" value={formData.motherName} onChange={handleChange} />
                            <Input label="Tug'ilgan sana" type="date" name="dateBirth" value={formData.dateBirth} onChange={handleChange} />
                            <Select label="Jinsi" value={formData.genderType} onChange={(val) => handleSelect("genderType", val)}>
                                <Option value="ERKAK">Erkak</Option>
                                <Option value="AYOL">Ayol</Option>
                            </Select>
                            <Input label="Parol" type="password" name="password" value={formData.password} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Kontakt */}
                    <div>
                        {sectionTitle("Kontakt")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Telefon raqam" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                            <Input
                                label="Telegram Chat ID"
                                type="number"
                                name="telegramChatId"
                                value={formData.telegramChatId ?? ""}
                                onChange={handleChange}
                            />
                            <Input
                                label="Chat ID (otasi)"
                                type="number"
                                name="telegramChatIdFather"
                                value={formData.telegramChatIdFather ?? ""}
                                onChange={handleChange}
                            />
                            <Input
                                label="Chat ID (onasi)"
                                type="number"
                                name="telegramChatIdMother"
                                value={formData.telegramChatIdMother ?? ""}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        {sectionTitle("Manzil")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Viloyat" name="addressRegion" value={formData.addressRegion} onChange={handleChange} />
                            <Input label="Tuman" name="addressDistrict" value={formData.addressDistrict} onChange={handleChange} />
                            <Input label="MFY" name="addressMfy" value={formData.addressMfy} onChange={handleChange} />
                            <Input label="Manzil" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        {sectionTitle("Maktab ma'lumotlari")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Maktab" name="school" value={formData.school} onChange={handleChange} />
                            <Input label="Sinf" name="schoolClass" value={formData.schoolClass} onChange={handleChange} />

                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium text-gray-700">Test</label>
                                <select
                                    name="testId"
                                    value={formData.testId || ""}
                                    onChange={handleChange}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Test tanlang</option>
                                    {tests.length > 0
                                        ? tests.map(t => <option key={t.id} value={t.id}>{t.name || `Test #${t.id}`}</option>)
                                        : <option disabled>Testlar mavjud emas</option>
                                    }
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium text-gray-700">Guruh</label>
                                <select
                                    name="groupId"
                                    value={formData.groupId || ""}
                                    onChange={handleChange}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Guruh tanlang</option>
                                    {groups.length > 0
                                        ? groups.map(g => <option key={g.id} value={g.id}>{g.name || `Guruh #${g.id}`}</option>)
                                        : <option disabled>Guruhlar mavjud emas</option>
                                    }
                                </select>
                            </div>

                             <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                            <Input
                                label="Balans"
                                type="text"
                                name="balance"
                                value={formData?.balance?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") ?? ""}
                                onChange={(e) => handleChange({
                                    target: { name: "balance", value: e.target.value.replace(/\s/g, "") },
                                })}
                            />
                        </div>
                    </div>

                </CardBody>
            </Card>
        </div>
    );
}