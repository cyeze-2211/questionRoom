import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../img/logo2.png';

const Sidebar = () => {
    const location = useLocation();

    const group = location.pathname === '/admin/group';
    const Menu = location.pathname === '/admin/course';
    const Bg = location.pathname === '/admin/student';
    const quiz = location.pathname === '/admin/quiz';
    const test = location.pathname === '/admin/test';
    const rating = location.pathname === '/admin/rating';

    return (
        <div
            className="fixed flex h-[95%] top-[17px] left-[15px] border-r-[2px]  w-full max-w-[15rem] flex-col bg-[white] rounded-[30px] bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/10 hover:shadow-2xl transition-shadow duration-300 ease-in-out">
            <div className="p-4 mb-2 flex items-center justify-center">
                <img className="w-[120px]" src={logo} alt="logo" />
                {/* This is logo */}
            </div>
            <div className="w-full bg-[white] h-[1px]"></div>
            <nav className="flex flex-col gap-1 p-2 font-sans text-base font-normal text-black text-[22px]">
                <NavLink to={'/admin/course'}>
                    <div
                        role="button"
                        className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ${Menu ? 'bg-blue-gray-50' : ''
                            }`}
                    >
                        <div className="grid mr-4 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M3 2h2v20H3zm16 0H6v20h13c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2m-1 10H9v-2h9zm0-4H9V6h9z"></path>
                            </svg>
                        </div>
                        Kurs
                    </div>
                </NavLink>
                <NavLink to={'/admin/group'}>
                    <div
                        role="button"
                        className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ${group ? 'bg-blue-gray-50' : ''
                            }`}
                    >
                        <div className="grid mr-4 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M0 18v-1.575q0-1.075 1.1-1.75T4 14q.325 0 .625.013t.575.062q-.35.525-.525 1.1t-.175 1.2V18zm6 0v-1.625q0-.8.438-1.463t1.237-1.162T9.588 13T12 12.75q1.325 0 2.438.25t1.912.75t1.225 1.163t.425 1.462V18zm13.5 0v-1.625q0-.65-.162-1.225t-.488-1.075q.275-.05.563-.062T20 14q1.8 0 2.9.663t1.1 1.762V18zM4 13q-.825 0-1.412-.587T2 11q0-.85.588-1.425T4 9q.85 0 1.425.575T6 11q0 .825-.575 1.413T4 13m16 0q-.825 0-1.412-.587T18 11q0-.85.588-1.425T20 9q.85 0 1.425.575T22 11q0 .825-.575 1.413T20 13m-8-1q-1.25 0-2.125-.875T9 9q0-1.275.875-2.137T12 6q1.275 0 2.138.863T15 9q0 1.25-.862 2.125T12 12"></path></svg>
                        </div>
                        Guruhlar
                    </div>
                </NavLink>
                <NavLink to={'/admin/student'}>
                    <div
                        role="button"
                        className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ${Bg ? 'bg-blue-gray-50' : ''
                            }`}
                    >
                        <div className="grid mr-4 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"></path></svg>
                        </div>
                        Talabalar
                    </div>
                </NavLink>
                <NavLink to={'/admin/test'}>
                    <div
                        role="button"
                        className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ${test ? 'bg-blue-gray-50' : ''
                            }`}
                    >
                        <div className="grid mr-4 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={1}><path strokeWidth={1.5} d="M12 2a7.5 7.5 0 0 0-4.8 13.263C8.19 16.089 9 17.21 9 18.5h6c0-1.29.81-2.411 1.8-3.238A7.5 7.5 0 0 0 12 2Z"></path><path strokeLinejoin="round" strokeWidth={1.5} d="M15 18.5H9v2a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5z"></path><path strokeLinecap="round" strokeWidth={1.5} d="M10 8c0-1.013.895-2 2-2s2 .82 2 1.833c0 .365-.116.705-.317.991C13.085 9.676 12 10.488 12 11.5"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M11.992 14h.009"></path></g></svg>                        </div>
                        Testlar
                    </div>
                </NavLink>
                <NavLink to={'/admin/rating'}>
                    <div
                        role="button"
                        className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ${rating ? 'bg-blue-gray-50' : ''
                            }`}
                    >
                        <div className="grid mr-4 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 52.098c-18.38 16.053-47.185 33.518-77.79 49.72c-31.429 16.64-63.92 31.224-88.325 39.985c1.978 11.276 8.625 32.908 19.18 58.363c12.599 30.386 29.991 66.674 48.845 101.404c18.854 34.731 39.218 67.959 57.514 92.11c9.148 12.075 17.812 21.879 25.164 28.322c7.351 6.443 13.412 8.861 15.412 8.861s8.06-2.418 15.412-8.861s16.016-16.247 25.164-28.322c18.296-24.151 38.66-57.379 57.514-92.11c18.854-34.73 36.246-71.018 48.846-101.404c10.554-25.455 17.201-47.087 19.18-58.363c-24.406-8.761-56.897-23.345-88.327-39.985c-30.604-16.202-59.41-33.667-77.789-49.72m-132.025 9.716c-31.98 15.99-64.158 31.922-96.032 48.016L23 112.326v5.537c0 11 4.334 26.468 10.46 44.848s14.22 38.641 22.49 55.178l16.1-8.05c-7.73-15.463-15.637-35.2-21.51-52.821c-4.531-13.591-7.698-26.391-8.933-33.895c29.99-15.11 60.25-30.124 90.418-45.209zm264.05 0l-8.05 16.1c30.169 15.085 60.429 30.1 90.418 45.21c-1.234 7.503-4.402 20.303-8.932 33.894c-5.874 17.62-13.78 37.358-21.512 52.822l16.102 8.049c8.268-16.537 16.362-36.799 22.488-55.178C484.666 144.33 489 128.863 489 117.863v-5.537l-4.943-2.496c-31.874-16.094-64.053-32.026-96.032-48.016M256 98.186l6.777 7.755c7.366 8.43 27.707 20.13 49.31 29.832c21.605 9.702 44.603 18.144 59.12 23.682l5.793 2.21v6.198c0 6.305-1.831 12.916-4.621 21.258s-6.69 18.085-11.389 28.78c-9.396 21.389-21.982 46.542-35.078 70.706s-26.675 47.295-38.152 64.67c-5.739 8.688-10.92 15.916-15.477 21.313c-2.278 2.698-4.372 4.938-6.594 6.808c-2.221 1.87-4.282 3.976-9.265 4.211l-.424.02l-.424-.02c-4.983-.235-7.044-2.34-9.265-4.21s-4.316-4.11-6.594-6.81c-4.556-5.396-9.738-12.624-15.477-21.312c-11.477-17.375-25.056-40.505-38.152-64.67S160.406 239.29 151.01 217.9c-4.698-10.694-8.599-20.437-11.389-28.779S135 174.168 135 167.863v-6.199l5.793-2.209c14.517-5.538 37.515-13.98 59.12-23.682c21.603-9.702 41.944-21.402 49.31-29.832zm0 26.154c-12.288 10.561-30.065 19.479-48.713 27.853c-19.6 8.803-38.986 16.077-53.34 21.506c.608 2.68 1.504 6.005 2.744 9.713c2.523 7.542 6.247 16.888 10.8 27.25c9.103 20.724 21.517 45.56 34.421 69.37c12.904 23.809 26.325 46.638 37.348 63.325c5.511 8.344 10.454 15.172 14.21 19.622c1.073 1.27 1.707 1.816 2.53 2.654c.823-.838 1.457-1.384 2.53-2.654c3.756-4.45 8.699-11.278 14.21-19.622c11.023-16.687 24.444-39.516 37.348-63.326s25.318-48.645 34.422-69.369c4.552-10.362 8.276-19.708 10.799-27.25a103 103 0 0 0 2.744-9.713c-14.354-5.429-33.74-12.703-53.34-21.506c-18.648-8.374-36.425-17.292-48.713-27.853m-56.896 303.998l-14.208 11.05s9.676 12.468 22.915 25.01s29.456 26.465 48.189 26.465s34.95-13.922 48.19-26.465c13.238-12.542 22.914-25.01 22.914-25.01l-14.208-11.05s-8.991 11.534-21.085 22.992s-27.878 21.533-35.811 21.533s-23.716-10.075-35.81-21.533s-21.086-22.992-21.086-22.992"></path></svg>                        </div>
                        Reyting
                    </div>
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
