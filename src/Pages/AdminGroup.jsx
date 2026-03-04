import axios from "axios";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import CreateGroups from "../Components/AdminGroups/CreateGroups";
import CONFIG from "../utils/Config";
import EditGroups from "../Components/AdminGroups/EditGroups";
import DeleteGroups from "../Components/AdminGroups/DeleteGroups";

export default function AdminGroup() {
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);

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
                <ReactLoading
                    type="spinningBubbles"
                    color="#000"
                    height={100}
                    width={100}
                />
            </div>
        );
    }

    return (
        <div className="p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Typography variant="h4" color="blue-gray">
                    Guruh
                </Typography>
                <CreateGroups refresh={getAllGroups} />
            </div>

            {/* Если нет данных */}
            {groups.length === 0 ? (
                <div className="flex items-center justify-center h-[500px]">
                    <Typography variant="h6" color="gray">
                        Hozircha guruhlar mavjud emas.
                    </Typography>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {groups.map((group) => (
                        <Card key={group.id} className="shadow-lg rounded-xl">
                            <CardHeader floated={false} className="h-48">
                                <img
                                    src={`${CONFIG.API_URL}${group.iconId}`}
                                    alt={group.name}
                                    className="h-full w-full object-cover rounded-t-xl"
                                />
                            </CardHeader>
                            <CardBody className="text-center">
                                <Typography variant="h6" color="blue-gray" className="mb-2">
                                    {group.name}
                                </Typography>
                                <div className="flex items-center justify-between gap-[10px] mt-[10px]">
                                    <EditGroups group={group} onUpdated={getAllGroups} />
                                    <DeleteGroups groupId={group.id} onDeleted={getAllGroups} />
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
