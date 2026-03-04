import React, { useEffect, useState } from "react";
import CreateCourse from "../Components/AdminCourse/CreateCourse";
import DeleteCourse from "../Components/AdminCourse/DeleteCourse";
import EditCourse from "../Components/AdminCourse/EditCourse";
import axios from "axios";
import ReactLoading from 'react-loading';
import { useNavigate } from "react-router-dom";
import CONFIG from "../utils/Config";

export default function AdminCourse() {
  const [createModal, setCreateModal] = useState(false)
  const [deleteCourse, setDeleteCourse] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [itemData, setItemData] = useState(null)
  const navigate = useNavigate()

  const getCourse = async () => {
    try {
      const response = await axios.get(`/course/get/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      setData(response?.data?.object)
    } catch (error) {
      if (error?.status === 401) {
        navigate('/login')
        localStorage.clear()
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCourse()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen w-full'>
        <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 md:p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Barcha Kurslar</h1>
        <button
          onClick={() => setCreateModal(true)}
          className="bg-[#272C4B] text-white py-2 px-6 rounded-md text-sm font-medium transition-all hover:bg-[#272c4be3]"
        >
          Kurs yaratish
        </button>
      </div>

      {/* Cards Grid */}
      {data && data?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((course) => (
            <div
              key={course.id}
              className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Background image */}
              {course.iconId ? (
                <img
                  src={`${CONFIG.API_URL}${course.iconId}`}
                  alt={course.name}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="h-52 w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Rasm yo‘q</span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all"></div>

              {/* Text content */}
              <div className="absolute inset-0 flex flex-col items-start justify-end pb-[20px] text-center px-4">
                <h2 className="text-white font-semibold text-lg">{course.name}</h2>
                <p className="text-gray-200 text-sm mt-1">{course.createdAt?.split("T")[0]}</p>
              </div>

              {/* Buttons (hidden until hover) */}
              <div className="absolute bottom-3 right-[-10px] -translate-x-1/2 flex flex-col  gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={() => navigate(`/admin/module/${course.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white text-sm px-3 py-1 rounded-md"
                >
                  <svg className="text-[18px]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"></path></svg>
                </button>
                <button
                  onClick={() => { setEditModal(true); setItemData(course) }}
                  className="bg-green-600 hover:bg-green-700 flex items-center justify-center text-white text-sm px-3 py-1 rounded-md"
                >
                  <svg className="text-[18px]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"></path></svg>
                </button>
                <button
                  onClick={() => { setDeleteCourse(true); setItemData(course.id) }}
                  className="bg-red-600  hover:bg-red-700 flex items-center justify-center text-white text-sm px-3 py-1 rounded-md"
                >
                  <svg className="text-[20px]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[300px]">
          <h1 className="text-gray-600">Ma'lumot yo‘q</h1>
        </div>
      )}

      {/* Modals */}
      <CreateCourse refresh={getCourse} isOpen={createModal} onClose={() => setCreateModal(false)} />
      <DeleteCourse refresh={getCourse} data={itemData} isOpen={deleteCourse} onClose={() => setDeleteCourse(false)} />
      <EditCourse refresh={getCourse} data={itemData} isOpen={editModal} onClose={() => setEditModal(false)} />
    </div>
  );
}
