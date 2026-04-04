import { useState, useEffect, useMemo, useRef } from 'react';
import SimpleWysiwyg from 'react-simple-wysiwyg';
import Highcharts from 'highcharts';
import { X, Download, Printer, MoreVertical, Plus } from 'lucide-react';
import { boringAvatar } from '../utils/avatar';
import { lazy, Suspense } from 'react';

// Lazy load heavy libraries
const HighchartsReact = lazy(() => import('highcharts-react-official').then(module => ({ default: module.default })));
const jsPDF = lazy(() => import('jspdf').then(module => ({ default: module.default })));
import { usePageHelp } from '../PageHelpContext';
import ExamSidebar from './ExamSidebar';
import api from '../services/api';

// Add animation keyframes for mobile menu
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Disable Highcharts exporting to avoid external dependencies
if (typeof Highcharts !== 'undefined') {
    Highcharts.setOptions({
        exporting: {
            enabled: false
        }
    });
}

    /* ================= 🌐 LANGUAGE SELECTION ================= */
    const translations = {
        en: {
            mainTitle: (isParentView, className) => isParentView ? 'Student Progress Report' : `${className} Reports`,
            week: 'Week',
            month: 'Month',
            year: 'Year',
            emptyState: 'No records found for this selection.',
            aiSummary: 'Teacher Feedback:',
            positive: 'Positive',
            needsWork: 'Needs Work',
            behaviorDistribution: 'Behavior Distribution',
            ratio: 'Ratio',
            totalPoints: 'Total Points',
            selectStudents: 'Select Students'
        },
        zh: {
            mainTitle: (isParentView, className) => isParentView ? '学生成长报告' : `${className} 报告`,
            week: '周',
            month: '月',
            year: '年',
            emptyState: '未找到此选择的记录。',
            aiSummary: '教师反馈：',
            positive: '积极表现',
            needsWork: '需要改进',
            behaviorDistribution: '行为分布',
            ratio: '比例',
            totalPoints: '总分',
            selectStudents: '选择学生'
        }
    };

    /* ================= 🧠 ADVANCED TEACHER-LIKE TEXT GENERATION ================= */
    // Check if student has participated (has points)
    function hasParticipated(behavior) {
        return behavior.positive.total > 0 || behavior.negative.total < 0;
    }

    // Analyze behavior patterns in depth
    function analyzeBehaviorPattern(behavior) {
        const analysis = {
            positiveDominant: behavior.positive.total > Math.abs(behavior.negative.total),
            balanced: Math.abs(behavior.positive.total - Math.abs(behavior.negative.total)) <= 5,
            concerning: behavior.negative.total < 0 && Math.abs(behavior.negative.total) > behavior.positive.total,
            highlyActive: behavior.positive.total + Math.abs(behavior.negative.total) > 20,
            consistent: behavior.positive.total > 10 && behavior.negative.total === 0,
            improving: behavior.positive.total > 0 && behavior.negative.total === 0 && behavior.positive.total < 10
        };

        return analysis;
    }

    // Generate descriptive feedback based on behavior categories
    function describeBehaviors(behavior, count = 2, language = 'en') {
        const allBehaviors = [];

        // Add positive behaviors
        Object.entries(behavior.positive.byCard || {}).forEach(([card, points]) => {
            if (points > 0) {
                allBehaviors.push({ type: 'positive', card, points });
            }
        });

        // Add negative behaviors
        Object.entries(behavior.negative.byCard || {}).forEach(([card, points]) => {
            if (points > 0) {
                allBehaviors.push({ type: 'negative', card, points });
            }
        });

        // Sort by points (descending)
        allBehaviors.sort((a, b) => b.points - a.points);

        // Return top behaviors with context
        return allBehaviors.slice(0, count).map(item => {
            if (item.type === 'positive') {
                if (language === 'zh') {
                    const chinesePositives = {
                        "Great work": "表现出色",
                        "Homework": "作业完成得好",
                        "Helping others": "乐于助人",
                        "Participation": "积极参与",
                        "Kindness": "善良友善"
                    };

                    const behaviorZh = chinesePositives[item.card] || item.card;
                    if (item.points >= 10) return `${behaviorZh}（表现优异，获得${item.points}分）`;
                    else if (item.points >= 5) return `${behaviorZh}（表现突出，获得${item.points}分）`;
                    else return `${behaviorZh}（积极贡献，获得${item.points}分）`;
                } else {
                    if (item.points >= 10) return `${item.card} (excellent performance with ${item.points} points)`;
                    else if (item.points >= 5) return `${item.card} (strong showing with ${item.points} points)`;
                    else return `${item.card} (positive contribution with ${item.points} points)`;
                }
            } else {
                if (language === 'zh') {
                    const chineseNegatives = {
                        "Off-task": "注意力不集中",
                        "Disrespectful": "不尊重他人",
                        "Late": "迟到",
                        "Incomplete work": "作业未完成",
                        "Disruptive": "扰乱秩序"
                    };

                    const behaviorZh = chineseNegatives[item.card] || item.card;
                    if (item.points >= 10) return `${behaviorZh}（需要关注，扣${item.points}分）`;
                    else if (item.points >= 5) return `${behaviorZh}（存在问题，扣${item.points}分）`;
                    else return `${behaviorZh}（小问题，扣${item.points}分）`;
                } else {
                    if (item.points >= 10) return `${item.card} (needs attention, ${item.points} points deducted)`;
                    else if (item.points >= 5) return `${item.card} (some issues, ${item.points} points deducted)`;
                    else return `${item.card} (minor issues, ${item.points} points deducted)`;
                }
            }
        }).join(', ');
    }

    function generateTeacherNote(student, behavior, period, language = 'en') {
        if (!hasParticipated(behavior)) {
            if (language === 'zh') {
                return `${student.name} 尚未参与任何活动或获得分数。请鼓励孩子积极参与课堂活动，以便更好地了解其发展情况。`;
            }
            return `${student.name} has not yet participated in any activities or earned any points. Please encourage your child to engage in class activities so we can better assess their progress.`;
        }

        const pattern = analyzeBehaviorPattern(behavior);
        const behaviorDescription = describeBehaviors(behavior, 3, language);
        const timeFrame = period === 'week' ? 'this past week' : (period === 'month' ? 'the last month' : 'this year');
        const timeFrameZh = period === 'week' ? '本周' : (period === 'month' ? '本月' : '本年度');

        let feedback;

        if (pattern.consistent) {
            if (language === 'zh') {
                feedback = `${student.name}在${timeFrameZh}表现非常出色！在${behaviorDescription}等方面展现了卓越的能力。继续保持这种积极的学习态度！`;
            } else {
                feedback = `${student.name} has shown exceptional performance ${timeFrame}! They excelled in ${behaviorDescription}. Keep up this excellent work!`;
            }
        } else if (pattern.improving) {
            if (language === 'zh') {
                feedback = `${student.name}在${timeFrameZh}表现积极，特别是在${behaviorDescription}方面。继续保持这种良好的势头！`;
            } else {
                feedback = `${student.name} showed positive engagement ${timeFrame}, particularly in ${behaviorDescription}. Keep building on this momentum!`;
            }
        } else if (pattern.positiveDominant) {
            if (language === 'zh') {
                feedback = `${student.name}在${timeFrameZh}整体表现良好，在${behaviorDescription}等方面做得不错。继续加强这些优势，同时注意改善不足之处。`;
            } else {
                feedback = `${student.name} showed good overall performance ${timeFrame} with strengths in ${behaviorDescription}. Continue building these strengths while working on areas needing improvement.`;
            }
        } else if (pattern.balanced) {
            if (language === 'zh') {
                feedback = `${student.name}在${timeFrameZh}表现较为均衡，在${behaviorDescription}等方面有亮点，但也有需要改进的地方。我们将继续引导学生平衡发展。`;
            } else {
                feedback = `${student.name} showed a mixed performance ${timeFrame} with highlights in ${behaviorDescription} but also areas needing improvement. We'll continue guiding balanced development.`;
            }
        } else if (pattern.concerning) {
            if (language === 'zh') {
                feedback = `${student.name}在${timeFrameZh}需要更多关注和支持。在${behaviorDescription}等方面存在挑战，我们正与学生一起努力改善这些问题。`;
            } else {
                feedback = `${student.name} needs additional support ${timeFrame}. Challenges appeared in ${behaviorDescription}, and we're working with the student to address these issues.`;
            }
        } else if (pattern.highlyActive) {
            if (language === 'zh') {
                feedback = `${student.name}在${timeFrameZh}参与度很高，活动频繁，涉及${behaviorDescription}等多个方面。我们将帮助学生更好地管理自己的行为，发挥优势。`;
            } else {
                feedback = `${student.name} was very active ${timeFrame} across multiple areas including ${behaviorDescription}. We'll help channel this energy positively.`;
            }
        } else {
            if (language === 'zh') {
                feedback = `${student.name}在${timeFrameZh}的表现反映了${behaviorDescription}等情况。我们将继续观察并支持学生的成长。`;
            } else {
                feedback = `${student.name}'s performance ${timeFrame} reflected ${behaviorDescription}. We'll continue monitoring and supporting their growth.`;
            }
        }

        return feedback;
    }

    /* ================= 📊 MAIN COMPONENT ================= */

    export default function ReportsPage({ activeClass, studentId, isParentView, onBack }) {
        const { setPageId } = usePageHelp();

        // Set page ID for help context
        useEffect(() => {
            setPageId('reports');
        }, [setPageId]);

        // Editable feedback state
        const [editingFeedback, setEditingFeedback] = useState({}); // { [studentId]: true/false }
        const [feedback, setFeedback] = useState({}); // { [studentId]: text }
        const [timePeriod, setTimePeriod] = useState('week'); // 'week', 'month', 'year'
        const [language, setLanguage] = useState('en'); // 'en' or 'zh'
        const [selectedStudentId, setSelectedStudentId] = useState(studentId || '');
        const [realStats, setRealStats] = useState({});
        const reportContentRef = useRef(null);

        // Responsive Hooks
        const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
        useEffect(() => {
            if (typeof window !== 'undefined') {
                const handleResize = () => setWindowWidth(window.innerWidth);
                window.addEventListener('resize', handleResize);
                return () => window.removeEventListener('resize', handleResize);
            }
        }, []);

        const isMobile = windowWidth < 768;
        const isTablet = windowWidth < 1024;

        // Exam sidebar state
        const [examSidebarOpen, setExamSidebarOpen] = useState(false);
        const [examData, setExamData] = useState([]);
        const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
        const [homeworkData, setHomeworkData] = useState([]);

        // Fetch exam data
        useEffect(() => {
            const fetchExamData = async () => {
                if (!activeClass?.id) return;
                try {
                    // Try fetching with expand to get relation data
                    const res = await api.pbRequest('/collections/exams/records?perPage=500&expand=class_id');
                    const classExams = (res.items || []).filter(e => {
                        // Handle expanded relation: PocketBase returns it as expand.class_id object
                        let examClassId = e.class_id;
                        if (e.expand?.class_id) {
                            examClassId = e.expand.class_id.id;
                        } else if (typeof e.class_id === 'object' && e.class_id?.id) {
                            examClassId = e.class_id.id;
                        }
                        return examClassId === activeClass.id;
                    });
                    setExamData(classExams);
                } catch (error) {
                    console.error('Failed to fetch exam data:', error);
                }
            };
            fetchExamData();
        }, [activeClass?.id]);

        // Fetch homework data (graded submissions)
        useEffect(() => {
            const fetchHomeworkData = async () => {
                if (!activeClass?.id) return;
                try {
                    const res = await api.pbRequest('/collections/classes/records');
                    const classData = (res.items || []).find(c => c.id === activeClass.id);
                    if (classData?.submissions) {
                        const submissions = typeof classData.submissions === 'string' 
                            ? JSON.parse(classData.submissions) 
                            : classData.submissions;
                        const gradedSubmissions = submissions.filter(s => s.grade !== undefined && s.grade !== null);
                        setHomeworkData(gradedSubmissions);
                    }
                } catch (error) {
                    console.error('Failed to fetch homework data:', error);
                }
            };
            fetchHomeworkData();
        }, [activeClass?.id]);

        const handleExamSave = () => {
            // Refresh exam data
            const fetchExamData = async () => {
                try {
                    const res = await api.pbRequest('/collections/exams/records?perPage=500&expand=class_id');
                    const classExams = (res.items || []).filter(e => {
                        // Handle expanded relation: PocketBase returns it as expand.class_id object
                        let examClassId = e.class_id;
                        if (e.expand?.class_id) {
                            examClassId = e.expand.class_id.id;
                        } else if (typeof e.class_id === 'object' && e.class_id?.id) {
                            examClassId = e.class_id.id;
                        }
                        return examClassId === activeClass.id;
                    });
                    setExamData(classExams);
                } catch (error) {
                    console.error('Failed to fetch exam data:', error);
                }
            };
            fetchExamData();
        };

        // Get exam scores for a student
        const getStudentExamScores = (studentId) => {
            const scores = [];
            examData.forEach(exam => {
                const score = exam.scores?.[studentId];
                if (score) {
                    scores.push({
                        examName: exam.exam_name,
                        subject: exam.subject,
                        date: exam.exam_date,
                        score: score.total_score,
                        benchmark: score.benchmark,
                        percentage: score.percentage,
                        sections: score.sections
                    });
                }
            });
            return scores.sort((a, b) => new Date(a.date) - new Date(b.date));
        };

        // Get homework scores for a student
        const getStudentHomeworkScores = (studentId) => {
            const scores = homeworkData
                .filter(h => h.student_id === studentId && h.grade !== undefined && h.grade !== null)
                .map(h => ({
                    assignmentName: h.assignment_name || 'Homework',
                    date: h.submitted_at || new Date().toISOString(),
                    score: Number(h.grade) || 0
                }))
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            return scores;
        };

        // Get unique subjects from exam data
        const getUniqueSubjects = () => {
            const subjects = [...new Set(examData.map(e => e.subject))];
            return subjects;
        };

        // Get subject performance for a student
        const getSubjectPerformance = (studentId) => {
            const scores = getStudentExamScores(studentId);
            const subjectData = {};
            scores.forEach(s => {
                if (!subjectData[s.subject]) {
                    subjectData[s.subject] = { total: 0, count: 0 };
                }
                subjectData[s.subject].total += s.percentage;
                subjectData[s.subject].count += 1;
            });
            return Object.entries(subjectData).map(([subject, data]) => ({
                subject,
                average: Math.round(data.total / data.count)
            })).sort((a, b) => b.average - a.average);
        };

        // 1. SECURITY FILTER
        const displayStudents = useMemo(() => {
            if (!activeClass || !activeClass.students) return [];
            if (studentId) {
                return activeClass.students.filter(s => s.id.toString() === studentId.toString());
            }
            if (selectedStudentId) {
                return activeClass.students.filter(s => s.id.toString() === selectedStudentId.toString());
            }
            return activeClass.students;
        }, [activeClass, studentId, selectedStudentId]);

        // Fetch real behavior data
        useEffect(() => {
            const fetchRealStats = async () => {
                const stats = {};

                for (const student of displayStudents) {
                    const studentHistory = student.history || [];
                    const filteredHistory = filterHistoryByTimePeriod(studentHistory, timePeriod);
                    const positiveBehaviors = filteredHistory.filter(h => h.pts > 0);
                    const negativeBehaviors = filteredHistory.filter(h => h.pts < 0);
                    const positiveTotal = positiveBehaviors.reduce((sum, h) => sum + h.pts, 0);
                    const negativeTotal = negativeBehaviors.reduce((sum, h) => sum + h.pts, 0);

                    const positiveByCard = {};
                    const negativeByCard = {};

                    positiveBehaviors.forEach(h => {
                        positiveByCard[h.label] = (positiveByCard[h.label] || 0) + h.pts;
                    });

                    negativeBehaviors.forEach(h => {
                        negativeByCard[h.label] = (negativeByCard[h.label] || 0) + Math.abs(h.pts);
                    });

                    stats[student.id] = {
                        positive: {
                            total: positiveTotal,
                            byCard: positiveByCard,
                            wowCount: positiveBehaviors.length
                        },
                        negative: {
                            total: negativeTotal,
                            byCard: negativeByCard,
                            nonoCount: negativeBehaviors.length
                        }
                    };
                }
                setRealStats(stats);
            };

            if (displayStudents.length > 0) {
                fetchRealStats();
            }
        }, [displayStudents, timePeriod]);

        const filterHistoryByTimePeriod = (history, period) => {
            const now = new Date();
            let cutoffDate;

            switch (period) {
                case 'week':
                    cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    break;
                case 'year':
                    cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    break;
                default:
                    cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            }

            return history.filter(entry => {
                const entryDate = new Date(entry.timestamp);
                return entryDate >= cutoffDate;
            });
        };

        const getStudentStats = (student) => {
            return realStats[student.id] || {
                positive: { total: 0, byCard: {}, wowCount: 0 },
                negative: { total: 0, byCard: {}, nonoCount: 0 }
            };
        };

        const getDailyBehaviorData = (student) => {
            const studentHistory = student.history || [];
            const filteredHistory = filterHistoryByTimePeriod(studentHistory, timePeriod);
            const dailyTotals = {};

            filteredHistory.forEach(entry => {
                const entryDate = new Date(entry.timestamp);
                let dateKey;

                if (timePeriod === 'week') {
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    dateKey = days[entryDate.getDay()];
                } else if (timePeriod === 'month') {
                    dateKey = `Day ${entryDate.getDate()}`;
                } else {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    dateKey = months[entryDate.getMonth()];
                }

                dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + entry.pts;
            });

            let labels = [];
            if (timePeriod === 'week') {
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            } else if (timePeriod === 'month') {
                labels = Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`);
            } else {
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            }

            const data = labels.map(label => dailyTotals[label] || 0);

            return {
                labels: labels,
                datasets: [{
                    label: 'Total Points',
                    data: data,
                    backgroundColor: '#4CAF50',
                    borderRadius: 8
                }]
            };
        };

        const t = translations[language];

        // Download as PDF - uses html2canvas to capture entire report including Highcharts charts
        const handleDownload = async () => {
            if (!displayStudents.length || typeof document === 'undefined') return;

            try {
                const { default: jsPDF } = await import('jspdf');
                const pdf = new jsPDF('p', 'mm', 'a4', true);
                const imgWidth = 210; // A4 width in mm
                const pageHeight = 297; // A4 height in mm

                // Load html2canvas dynamically
                const { default: html2canvas } = await import('html2canvas');

                // Capture each student report separately
                for (let i = 0; i < displayStudents.length; i++) {
                    const student = displayStudents[i];

                    // Create a temporary container for this student
                    const tempContainer = document.createElement('div');
                    tempContainer.style.position = 'fixed';
                    tempContainer.style.left = '-9999px';
                    tempContainer.style.top = '0';
                    tempContainer.style.width = '100%';
                    tempContainer.style.background = '#ffffff';
                    tempContainer.style.padding = '30px';
                    document.body.appendChild(tempContainer);

                    // Clone the student's report card
                    const reportContentRef = document.querySelector('[class="report-card"]');
                    const studentCards = document.querySelectorAll('.report-card');
                    const studentCard = studentCards[i];

                    if (studentCard) {
                        const clonedCard = studentCard.cloneNode(true);
                        tempContainer.appendChild(clonedCard);

                        // Wait for charts to render
                        await new Promise(resolve => setTimeout(resolve, 500));

                        // Capture this student's report
                        const canvas = await html2canvas(tempContainer, {
                            scale: 1.2,
                            useCORS: true,
                            logging: false,
                            backgroundColor: '#ffffff',
                            allowTaint: true,
                            onclone: (clonedDoc) => {
                                const charts = clonedDoc.querySelectorAll('.highcharts-container');
                                charts.forEach(chart => {
                                    chart.style.visibility = 'visible';
                                });
                            }
                        });

                        const imgData = canvas.toDataURL('image/png', 1.0);

                        // Calculate height to fit page
                        const imgHeight = (canvas.height * imgWidth) / canvas.width;
                        const maxImgHeight = pageHeight - 40; // Leave 20mm margin top/bottom

                        // If content fits on one page, scale it to fit
                        let finalImgHeight = imgHeight;
                        let finalImgWidth = imgWidth;
                        let yOffset = 20;

                        if (imgHeight > maxImgHeight) {
                            const scaleFactor = maxImgHeight / imgHeight;
                            finalImgHeight = maxImgHeight;
                            finalImgWidth = imgWidth * scaleFactor;
                            yOffset = 20 + (maxImgHeight - finalImgHeight) / 2;
                        }

                        // Add new page for each student (except first)
                        if (i > 0) {
                            pdf.addPage();
                        }

                        // Add image to PDF with centering
                        pdf.addImage(
                            imgData,
                            'PNG',
                            (210 - finalImgWidth) / 2, // Center horizontally
                            yOffset,
                            finalImgWidth,
                            finalImgHeight,
                            undefined,
                            'FAST'
                        );
                    }

                    // Clean up
                    document.body.removeChild(tempContainer);
                }

                // Save PDF
                const filename = selectedStudentId
                    ? `${activeClass?.students?.find(s => s.id === selectedStudentId)?.name || 'student'}_${timePeriod}_report.pdf`
                    : `${activeClass?.name || 'class'}_${timePeriod}_report.pdf`;

                pdf.save(filename);
            } catch (error) {
                console.error('Failed to generate PDF:', error);
                if (typeof alert !== 'undefined') {
                    alert('Failed to generate PDF. Please try again.');
                }
            }
        };

        // Print - triggers browser print (Highcharts SVG prints natively)
        const handlePrint = () => {
            if (typeof window !== 'undefined') {
                window.print();
            }
        };

        return (
            <div className="safe-area-top" style={{ ...styles.container, padding: isMobile ? '20px' : '40px' }}>
                <div className="safe-area-top" style={{
                    ...styles.header,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: isMobile ? '10px' : '0',
                    position: 'relative',
                    paddingBottom: isMobile ? '10px' : '20px',
                }}>
                    {/* Header Left: Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        {!isParentView && !isMobile && (
                            <h1 style={{ ...styles.mainTitle, fontSize: isMobile ? '18px' : '24px', margin: 0 }}>
                                {selectedStudentId && !isParentView
                                    ? `${activeClass?.students?.find(s => s.id === selectedStudentId)?.name || ''} - ${t.mainTitle(isParentView, activeClass?.name)}`
                                    : t.mainTitle(isParentView, activeClass?.name)}
                            </h1>
                        )}
                        {isMobile && !isParentView && (
                            <h1 style={{ ...styles.mainTitle, fontSize: '18px', margin: 0 }}>
                                {t.mainTitle(isParentView, activeClass?.name)}
                            </h1>
                        )}
                    </div>
                    {/* Header Right: Select Menus and X Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 12, position: 'relative', width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? 'calc(100% - 40px)' : 'auto' }}>
                        {/* Language Select (Desktop only) */}
                        {!isMobile && (
                            <div style={{ position: 'relative' }}>
                                {/* Mobile Dropdown Menu */}
                                {mobileMenuOpen && (
                                    <>
                                        <div
                                            style={{
                                                position: 'fixed',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                zIndex: 9998
                                            }}
                                            onClick={() => setMobileMenuOpen(false)}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            marginTop: '8px',
                                            background: '#fff',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                            minWidth: '200px',
                                            zIndex: 9999,
                                            overflow: 'hidden',
                                            border: '1px solid #e0e0e0',
                                            animation: 'fadeInDown 0.2s ease-out'
                                        }}>
                                            {/* Language */}
                                            <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
                                                <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Language</label>
                                                <select
                                                    value={language}
                                                    onChange={e => { setLanguage(e.target.value); setMobileMenuOpen(false); }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e0e0e0',
                                                        fontSize: '14px',
                                                        background: '#f5f5f7',
                                                        color: '#333'
                                                    }}
                                                >
                                                    <option value="en">English</option>
                                                    <option value="zh">中文</option>
                                                </select>
                                            </div>
                                            {/* Period */}
                                            <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
                                                <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Period</label>
                                                <select
                                                    value={timePeriod || 'week'}
                                                    onChange={e => { setTimePeriod(e.target.value); setMobileMenuOpen(false); }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e0e0e0',
                                                        fontSize: '14px',
                                                        background: '#f5f5f7',
                                                        color: '#333'
                                                    }}
                                                >
                                                    <option value="week">{t.week}</option>
                                                    <option value="month">{t.month}</option>
                                                    <option value="year">{t.year}</option>
                                                </select>
                                            </div>
                                            {/* Student */}
                                            {!studentId && activeClass && activeClass.students && activeClass.students.length > 1 && (
                                                <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
                                                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Student</label>
                                                    <select
                                                        value={selectedStudentId}
                                                        onChange={e => { setSelectedStudentId(e.target.value); setMobileMenuOpen(false); }}
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px 10px',
                                                            borderRadius: '6px',
                                                            border: '1px solid #e0e0e0',
                                                            fontSize: '14px',
                                                            background: '#fff',
                                                            color: '#333'
                                                        }}
                                                    >
                                                        <option value="">{t.selectStudents}</option>
                                                        {activeClass.students.map((student) => (
                                                            <option key={student.id} value={student.id}>
                                                                {student.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {/* Add Exam Scores */}
                                            <button
                                                onClick={() => {
                                                    setExamSidebarOpen(true);
                                                    setMobileMenuOpen(false);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    border: 'none',
                                                    background: 'none',
                                                    textAlign: 'left',
                                                    fontSize: '14px',
                                                    color: '#333',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                                onMouseLeave={(e) => e.target.style.background = 'none'}
                                            >
                                                <Plus size={16} /> Add Exam Scores
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        {/* Language Select (Desktop only) */}
                        {!isMobile && (
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={language}
                                    onChange={e => setLanguage(e.target.value)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        fontWeight: 700,
                                        fontSize: '15px',
                                        background: '#f5f5f7',
                                        color: '#333',
                                        marginRight: 4,
                                        textAlign: 'left',
                                    }}
                                    aria-label="Select language"
                                >
                                    <option value="en">English</option>
                                    <option value="zh">中文</option>
                                </select>
                            </div>
                        )}
                        {/* Period Select (Desktop only) */}
                        {!isMobile && (
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={timePeriod || 'week'}
                                    onChange={e => setTimePeriod(e.target.value)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        fontWeight: 700,
                                        fontSize: '15px',
                                        background: '#f5f5f7',
                                        color: '#333',
                                        marginRight: 4,
                                        textAlign: 'left',
                                    }}
                                    aria-label="Select period"
                                >
                                    <option value="week">{t.week}</option>
                                    <option value="month">{t.month}</option>
                                    <option value="year">{t.year}</option>
                                </select>
                            </div>
                        )}
                        {/* Student Select (Desktop only) */}
                        {!isMobile && !studentId && activeClass && activeClass.students && activeClass.students.length > 1 && (
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={selectedStudentId}
                                    onChange={e => setSelectedStudentId(e.target.value)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        background: '#fff',
                                        color: '#333',
                                        minWidth: '100px',
                                        marginRight: 4,
                                        textAlign: 'left',
                                    }}
                                    aria-label="Select student"
                                >
                                    <option value="">{t.selectStudents}</option>
                                    {activeClass.students.map((student) => (
                                        <option key={student.id} value={student.id}>
                                            {student.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {/* Add Exam Scores Button (Desktop) */}
                        {!isParentView && !isMobile && (
                            <button
                                onClick={() => setExamSidebarOpen(true)}
                                style={{
                                    padding: '8px 16px',
                                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
                                }}
                            >
                                <Plus size={16} /> Add Exam Scores
                            </button>
                        )}
                        {/* X Button (Desktop only) */}
                        {!isParentView && !isMobile && (
                            <button
                                onClick={onBack || (typeof window !== 'undefined' ? () => window.history.back() : () => {})}
                                style={{
                                    ...styles.goBackBtn,
                                    padding: '2px 4px',
                                    fontSize: '18px',
                                    background: '#fff',
                                    border: '1.5px solid #e0e0e0'
                                }}
                                aria-label="Go back"
                            >
                                <X size={24} />
                            </button>
                        )}
                        {/* Mobile Menu Button - far right - fixed at top with highest z-index */}
                        {isMobile && !isParentView && (
                            <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 99999 }}>
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    aria-label="Menu"
                                    aria-expanded={mobileMenuOpen}
                                    style={{
                                        padding: '8px',
                                        background: '#fff',
                                        border: '1.5px solid #e0e0e0',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}
                                >
                                    <MoreVertical size={20} />
                                </button>
                                {/* Mobile Dropdown Menu */}
                                {mobileMenuOpen && (
                                    <>
                                        <div
                                            style={{
                                                position: 'fixed',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                zIndex: 99998
                                            }}
                                            onClick={() => setMobileMenuOpen(false)}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            marginTop: '8px',
                                            background: '#fff',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                            minWidth: '200px',
                                            zIndex: 99999,
                                            overflow: 'hidden',
                                            border: '1px solid #e0e0e0'
                                        }}>
                                            {/* Close/Go Back */}
                                            <button
                                                onClick={() => {
                                                    (onBack || (typeof window !== 'undefined' ? () => window.history.back() : () => {}))();
                                                    setMobileMenuOpen(false);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    border: 'none',
                                                    background: 'none',
                                                    textAlign: 'left',
                                                    fontSize: '14px',
                                                    color: '#333',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                                onMouseLeave={(e) => e.target.style.background = 'none'}
                                            >
                                                <X size={16} /> Close
                                            </button>
                                            {/* Language */}
                                            <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
                                                <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Language</label>
                                                <select
                                                    value={language}
                                                    onChange={e => { setLanguage(e.target.value); setMobileMenuOpen(false); }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e0e0e0',
                                                        fontSize: '14px',
                                                        background: '#f5f5f7',
                                                        color: '#333'
                                                    }}
                                                >
                                                    <option value="en">English</option>
                                                    <option value="zh">中文</option>
                                                </select>
                                            </div>
                                            {/* Period */}
                                            <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
                                                <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Period</label>
                                                <select
                                                    value={timePeriod || 'week'}
                                                    onChange={e => { setTimePeriod(e.target.value); setMobileMenuOpen(false); }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e0e0e0',
                                                        fontSize: '14px',
                                                        background: '#f5f5f7',
                                                        color: '#333'
                                                    }}
                                                >
                                                    <option value="week">{t.week}</option>
                                                    <option value="month">{t.month}</option>
                                                    <option value="year">{t.year}</option>
                                                </select>
                                            </div>
                                            {/* Student */}
                                            {!studentId && activeClass && activeClass.students && activeClass.students.length > 1 && (
                                                <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
                                                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Student</label>
                                                    <select
                                                        value={selectedStudentId}
                                                        onChange={e => { setSelectedStudentId(e.target.value); setMobileMenuOpen(false); }}
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px 10px',
                                                            borderRadius: '6px',
                                                            border: '1px solid #e0e0e0',
                                                            fontSize: '14px',
                                                            background: '#fff',
                                                            color: '#333'
                                                        }}
                                                    >
                                                        <option value="">{t.selectStudents}</option>
                                                        {activeClass.students.map((student) => (
                                                            <option key={student.id} value={student.id}>
                                                                {student.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {/* Add Exam Scores */}
                                            <button
                                                onClick={() => {
                                                    setExamSidebarOpen(true);
                                                    setMobileMenuOpen(false);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    border: 'none',
                                                    background: 'none',
                                                    textAlign: 'left',
                                                    fontSize: '14px',
                                                    color: '#333',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                                                onMouseLeave={(e) => e.target.style.background = 'none'}
                                            >
                                                <Plus size={16} /> Add Exam Scores
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {displayStudents.length === 0 ? (
                    <div style={styles.emptyState}>{t.emptyState}</div>
                ) : (
                    <div style={{ position: 'relative' }}>
                        {/* Download and Print Buttons - Top Right of Body */}
                        <div style={{
                            position: 'absolute',
                            top: isMobile ? '10px' : '20px',
                            right: isMobile ? '10px' : '20px',
                            zIndex: 10,
                            display: 'flex',
                            gap: isMobile ? 6 : 8
                        }}>
                            <button 
                                onClick={handleDownload} 
                                style={{ 
                                    ...styles.downloadPrintBtn,
                                    padding: isMobile ? '8px 12px' : '10px 16px',
                                    fontSize: isMobile ? '12px' : '14px',
                                    minWidth: isMobile ? 'auto' : '80px'
                                }}
                                title="Download PDF"
                            >
                                <Download size={isMobile ? 14 : 16} />
                                {!isMobile && <span style={{ marginLeft: '6px' }}>PDF</span>}
                            </button>
                            <button 
                                onClick={handlePrint} 
                                style={{ 
                                    ...styles.downloadPrintBtn,
                                    padding: isMobile ? '8px 12px' : '10px 16px',
                                    fontSize: isMobile ? '12px' : '14px',
                                    minWidth: isMobile ? 'auto' : '80px'
                                }}
                                title="Print"
                            >
                                <Printer size={isMobile ? 14 : 16} />
                                {!isMobile && <span style={{ marginLeft: '6px' }}>Print</span>}
                            </button>
                        </div>

                        {/* Report Content - for PDF capture */}
                        <div ref={reportContentRef} style={{ paddingTop: isMobile ? '60px' : '80px' }}>
                            {displayStudents.map(student => {
                        const stats = getStudentStats(student);
                        const teacherNote = generateTeacherNote(student, stats, timePeriod, language);
                        const doughnutData = {
                            labels: [
                                language === 'zh' ? '积极行为' : 'Positive Behaviors',
                                language === 'zh' ? '需改进行为' : 'Needs Work'
                            ],
                            datasets: [{
                                data: [Math.abs(stats.positive.total) || 0, Math.abs(stats.negative.total) || 0],
                                backgroundColor: ['#4CAF50', '#FF5252'],
                                borderWidth: 0,
                            }]
                        };
                        
                        return (
                            <div key={student.id} className="report-card" style={{ ...styles.reportCard, padding: isMobile ? '20px' : '30px' }}>
                                
                                <div style={styles.cardTop}>
                                    <div style={styles.studentMeta}>
                                        <div style={styles.avatarCircle}>
                                            {student.avatar && student.avatar.trim() !== '' ? (
                                                <img
                                                    src={student.avatar}
                                                    alt={student.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        // If the image fails to load, replace it with the letter
                                                        e.target.style.display = 'none';
                                                        e.target.parentNode.innerText = student.name.charAt(0);
                                                    }}
                                                />
                                            ) : student.character ? (
                                                <img
                                                    src={boringAvatar(student.gender || 'boy', student.id)}
                                                    alt={student.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentNode.innerText = student.name.charAt(0);
                                                    }}
                                                />
                                            ) : (
                                                <span>{student.name.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h2 style={styles.sName}>{student.name}</h2>
                                            <div style={styles.idTag}>ID: {student.id}</div>
                                        </div>
                                    </div>
                                    <div style={styles.scoreBox}>
                                        <div style={styles.bigScore}>{student.score || 0}</div>
                                        <div style={styles.scoreLabel}>{t.totalPoints}</div>
                                    </div>
                                </div>

                                <div style={styles.aiInsightSection}>
                                    <div style={styles.aiPulse} />
                                    <p style={styles.aiText}><strong>{t.aiSummary}</strong></p>
                                    {/* Editable feedback section (read-only for parents) */}
                                    {isParentView ? (
                                        <div style={{ marginTop: 8, fontSize: 15 }} dangerouslySetInnerHTML={{ __html: feedback[student.id] || teacherNote }} />
                                    ) : (
                                        <>
                                            {editingFeedback[student.id] ? (
                                                <SimpleWysiwyg
                                                    value={typeof feedback[student.id] === 'string' ? feedback[student.id] : (typeof teacherNote === 'string' ? teacherNote : '')}
                                                    onChange={e => setFeedback(f => ({ ...f, [student.id]: e && e.target && typeof e.target.value === 'string' ? e.target.value : '' }))}
                                                    style={{ width: '100%', minHeight: 80, marginTop: 8, borderRadius: 8 }}
                                                />
                                            ) : (
                                                <div style={{ marginTop: 8, fontSize: 15 }} dangerouslySetInnerHTML={{ __html: feedback[student.id] || teacherNote }} />
                                            )}
                                            <div style={{ marginTop: 8 }}>
                                                {editingFeedback[student.id] ? (
                                                    <button
                                                        className="feedback-edit-button"
                                                        style={{ ...styles.goBackBtn, color: '#4CAF50', borderColor: '#4CAF50', marginRight: 8 }}
                                                        onClick={() => setEditingFeedback(e => ({ ...e, [student.id]: false }))}
                                                    >
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="feedback-edit-button"
                                                        style={{ ...styles.goBackBtn, color: '#6366f1', borderColor: '#6366f1', marginRight: 8 }}
                                                        onClick={() => setEditingFeedback(e => ({ ...e, [student.id]: true }))}
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div style={{
                                    ...styles.bentoGrid,
                                    flexDirection: isTablet ? 'column' : 'row'
                                }}>
            <div style={styles.gridItemLarge}>
                <h4 style={styles.chartTitle}>In Class Performance</h4>
                                        <div style={{ height: '200px' }}>
                                            <Suspense fallback={<div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Loading chart...</div>}>
                                                <HighchartsReact
                                                    highcharts={Highcharts}
                                                    options={{
                                                        chart: { type: 'column', height: 200, backgroundColor: 'transparent' },
                                                    title: { text: '' },
                                                    xAxis: { categories: getDailyBehaviorData(student).labels },
                                                    yAxis: {
                                                        title: { text: 'Points' },
                                                        min: 0
                                                    },
                                                    legend: { enabled: true },
                                                    plotOptions: {
                                                        column: { borderRadius: 8, color: '#4CAF50' }
                                                    },
                                                    series: [{
                                                        name: 'Total Points',
                                                        data: getDailyBehaviorData(student).datasets[0].data
                                                    }],
                                                    credits: { enabled: false },
                                                    exporting: { enabled: true }
                                                }}
                                            />
                                            </Suspense>
                                        </div>
                                    </div>

                                    <div style={styles.gridItemSmall}>
                                        <h4 style={styles.chartTitle}>{t.ratio}</h4>
                                        <div style={{ height: '150px' }}>
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                options={{
                                                    chart: { type: 'pie', height: 150, backgroundColor: 'transparent' },
                                                    title: { text: '' },
                                                    plotOptions: {
                                                        pie: {
                                                            innerSize: '70%',
                                                            dataLabels: { enabled: false },
                                                            showInLegend: true
                                                        }
                                                    },
                                                    legend: {
                                                        enabled: true,
                                                        align: 'center',
                                                        verticalAlign: 'bottom',
                                                        layout: 'horizontal',
                                                        itemStyle: { fontSize: '10px' }
                                                    },
                                                    series: [{
                                                        name: 'Points',
                                                        data: [
                                                            { name: language === 'zh' ? '积极行为' : 'Positive Behaviors', y: Math.abs(stats.positive.total) || 0, color: '#4CAF50' },
                                                            { name: language === 'zh' ? '需改进行为' : 'Needs Work', y: Math.abs(stats.negative.total) || 0, color: '#FF5252' }
                                                        ]
                                                    }],
                                                    credits: { enabled: false },
                                                    exporting: { enabled: true }
                                                }}
                                            />
                                        </div>
                                        <div style={{ marginTop: 8, fontSize: 14 }}>
                                            <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                                                {t.positive}: {Math.abs(stats.positive.total) || 0}
                                            </span>
                                            {' '}|{' '}
                                            <span style={{ color: '#FF5252', fontWeight: 'bold' }}>
                                                {t.needsWork}: {Math.abs(stats.negative.total) || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Exam Scores Section */}
                                {(getStudentExamScores(student.id).length > 0 || getStudentHomeworkScores(student.id).length > 0) && (
                                    <div style={{
                                        marginTop: '25px',
                                        padding: '20px',
                                        background: '#fafafa',
                                        borderRadius: '16px',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <h3 style={{ 
                                            fontSize: '16px', 
                                            fontWeight: 'bold', 
                                            color: '#333', 
                                            marginBottom: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            📊 Academic Performance
                                        </h3>

                                        {/* Charts and Scores Grid */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: isTablet ? '1fr' : '2fr 1fr',
                                            gap: '16px',
                                            marginBottom: '20px'
                                        }}>
                                            {/* Left Column: Charts */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                {/* Exam Scores Line Chart */}
                                                {getStudentExamScores(student.id).length > 0 && (
                                                    <div style={{
                                                        background: '#fff',
                                                        padding: '16px',
                                                        borderRadius: '12px',
                                                        border: '1px solid #e0e0e0'
                                                    }}>
                                                        <h4 style={{
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                            marginBottom: '12px',
                                                            color: '#555'
                                                        }}>
                                                            📝                                                             Exam Scores Trend
                                                        </h4>
                                                        <div style={{ height: '180px' }}>
                                                            <HighchartsReact
                                                                highcharts={Highcharts}
                                                                options={{
                                                                    chart: { type: 'spline', height: 180, backgroundColor: 'transparent' },
                                                                    title: { text: '' },
                                                                    xAxis: {
                                                                        categories: getStudentExamScores(student.id).map(e =>
                                                                            new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                                        )
                                                                    },
                                                                    yAxis: {
                                                                        title: { text: 'Score %' },
                                                                        min: 0,
                                                                        max: 100,
                                                                        labels: { format: '{value}%' }
                                                                    },
                                                                    legend: { enabled: false },
                                                                    plotOptions: {
                                                                        spline: {
                                                                            marker: { radius: 4 },
                                            lineWidth: 2,
                                            color: '#4CAF50',
                                            fillOpacity: 0.1,
                                            fillColor: 'rgba(76, 175, 80, 0.1)',
                                            threshold: null
                                        }
                                    },
                                    series: [{
                                        name: 'Exam Score (%)',
                                        data: getStudentExamScores(student.id).map(e => e.percentage)
                                    }],
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.y}%</b>'
                                    },
                                    credits: { enabled: false },
                                    exporting: { enabled: true }
                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Homework Scores Line Chart */}
                                                {getStudentHomeworkScores(student.id).length > 0 && (
                                                    <div style={{
                                                        background: '#fff',
                                                        padding: '16px',
                                                        borderRadius: '12px',
                                                        border: '1px solid #e0e0e0'
                                                    }}>
                                                        <h4 style={{
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                            marginBottom: '12px',
                                                            color: '#555'
                                                        }}>
                                                            📚 Homework Scores Trend
                                                        </h4>
                                                        <div style={{ height: '180px' }}>
                                                            <HighchartsReact
                                                                highcharts={Highcharts}
                                                                options={{
                                                                    chart: { type: 'spline', height: 180, backgroundColor: 'transparent' },
                                                                    title: { text: '' },
                                                                    xAxis: {
                                                                        categories: getStudentHomeworkScores(student.id).map(h =>
                                                                            new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                                        )
                                                                    },
                                                                    yAxis: {
                                                                        title: { text: 'Score' },
                                                                        min: 0,
                                                                        labels: { format: '{value} pts' }
                                                                    },
                                                                    legend: { enabled: false },
                                                                    plotOptions: {
                                                                        spline: {
                                            marker: { radius: 4 },
                                            lineWidth: 2,
                                            color: '#6366f1',
                                            fillOpacity: 0.1,
                                            fillColor: 'rgba(99, 102, 241, 0.1)',
                                            threshold: null
                                        }
                                    },
                                    series: [{
                                        name: 'Homework Score',
                                        data: getStudentHomeworkScores(student.id).map(h => h.score)
                                    }],
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.y} pts</b>'
                                    },
                                    credits: { enabled: false },
                                    exporting: { enabled: true }
                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Subject Performance Bar Chart (only if 2+ subjects) */}
                                                {getSubjectPerformance(student.id).length >= 2 && (
                                                    <div style={{
                                                        background: '#fff',
                                                        padding: '16px',
                                                        borderRadius: '12px',
                                                        border: '1px solid #e0e0e0'
                                                    }}>
                                                        <h4 style={{
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                            marginBottom: '12px',
                                                            color: '#555'
                                                        }}>
                                                            📈 Performance by Subject
                                                        </h4>
                                                        <div style={{ height: '180px' }}>
                                                            <HighchartsReact
                                                                highcharts={Highcharts}
                                                                options={{
                                                                    chart: { type: 'column', height: 180, backgroundColor: 'transparent' },
                                                                    title: { text: '' },
                                                                    xAxis: {
                                                                        categories: getSubjectPerformance(student.id).map(s => s.subject)
                                                                    },
                                                                    yAxis: {
                                                                        title: { text: 'Average Score %' },
                                                                        min: 0,
                                                                        max: 100,
                                                                        labels: { format: '{value}%' }
                                                                    },
                                                                    legend: { enabled: false },
                                                                    plotOptions: {
                                                                        column: {
                                            borderRadius: 4,
                                            pointPadding: 0.2,
                                            groupPadding: 0.1
                                        }
                                    },
                                    series: [{
                                        name: 'Average Score',
                                        data: getSubjectPerformance(student.id).map(s => s.average),
                                        colorByPoint: true,
                                        colors: [
                                            'rgba(76, 175, 80, 0.8)',
                                            'rgba(99, 102, 241, 0.8)',
                                            'rgba(255, 152, 0, 0.8)',
                                            'rgba(233, 30, 99, 0.8)',
                                            'rgba(0, 188, 212, 0.8)'
                                        ]
                                    }],
                                    tooltip: {
                                        pointFormat: '{series.name}: <b>{point.y}%</b>'
                                    },
                                    credits: { enabled: false },
                                    exporting: { enabled: true }
                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right Column: Exam Scores List */}
                                            {getStudentExamScores(student.id).length > 0 && (
                                                <div style={{
                                                    background: '#fff',
                                                    padding: '16px',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e0e0e0',
                                                    maxHeight: isTablet ? 'auto' : '580px',
                                                    overflowY: 'auto'
                                                }}>
                                                    <h4 style={{
                                                        fontSize: '14px',
                                                        fontWeight: 'bold',
                                                        marginBottom: '12px',
                                                        color: '#555'
                                                    }}>
                                                        📝 Student Scores *
                                                    </h4>
                                                    <div style={{
                                                        fontSize: '12px',
                                                        color: '#888',
                                                        marginBottom: '12px',
                                                        paddingBottom: '12px',
                                                        borderBottom: '1px solid #f0f0f0'
                                                    }}>
                                                        Benchmark: {getStudentExamScores(student.id).length > 0 ? getStudentExamScores(student.id)[0].benchmark : 0}
                                                    </div>
                                                    {getStudentExamScores(student.id).map((exam, idx) => (
                                                        <div key={idx} style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            padding: '10px 0',
                                                            borderBottom: idx < getStudentExamScores(student.id).length - 1 ? '1px solid #f0f0f0' : 'none'
                                                        }}>
                                                            <div>
                                                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                                                                    {exam.examName}
                                                                </div>
                                                                <div style={{ fontSize: '11px', color: '#888' }}>
                                                                    {exam.subject}
                                                                </div>
                                                            </div>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <div style={{
                                                                    fontSize: '16px',
                                                                    fontWeight: 'bold',
                                                                    color: exam.score >= exam.benchmark ? '#4CAF50' : exam.score >= exam.benchmark * 0.7 ? '#FF9800' : '#F44336'
                                                                }}>
                                                                    {exam.score}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Homework Scores List */}
                                        {getStudentHomeworkScores(student.id).length > 0 && (
                                            <div style={{
                                                background: '#fff',
                                                padding: '16px',
                                                borderRadius: '12px',
                                                border: '1px solid #e0e0e0'
                                            }}>
                                                <h4 style={{ 
                                                    fontSize: '14px', 
                                                    fontWeight: 'bold', 
                                                    marginBottom: '12px',
                                                    color: '#555'
                                                }}>
                                                    📚 Homework Report
                                                </h4>
                                                {getStudentHomeworkScores(student.id).map((hw, idx) => (
                                                    <div key={idx} style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '10px 0',
                                                        borderBottom: idx < getStudentHomeworkScores(student.id).length - 1 ? '1px solid #f0f0f0' : 'none'
                                                    }}>
                                                        <div>
                                                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                                                                {hw.assignmentName}
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: '#888' }}>
                                                                {new Date(hw.date).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <div style={{ 
                                                            fontSize: '16px', 
                                                            fontWeight: 'bold', 
                                                            color: hw.score >= 5 ? '#6366f1' : '#F44336'
                                                        }}>
                                                            {hw.score} pts
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                        </div>
                    </div>
                )}

                {/* Exam Sidebar */}
                <ExamSidebar 
                    isOpen={examSidebarOpen}
                    onClose={() => setExamSidebarOpen(false)}
                    activeClass={activeClass}
                    onSave={handleExamSave}
                />
            </div>
        );
    }

    const styles = {
        container: { background: '#fff', minHeight: '100vh', boxSizing: 'border-box' },
        header: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #f0f0f0', paddingBottom: '20px' },
        headerLeft: { display: 'flex', flexDirection: 'column', gap: '10px' },
        goBackBtn: {
            padding: '8px 16px',
            border: '1px solid #e0e0e0',
            background: '#fff',
            cursor: 'pointer',
            borderRadius: '8px',
            fontWeight: '900',
            color: '#e93535ff',
            fontSize: '14px',
            width: 'fit-content'
        },
        mainTitle: { fontWeight: '900', color: '#1a1a1a', margin: 0 },
        langSelector: { display: 'flex', background: '#f5f5f7', padding: '4px', borderRadius: '12px', width: 'fit-content' },
        langBtn: { padding: '8px 16px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '8px', fontWeight: '700', color: '#888' },
        langBtnActive: { background: '#fff', color: '#4CAF50', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
        rightControls: { display: 'flex', gap: '10px', alignItems: 'center' },
        studentSelect: {
            padding: '8px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            background: '#fff',
            cursor: 'pointer',
            minWidth: '150px'
        },
        filterBar: { display: 'flex', background: '#f5f5f7', padding: '4px', borderRadius: '12px' },
        periodBtn: { padding: '8px 16px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '8px', fontWeight: '700', color: '#888' },
        periodBtnActive: { background: '#fff', color: '#4CAF50', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
        reportCard: { background: '#fff', borderRadius: '24px', border: '1px solid #eee', padding: '30px', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' },
        cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' },
        studentMeta: { display: 'flex', alignItems: 'center', gap: '15px' },
        avatarCircle: {
            width: '60px',
            height: '60px',
            background: '#E8F5E9', // Light green background for the letter
            color: '#2E7D32',      // Dark green color for the letter
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',      // Size of the letter
            fontWeight: '900',     // Boldness of the letter
            border: '2px solid #4CAF50',
            overflow: 'hidden',
            flexShrink: 0,          // Prevents the circle from squishing on mobile
            position: 'relative'
        },
        sName: { margin: 0, fontSize: '20px', fontWeight: '800' },
        idTag: { fontSize: '12px', color: '#aaa' },
        scoreBox: { textAlign: 'center', background: '#F8FFF8', padding: '10px 20px', borderRadius: '16px', border: '1px solid #E8F5E9' },
        bigScore: { fontSize: '28px', fontWeight: '900', color: '#4CAF50' },
        scoreLabel: { fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#888' },
        aiInsightSection: { background: '#F8F9FA', padding: '20px', borderRadius: '18px', border: '1px solid #EDF2F7', marginBottom: '25px', position: 'relative' },
        aiText: { fontSize: '15px', lineHeight: '1.6', color: '#4A5568', margin: 0 },
        aiPulse: { position: 'absolute', top: '15px', right: '15px', width: '8px', height: '8px', background: '#6366f1', borderRadius: '50%', boxShadow: '0 0 10px #6366f1' },
        bentoGrid: { display: 'flex', gap: '20px' },
        gridItemLarge: { flex: 2, background: '#fcfcfc', padding: '20px', borderRadius: '24px', border: '1px solid #f0f0f0' },
        gridItemSmall: { flex: 1, background: '#fcfcfc', padding: '20px', borderRadius: '24px', border: '1px solid #f0f0f0', textAlign: 'center' },
        chartTitle: { fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', color: '#444' },
        emptyState: { textAlign: 'center', padding: '50px', color: '#ccc' },
        printBtn: { padding: '8px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
        downloadPrintBtn: {
            padding: '8px 12px',
            border: '1px solid #e0e0e0',
            background: '#fff',
            cursor: 'pointer',
            borderRadius: '8px',
            fontWeight: '600',
            color: '#6366f1',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        },
    };