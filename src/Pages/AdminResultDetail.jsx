import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import {
    Card,
    CardBody,
    Typography,
    Tabs,
    TabsHeader,
    Tab,
    TabPanel,
    TabsBody,
    Button,
} from "@material-tailwind/react";
import {
    UserIcon,
    ChartBarIcon,
    CheckCircleIcon,
    XCircleIcon,
    DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function AdminResultDetail() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [exportingPdf, setExportingPdf] = useState(false);

    const getResultDetail = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/result/get/report?testReportId=${id}`
            );
            setResult(response.data.object);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getResultDetail();
    }, []);

    const exportToPDF = async () => {
        if (!result) return;

        setExportingPdf(true);

        try {
            const { user, testResult } = result;

            // Create PDF with A4 size
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            let yPosition = 25;
            const leftMargin = 20;
            const rightMargin = 20;
            const contentWidth = pageWidth - leftMargin - rightMargin;

            // Set default font
            pdf.setFont("helvetica");

            // Helper function to convert Cyrillic and special characters to readable Latin
            const convertText = (text) => {
                if (!text) return '';

                const cyrillicMap = {
                    // Russian/Uzbek Cyrillic to Latin
                    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
                    'Ж': 'J', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
                    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
                    'Ф': 'F', 'Х': 'X', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
                    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',

                    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
                    'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
                    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
                    'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
                    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',

                    // Uzbek specific letters
                    'Ғ': 'G', 'ғ': 'g', 'Қ': 'Q', 'қ': 'q', 'Ў': 'O', 'ў': 'o',
                    'Ҳ': 'H', 'ҳ': 'h', 'Ҷ': 'J', 'ҷ': 'j', 'Ҳ': 'H', 'ҳ': 'h',
                };

                return String(text).replace(/./g, char => cyrillicMap[char] || char);
            };

            // Helper function to safely add text
            const addText = (text, x, y, options = {}) => {
                const safeText = convertText(text);
                pdf.text(safeText, x, y, options);
                return safeText;
            };

            // Helper function to add wrapped text
            const addWrappedText = (text, x, y, maxWidth, lineHeight = 6) => {
                const safeText = convertText(text);
                const lines = pdf.splitTextToSize(safeText, maxWidth);
                let currentY = y;
                lines.forEach(line => {
                    if (currentY > pageHeight - 30) {
                        pdf.addPage();
                        currentY = 25;
                    }
                    pdf.text(line, x, currentY);
                    currentY += lineHeight;
                });
                return currentY;
            };

            // HEADER
            pdf.setFillColor(41, 98, 255);
            pdf.rect(0, 0, pageWidth, 35, 'F');

            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(20);
            addText('TEST NATIJALARI HISOBOTI', pageWidth / 2, 22, { align: 'center' });

            yPosition = 50;

            // Current date
            pdf.setTextColor(100, 100, 100);
            pdf.setFontSize(10);
            addText(`Yaratilgan: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - rightMargin, yPosition, { align: 'right' });

            yPosition += 15;

            // STUDENT INFORMATION SECTION
            pdf.setFillColor(248, 250, 252);
            pdf.rect(leftMargin - 5, yPosition - 5, contentWidth + 10, 50, 'F');

            pdf.setDrawColor(59, 130, 246);
            pdf.setLineWidth(2);
            pdf.line(leftMargin - 5, yPosition - 5, leftMargin - 5, yPosition + 45);

            pdf.setTextColor(30, 64, 175);
            pdf.setFontSize(16);
            addText('STUDENT MALUMOTLARI', leftMargin, yPosition + 5);

            yPosition += 15;
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(11);

            // Student info in two columns
            const studentData = [
                [`Ism Familiya: ${user.firstName} ${user.lastName}`, `Telefon: ${user.phoneNumber}`],
                [`Balans: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} som`, `Jinsi: ${convertText(user.genderType)}`],
                [`Hisob turi: ${convertText(user.accountType)}`, `Telegram: ${testResult.isTelegram ? "Ha" : "Yoq"}`]
            ];

            studentData.forEach(row => {
                addText(row[0], leftMargin, yPosition);
                addText(row[1], leftMargin + contentWidth / 2, yPosition);
                yPosition += 7;
            });

            yPosition += 20;

            // TEST RESULTS SECTION
            const totalQuestions = testResult.correctAnswerCount + testResult.wrongAnswerCount;
            const percentage = totalQuestions > 0 ? ((testResult.correctAnswerCount / totalQuestions) * 100).toFixed(1) : 0;

            pdf.setFillColor(240, 253, 244);
            pdf.rect(leftMargin - 5, yPosition - 5, contentWidth + 10, 45, 'F');

            pdf.setDrawColor(34, 197, 94);
            pdf.setLineWidth(2);
            pdf.line(leftMargin - 5, yPosition - 5, leftMargin - 5, yPosition + 40);

            pdf.setTextColor(21, 128, 61);
            pdf.setFontSize(16);
            addText('TEST NATIJALARI', leftMargin, yPosition + 5);

            yPosition += 15;
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(11);

            // Results in grid layout
            const resultData = [
                [`Togri javoblar: ${testResult.correctAnswerCount}`, `Notogri javoblar: ${testResult.wrongAnswerCount}`],
                [`Jami savollar: ${totalQuestions}`, `Natija: ${percentage}%`]
            ];

            resultData.forEach(row => {
                addText(row[0], leftMargin, yPosition);
                addText(row[1], leftMargin + contentWidth / 2, yPosition);
                yPosition += 7;
            });

            yPosition += 25;

            // CORRECT ANSWERS SECTION
            if (testResult.correctAnswers && testResult.correctAnswers.length > 0) {
                if (yPosition > pageHeight - 50) {
                    pdf.addPage();
                    yPosition = 25;
                }

                pdf.setTextColor(21, 128, 61);
                pdf.setFontSize(14);
                addText(`TOGRI JAVOBLAR (${testResult.correctAnswers.length})`, leftMargin, yPosition);
                yPosition += 12;

                testResult.correctAnswers.forEach((question, index) => {
                    if (yPosition > pageHeight - 60) {
                        pdf.addPage();
                        yPosition = 25;
                    }

                    // Question box
                    pdf.setFillColor(255, 255, 255);
                    pdf.setDrawColor(34, 197, 94);
                    pdf.setLineWidth(1);

                    const questionHeight = 35 + (question.option ? question.option.length * 5 : 0);
                    pdf.rect(leftMargin - 2, yPosition - 2, contentWidth + 4, questionHeight, 'FD');

                    pdf.setTextColor(0, 0, 0);
                    pdf.setFontSize(11);

                    // Question text
                    const questionText = `${index + 1}. ${question.question}`;
                    yPosition = addWrappedText(questionText, leftMargin + 2, yPosition + 5, contentWidth - 4) + 3;

                    // Options
                    if (question.option && question.option.length > 0) {
                        pdf.setFontSize(10);
                        addText('Variantlar:', leftMargin + 5, yPosition);
                        yPosition += 5;

                        question.option.forEach((option, optIndex) => {
                            addText(`${optIndex + 1}) ${option}`, leftMargin + 10, yPosition);
                            yPosition += 5;
                        });
                        yPosition += 2;
                    }

                    // Correct answer
                    pdf.setFillColor(240, 253, 244);
                    pdf.rect(leftMargin + 2, yPosition - 1, contentWidth - 4, 8, 'F');
                    pdf.setTextColor(21, 128, 61);
                    pdf.setFontSize(10);
                    addText(`Togri javob: ${question.correctAnswer}`, leftMargin + 5, yPosition + 4);

                    yPosition += 15;

                    // ADDED: 50px distance between question cards
                    yPosition += 18; // 18mm ≈ 50px (since 1mm ≈ 2.83px)
                });
            }

            // WRONG ANSWERS SECTION
            if (testResult.wrongAnswers && testResult.wrongAnswers.length > 0) {
                if (yPosition > pageHeight - 50) {
                    pdf.addPage();
                    yPosition = 25;
                }

                pdf.setTextColor(220, 38, 38);
                pdf.setFontSize(14);
                addText(`NOTOGRI JAVOBLAR (${testResult.wrongAnswers.length})`, leftMargin, yPosition);
                yPosition += 12;

                testResult.wrongAnswers.forEach((question, index) => {
                    if (yPosition > pageHeight - 70) {
                        pdf.addPage();
                        yPosition = 25;
                    }

                    // Question box
                    pdf.setFillColor(255, 255, 255);
                    pdf.setDrawColor(239, 68, 68);
                    pdf.setLineWidth(1);

                    const questionHeight = 45 + (question.option ? question.option.length * 5 : 0);
                    pdf.rect(leftMargin - 2, yPosition - 2, contentWidth + 4, questionHeight, 'FD');

                    pdf.setTextColor(0, 0, 0);
                    pdf.setFontSize(11);

                    // Question text
                    const questionText = `${index + 1}. ${question.question}`;
                    yPosition = addWrappedText(questionText, leftMargin + 2, yPosition + 5, contentWidth - 4) + 3;

                    // Options
                    if (question.option && question.option.length > 0) {
                        pdf.setFontSize(10);
                        addText('Variantlar:', leftMargin + 5, yPosition);
                        yPosition += 5;

                        question.option.forEach((option, optIndex) => {
                            addText(`${optIndex + 1}) ${option}`, leftMargin + 10, yPosition);
                            yPosition += 5;
                        });
                        yPosition += 2;
                    }

                    // Correct answer
                    pdf.setFillColor(240, 253, 244);
                    pdf.rect(leftMargin + 2, yPosition - 1, contentWidth - 4, 8, 'F');
                    pdf.setTextColor(21, 128, 61);
                    pdf.setFontSize(10);
                    addText(`Togri javob: ${question.correctAnswer}`, leftMargin + 5, yPosition + 4);
                    yPosition += 10;

                    // Wrong answer
                    pdf.setFillColor(254, 242, 242);
                    pdf.rect(leftMargin + 2, yPosition - 1, contentWidth - 4, 8, 'F');
                    pdf.setTextColor(220, 38, 38);
                    addText(`Sizning javobingiz: ${question.wrongAnswer || "Javob berilmagan"}`, leftMargin + 5, yPosition + 4);

                    yPosition += 20;

                    // ADDED: 50px distance between question cards
                    yPosition += 18; // 18mm ≈ 50px (since 1mm ≈ 2.83px)
                });
            }

            // FOOTER on all pages
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);

                // Footer line
                pdf.setDrawColor(200, 200, 200);
                pdf.setLineWidth(0.5);
                pdf.line(leftMargin, pageHeight - 15, pageWidth - rightMargin, pageHeight - 15);

                pdf.setTextColor(128, 128, 128);
                pdf.setFontSize(8);
                addText(`Sahifa ${i} / ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
                addText('Test Management System', leftMargin, pageHeight - 8);
            }

            // Save PDF
            const fileName = `Test_Natijalari_${convertText(user.firstName)}_${convertText(user.lastName)}_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);

        } catch (error) {
            console.error('PDF export error:', error);
            alert('PDF eksport qilishda xatolik yuz berdi');
        } finally {
            setExportingPdf(false);
        }
    };

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
    if (!result) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Typography variant="h5" color="red">
                    Ma'lumot topilmadi
                </Typography>
            </div>
        );
    }
    const { user, testResult } = result;
    return (
        <div className="p-4 md:p-10 space-y-6  mx-auto">
            {/* Header with Export Button */}
            <div className="flex justify-between items-center">
                <Typography variant="h4" className="text-gray-800">
                    Test Natijalari
                </Typography>
                <Button
                    onClick={exportToPDF}
                    disabled={exportingPdf}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                    size="sm"
                >
                    {exportingPdf ? (
                        <>
                            <ReactLoading
                                type="spin"
                                color="#fff"
                                height={16}
                                width={16}
                            />
                            <span>Yuklanmoqda...</span>
                        </>
                    ) : (
                        <>
                            <DocumentArrowDownIcon className="h-4 w-4" />
                            <span>PDF Yuklab olish</span>
                        </>
                    )}
                </Button>
            </div>

            {/* Student Info */}
            <Card className="shadow-lg">
                <CardBody className="space-y-2">
                    <div className="flex items-center gap-2">
                        <UserIcon className="h-6 w-6 text-blue-500" />
                        <Typography variant="h5">Student ma'lumotlari</Typography>
                    </div>
                    <Typography>
                        <b>Ism Familiya:</b> {user.firstName} {user.lastName}
                    </Typography>
                    <Typography>
                        <b>Telefon:</b> {user.phoneNumber}
                    </Typography>
                    <Typography>
                        <b>Balans:</b>{" "}
                        {user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} so'm
                    </Typography>
                    <Typography>
                        <b>Jinsi:</b> {user.genderType}
                    </Typography>
                    <Typography>
                        <b>Hisob turi:</b> {user.accountType}
                    </Typography>
                </CardBody>
            </Card>

            {/* Test Result */}
            <Card className="shadow-lg">
                <CardBody className="space-y-2">
                    <div className="flex items-center gap-2">
                        <ChartBarIcon className="h-6 w-6 text-green-500" />
                        <Typography variant="h5">Test natijalari</Typography>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <Typography className="text-2xl font-bold text-green-600">
                                {testResult.correctAnswerCount}
                            </Typography>
                            <Typography className="text-sm text-gray-600">
                                To'g'ri javoblar
                            </Typography>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg text-center">
                            <Typography className="text-2xl font-bold text-red-600">
                                {testResult.wrongAnswerCount}
                            </Typography>
                            <Typography className="text-sm text-gray-600">
                                Noto'g'ri javoblar
                            </Typography>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <Typography className="text-2xl font-bold text-blue-600">
                                {testResult.correctAnswerCount + testResult.wrongAnswerCount}
                            </Typography>
                            <Typography className="text-sm text-gray-600">
                                Jami savollar
                            </Typography>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                            <Typography className="text-2xl font-bold text-purple-600">
                                {((testResult.correctAnswerCount / (testResult.correctAnswerCount + testResult.wrongAnswerCount)) * 100).toFixed(1)}%
                            </Typography>
                            <Typography className="text-sm text-gray-600">
                                Natija
                            </Typography>
                        </div>
                    </div>
                    <Typography className="mt-4">
                        <b>Telegram orqali topshirilganmi:</b>{" "}
                        {testResult.isTelegram ? "Ha" : "Yo'q"}
                    </Typography>
                </CardBody>
            </Card>

            {/* Answers Tabs */}
            <Card className="shadow-lg">
                <CardBody>
                    <Tabs value="correct">
                        <TabsHeader>
                            <Tab key="correct" value="correct">
                                <div className="flex items-center gap-1">
                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    <span>To'g'ri javoblar</span>
                                </div>
                            </Tab>
                            <Tab key="wrong" value="wrong">
                                <div className="flex items-center gap-1">
                                    <XCircleIcon className="h-5 w-5 text-red-500" />
                                    <span>Noto'g'ri javoblar</span>
                                </div>
                            </Tab>
                        </TabsHeader>
                        <TabsBody>
                            {/* Correct Answers */}
                            <TabPanel key="correct" value="correct">
                                {testResult.correctAnswers.length === 0 ? (
                                    <Typography color="gray">Ma'lumot yo'q</Typography>
                                ) : (
                                    <div className="space-y-4">
                                        {testResult.correctAnswers.map((q, i) => (
                                            <Card key={q.id} className="border border-green-300">
                                                <CardBody className="space-y-2">
                                                    <Typography className="font-bold">
                                                        {i + 1}. {q.question}
                                                    </Typography>
                                                    {q.option && q.option.length > 0 && (
                                                        <div>
                                                            <b>Variantlar:</b>
                                                            <ul className="list-decimal list-inside">
                                                                {q.option.map((opt, idx) => (
                                                                    <li key={idx}>{opt}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    <Typography color="green">
                                                        To'g'ri javob: {q.correctAnswer}
                                                    </Typography>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </TabPanel>

                            {/* Wrong Answers */}
                            <TabPanel key="wrong" value="wrong">
                                {testResult.wrongAnswers.length === 0 ? (
                                    <Typography color="gray">Ma'lumot yo'q</Typography>
                                ) : (
                                    <div className="space-y-4">
                                        {testResult.wrongAnswers.map((q, i) => (
                                            <Card key={q.id} className="border border-red-300">
                                                <CardBody className="space-y-2">
                                                    <Typography className="font-bold">
                                                        {i + 1}. {q.question}
                                                    </Typography>
                                                    {q.option && q.option.length > 0 && (
                                                        <div>
                                                            <b>Variantlar:</b>
                                                            <ul className="list-decimal list-inside">
                                                                {q.option.map((opt, idx) => (
                                                                    <li key={idx}>{opt}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    <Typography color="green">
                                                        To'g'ri javob: {q.correctAnswer}
                                                    </Typography>
                                                    <Typography color="red">
                                                        Sizning javobingiz: {q.wrongAnswer}
                                                    </Typography>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </TabPanel>
                        </TabsBody>
                    </Tabs>
                </CardBody>
            </Card>
        </div>
    );
}