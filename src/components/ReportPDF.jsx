
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Register fonts (optional - using system fonts for simplicity)
// Font.register({
//   family: 'Open Sans',
//   fonts: [
//     { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf', fontWeight: 'normal' },
//     { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Bold.ttf', fontWeight: 'bold' },
//   ],
// });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #4CAF50',
    paddingBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 9,
    color: '#666',
    marginBottom: 3,
  },
  studentSection: {
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
    padding: 14,
    borderRadius: 6,
    border: '1px solid #E0E0E0',
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  studentId: {
    fontSize: 8,
    color: '#888',
  },
  scoreBox: {
    backgroundColor: '#F8FFF8',
    padding: '8px 14px',
    borderRadius: 6,
    border: '1px solid #E8F5E9',
    textAlign: 'center',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  scoreLabel: {
    fontSize: 7,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#888',
  },
  feedbackSection: {
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 6,
    border: '1px solid #EDF2F7',
    marginBottom: 14,
  },
  feedbackTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#4A5568',
  },
  chartSection: {
    marginBottom: 14,
    pageBreakInside: 'avoid',
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  chartGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  chartItemLarge: {
    flex: 2,
    backgroundColor: '#FCFCFC',
    padding: 10,
    borderRadius: 6,
    border: '1px solid #F0F0F0',
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    pageBreakInside: 'avoid',
  },
  chartItemSmall: {
    flex: 1,
    backgroundColor: '#FCFCFC',
    padding: 10,
    borderRadius: 6,
    border: '1px solid #F0F0F0',
    minHeight: 70,
    justifyContent: 'center',
    alignItems: 'center',
    pageBreakInside: 'avoid',
  },
  chartPlaceholder: {
    fontSize: 8,
    color: '#999',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 6,
  },
  statItem: {
    fontSize: 9,
  },
  statPositive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  statNegative: {
    color: '#FF5252',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: '1px solid #E0E0E0',
    fontSize: 7,
    color: '#999',
    textAlign: 'center',
  },
});

const ReportPDF = ({ data, className, timePeriod, isParentView, language }) => {
  const translations = {
    en: {
      mainTitle: (cn, pv) => pv ? 'Student Progress Report' : `${cn} Reports`,
      periodLabel: 'Period',
      week: 'Week',
      month: 'Month',
      year: 'Year',
      aiSummary: 'Teacher Feedback:',
      totalPoints: 'Total Points',
      positive: 'Positive',
      needsWork: 'Needs Work',
      behaviorDistribution: 'Behavior Distribution',
      ratio: 'Ratio',
      generated: 'Generated:',
    },
    zh: {
      mainTitle: (cn, pv) => pv ? '学生成长报告' : `${cn} 报告`,
      periodLabel: '时段',
      week: '周',
      month: '月',
      year: '年',
      aiSummary: '教师反馈：',
      totalPoints: '总分',
      positive: '积极',
      needsWork: '需改进',
      behaviorDistribution: '行为分布',
      ratio: '比例',
      generated: '生成时间：',
    },
  };

  const t = translations[language] || translations.en;

  const getPeriodText = () => {
    const periodMap = {
      week: t.week,
      month: t.month,
      year: t.year,
    };
    return periodMap[timePeriod] || timePeriod;
  };

  const renderChartPlaceholder = (type, data) => {
    if (type === 'bar') {
      return (
        <View style={styles.chartItemLarge}>
          <Text style={styles.chartPlaceholder}>
            {t.behaviorDistribution} - {t.timePeriod}
          </Text>
          <Text style={{ fontSize: 8, color: '#999', marginTop: 4 }}>
            {data.labels?.join(', ')}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.chartItemSmall}>
        <Text style={styles.chartPlaceholder}>{t.ratio}</Text>
        <View style={styles.statsRow}>
          <Text style={[styles.statItem, styles.statPositive]}>
            {t.positive}: {data.positive || 0}
          </Text>
          <Text style={[styles.statItem, styles.statNegative]}>
            {t.negative}: {data.negative || 0}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Document>
      {data.map((student, index) => {
        const showPageBreak = index > 0;
        return (
          <Page key={student.id} size="A4" style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.title}>{t.mainTitle(className || 'Class', isParentView)}</Text>
              <Text style={styles.subtitle}>
                {t.periodLabel}: {getPeriodText()}
              </Text>
              <Text style={styles.subtitle}>
                {t.generated} {new Date().toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.studentSection}>
              <View style={styles.studentHeader}>
                <View>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentId}>ID: {student.id}</Text>
                </View>
                <View style={styles.scoreBox}>
                  <Text style={styles.score}>{student.score || 0}</Text>
                  <Text style={styles.scoreLabel}>{t.totalPoints}</Text>
                </View>
              </View>

              <View style={styles.feedbackSection}>
                <Text style={styles.feedbackTitle}>{t.aiSummary}</Text>
                <Text style={styles.feedbackText}>{student.feedback}</Text>
              </View>

              <View style={styles.chartSection}>
                <Text style={styles.chartTitle}>{t.behaviorDistribution}</Text>
                <View style={styles.chartGrid}>
                  {renderChartPlaceholder('bar', {
                    labels: student.dailyLabels,
                    data: student.dailyData,
                  })}
                  {renderChartPlaceholder('doughnut', {
                    positive: Math.abs(student.positiveTotal),
                    negative: Math.abs(student.negativeTotal),
                  })}
                </View>
              </View>
            </View>

            <Text style={styles.footer}>
              Generated by Klasiz.fun - Classroom Management Platform
            </Text>
          </Page>
        );
      })}
    </Document>
  );
};

export default ReportPDF;
