import { useEffect, useState } from "react";
import { Input, Button, Card, CardBody, Typography } from "@material-tailwind/react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminUserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id,
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
        phoneNumber: "",
        school: "",
        schoolClass: "",
        telegramChatId: null,
        telegramChatIdFather: null,
        telegramChatIdMother: null,
        testId: null,
    });

    const [groups, setGroups] = useState([]);
    const [tests, setTests] = useState([]);

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
            setFormData(prev => ({ ...prev, ...safeUser, password: "" }));
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    };

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
        getUser();
        getAllGroups();
        getAllTest();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? null : Number(value)) : value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const submitData = { ...formData, ...(formData.password ? {} : { password: undefined }) };
            await axios.put(`/users/edit`, submitData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            Swal.fire({ title: "Muvaffaqiyatli yangilandi!", icon: "success", position: "top-end", timer: 3000, toast: true, showConfirmButton: false });
            navigate(-1);
        } catch (err) {
            Swal.fire({ title: "Xatolik!", text: err.response?.data?.message || "Error.", icon: "error", position: "top-end", timer: 3000, toast: true, showConfirmButton: false });
        }
    };

    const sectionTitle = (text) => (
        <Typography variant="h6" className="mb-4 text-blue-600">{text}</Typography>
    );

    const req = <span className="text-red-500">*</span>;

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

                    <div>
                        {sectionTitle("Shaxsiy ma'lumotlar")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label={<>Ism {req}</>} name="firstName" value={formData.firstName || ""} onChange={handleChange} />
                            <Input label={<>Familiya {req}</>} name="lastName" value={formData.lastName || ""} onChange={handleChange} />
                            <Input label="Otasining ismi" name="fatherName" value={formData.fatherName || ""} onChange={handleChange} />
                            <Input label="Onasining ismi" name="motherName" value={formData.motherName || ""} onChange={handleChange} />
                            <Input label={<>Tug'ilgan sana {req}</>} type="date" name="dateBirth" value={formData.dateBirth || ""} onChange={handleChange} />
                            <Input label="Yangi parol" type="password" name="password" value={formData.password || ""} onChange={handleChange} />

                            <div className="flex flex-col">
                                <label className="mb-1 text-sm font-medium text-gray-700">Jinsi</label>
                                <select
                                    name="genderType"
                                    value={formData.genderType || ""}
                                    onChange={handleChange}
                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tanlang</option>
                                    <option value="ERKAK">Erkak</option>
                                    <option value="AYOL">Ayol</option>
                                </select>
                                
                            </div>
                        </div>
                    </div>

                    {/* Kontakt */}
                    <div>
                        {sectionTitle("Kontakt")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label={<>Telefon raqam {req}</>} name="phoneNumber" value={formData.phoneNumber || ""} onChange={handleChange} />
                            <Input
                                label={<>Telegram Chat ID (o'quvchi) {req}</>}
                                type="number"
                                name="telegramChatId"
                                value={formData.telegramChatId ?? ""}
                                onChange={handleChange}
                            />
                            <Input
                                label="Telegram Chat ID (otasi)"
                                type="number"
                                name="telegramChatIdFather"
                                value={formData.telegramChatIdFather ?? ""}
                                onChange={handleChange}
                            />
                            <Input
                                label="Telegram Chat ID (onasi)"
                                type="number"
                                name="telegramChatIdMother"
                                value={formData.telegramChatIdMother ?? ""}
                                onChange={handleChange}
                            />
                           
                        </div>
                    </div>

                    {/* Manzil */}
                    <div>
                        {sectionTitle("Manzil")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Viloyat" name="addressRegion" value={formData.addressRegion || ""} onChange={handleChange} />
                            <Input label="Tuman" name="addressDistrict" value={formData.addressDistrict || ""} onChange={handleChange} />
                            <Input label="MFY" name="addressMfy" value={formData.addressMfy || ""} onChange={handleChange} />
                            <Input label="Manzil" name="address" value={formData.address || ""} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Maktab ma'lumotlari */}
                    <div>
                        {sectionTitle("Maktab ma'lumotlari")}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Maktab" name="school" value={formData.school || ""} onChange={handleChange} />
                            <Input label="Sinf" name="schoolClass" value={formData.schoolClass || ""} onChange={handleChange} />

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
                             <Input label="Email" type="email" name="email" value={formData.email || ""} onChange={handleChange} />
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