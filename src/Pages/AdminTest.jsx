import axios from "axios";
import { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    Button,
    Select,
    Option,
} from "@material-tailwind/react";
import ReactLoading from 'react-loading';
import AdminTestDelete from "../Components/AdminTest/AdminTestDelete";
import { NavLink } from "react-router-dom";
import { Filter, Plus, Eye, Pencil, Globe, Send } from "lucide-react"; // ikonkalar

export default function AdminTest() {
    const [filter, setFilter] = useState("all"); // all | telegram | web
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)

    const getAllTest = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`/test/get`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                params: {
                    isTelegram: filter === "telegram" || filter === "all",
                    isWeb: filter === "web" || filter === "all",
                },
            });
            setData(response?.data?.object || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getAllTest();
    }, [filter]);

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
            </div>
        );
    }

    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-100 p-6 md:p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Typography variant="h4" color="blue-gray" className="flex items-center gap-2">
                    Testlar
                </Typography>
                <NavLink to={`/admin/test/create`}>
                    <Button color="blue" className="flex items-center gap-2">
                        <Plus size={18} /> Yaratish
                    </Button>
                </NavLink>
            </div>

            {/* Filter */}
            <div className="max-w-xs mb-6">
                <Select
                    className="bg-white"
                    label="Filtr tanlang"
                    value={filter}
                    onChange={(val) => setFilter(val)}
                >
                    <Option value="all">Hammasi</Option>
                    <Option value="telegram">Faqat Telegram</Option>
                    <Option value="web">Faqat Web</Option>
                </Select>
            </div>

            {/* Cards */}
            <div className="space-y-4">
                {data.length === 0 ? (
                    <Card className="flex items-center justify-center min-h-[500px]">
                        <Typography color="gray">Ma'lumot yo‘q</Typography>
                    </Card>
                ) : (
                    data.map((item) => (
                        <Card key={item.id} className="w-full shadow-md">
                            <CardBody>
                                <div className="flex items-center justify-between">
                                    <Typography variant="h6">{item.name}</Typography>
                                    <Typography color="green" className="font-bold">
                                        {item.price} so‘m
                                    </Typography>
                                </div>
                                <Typography color="gray" className="text-sm mt-2">
                                    Test vaqti: {item.testTime} daqiqa | Testlar soni:{" "}
                                    {item.testCount}
                                </Typography>

                                {/* Telegram / Web tags */}
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-4 mt-3 text-sm">
                                        {item.isTelegram && (
                                            <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">
                                                <Send size={14} /> Telegram
                                            </span>
                                        )}
                                        {item.isWeb && (
                                            <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg">
                                                <Globe size={14} /> Web
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-3 mt-4">
                                        <NavLink to={`/admin/test/${item?.id}`}>
                                            <Button size="sm" color="blue" className="flex items-center gap-1 py-[12px]">
                                                <Eye size={14} /> Ko‘rish
                                            </Button>
                                        </NavLink>
                                        <NavLink to={`/admin/test/edit/${item?.id}`}>
                                            <Button size="sm" color="green" className="flex items-center gap-1 py-[12px]">
                                                <Pencil size={14} /> Tahrirlash
                                            </Button>
                                        </NavLink>
                                        <AdminTestDelete refresh={getAllTest} id={item?.id} />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
