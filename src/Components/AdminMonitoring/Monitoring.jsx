import axios from "axios";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import CONFIG from "../../utils/Config";

export default function Monitoring() {
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    const getAllGroups = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/group/get/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setGroups(response.data?.object || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllGroups();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
            </div>
        );
    }

    return (
        <div className="p-10">
            <div className="flex items-center justify-between mb-6">
                <Typography variant="h4" color="blue-gray">
                    Guruh
                </Typography>
            </div>

            {groups.length === 0 ? (
                <div className="flex items-center justify-center h-[500px]">
                    <Typography variant="h6" color="gray">
                        Hozircha guruhlar mavjud emas.
                    </Typography>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-blue-gray-50 text-blue-gray-700 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">#</th>
                                <th className="px-6 py-4 font-semibold">Rasm</th>
                                <th className="px-6 py-4 font-semibold">Guruh nomi</th>
                                <th className="px-6 py-4 font-semibold text-right">Yaratilgan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map((group, index) => (
                                <tr
                                    key={group.id}
                                    className="border-t border-blue-gray-100 hover:bg-blue-gray-50 cursor-pointer transition-colors duration-150"
                                    onClick={() => navigate(`/admin/monitoring/${group.id}`)}
                                >
                                    <td className="px-6 py-4 text-blue-gray-600 font-medium">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <img
                                            src={`${CONFIG.API_URL}${group.iconId}`}
                                            alt={group.name}
                                            className="h-10 w-20 rounded-lg object-cover border border-blue-gray-200"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Typography variant="small" color="blue-gray" className="font-semibold">
                                            {group.name}
                                        </Typography>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-blue-500 hover:underline text-sm font-medium">
                                            {new Date(group.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}