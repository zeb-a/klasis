import { useMemo, useState } from 'react';
import { Trophy, X, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import SafeAvatar from './SafeAvatar';
import { avatarByCharacter } from '../utils/avatar';
import { useTranslation } from '../i18n';
import { useTheme } from '../ThemeContext';

const ZONE_TOTALS = [500, 1000, 2000, 5000, 10000, 20000, 50000];
const ZONE_THEMES = [
  {
    sectionBg: 'rgba(34,197,94,0.10)',
    sectionBorder: 'rgba(34,197,94,0.35)',
    segmentColor: '#22c55e',
    pageBg: 'linear-gradient(165deg, #f0fdf4 0%, #dcfce7 48%, #ecfccb 100%)',
    dark: {
      sectionBg: 'rgba(34,197,94,0.15)',
      sectionBorder: 'rgba(34,197,94,0.40)',
      segmentColor: '#4ade80',
      pageBg: 'linear-gradient(165deg, #052e16 0%, #0d3d22 48%, #145a29 100%)'
    }
  },
  {
    sectionBg: 'rgba(59,130,246,0.10)',
    sectionBorder: 'rgba(59,130,246,0.35)',
    segmentColor: '#3b82f6',
    pageBg: 'linear-gradient(165deg, #eff6ff 0%, #dbeafe 48%, #e0e7ff 100%)',
    dark: {
      sectionBg: 'rgba(59,130,246,0.15)',
      sectionBorder: 'rgba(59,130,246,0.40)',
      segmentColor: '#60a5fa',
      pageBg: 'linear-gradient(165deg, #1e3a8a 0%, #1e40af 48%, #1d4ed8 100%)'
    }
  },
  {
    sectionBg: 'rgba(168,85,247,0.12)',
    sectionBorder: 'rgba(168,85,247,0.38)',
    segmentColor: '#a855f7',
    pageBg: 'linear-gradient(165deg, #faf5ff 0%, #f3e8ff 48%, #ede9fe 100%)',
    dark: {
      sectionBg: 'rgba(168,85,247,0.15)',
      sectionBorder: 'rgba(168,85,247,0.42)',
      segmentColor: '#c084fc',
      pageBg: 'linear-gradient(165deg, #581c87 0%, #6b21a8 48%, #7c3aed 100%)'
    }
  },
  {
    sectionBg: 'rgba(234,179,8,0.12)',
    sectionBorder: 'rgba(234,179,8,0.40)',
    segmentColor: '#eab308',
    pageBg: 'linear-gradient(165deg, #fffbeb 0%, #fef3c7 48%, #fde68a 100%)',
    dark: {
      sectionBg: 'rgba(234,179,8,0.15)',
      sectionBorder: 'rgba(234,179,8,0.45)',
      segmentColor: '#facc15',
      pageBg: 'linear-gradient(165deg, #713f12 0%, #854d0e 48%, #a16207 100%)'
    }
  },
  {
    sectionBg: 'rgba(239,68,68,0.10)',
    sectionBorder: 'rgba(239,68,68,0.35)',
    segmentColor: '#ef4444',
    pageBg: 'linear-gradient(165deg, #fff1f2 0%, #ffe4e6 48%, #fecdd3 100%)',
    dark: {
      sectionBg: 'rgba(239,68,68,0.15)',
      sectionBorder: 'rgba(239,68,68,0.40)',
      segmentColor: '#f87171',
      pageBg: 'linear-gradient(165deg, #7f1d1d 0%, #991b1b 48%, #b91c1c 100%)'
    }
  },
  {
    sectionBg: 'rgba(20,184,166,0.12)',
    sectionBorder: 'rgba(20,184,166,0.38)',
    segmentColor: '#14b8a6',
    pageBg: 'linear-gradient(165deg, #f0fdfa 0%, #ccfbf1 48%, #a7f3d0 100%)',
    dark: {
      sectionBg: 'rgba(20,184,166,0.15)',
      sectionBorder: 'rgba(20,184,166,0.42)',
      segmentColor: '#2dd4bf',
      pageBg: 'linear-gradient(165deg, #134e4a 0%, #115e59 48%, #0f766e 100%)'
    }
  },
  {
    sectionBg: 'rgba(79,70,229,0.12)',
    sectionBorder: 'rgba(79,70,229,0.40)',
    segmentColor: '#4f46e5',
    pageBg: 'linear-gradient(165deg, #eef2ff 0%, #e0e7ff 48%, #ddd6fe 100%)',
    dark: {
      sectionBg: 'rgba(79,70,229,0.15)',
      sectionBorder: 'rgba(79,70,229,0.45)',
      segmentColor: '#818cf8',
      pageBg: 'linear-gradient(165deg, #312e81 0%, #3730a3 48%, #4338ca 100%)'
    }
  }
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function avatarSrc(student) {
  const a = student.avatar;
  if (!a) return null;
  if (a.startsWith('data:') || a.startsWith('http')) return a;
  try {
    return avatarByCharacter(a);
  } catch {
    return a;
  }
}

export default function EggRoad({ classData, onBack, allClasses }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [mode, setMode] = useState('journey'); // 'journey' | 'comparison'

  const students = Array.isArray(classData?.students) ? classData.students : [];
  const classTotal = useMemo(
    () => students.reduce((sum, s) => sum + (Number(s.score) || 0), 0),
    [students]
  );

  const ranked = useMemo(() => {
    return [...students]
      .map((s) => ({ ...s, score: Number(s.score) || 0 }))
      .sort((a, b) => b.score - a.score);
  }, [students]);

  const topThree = ranked.slice(0, 3);
  const runnersUp = ranked.slice(3, 8);

  const totalZoneSpan = ZONE_TOTALS[ZONE_TOTALS.length - 1];
  const currentZoneIndexRaw = ZONE_TOTALS.findIndex((z) => classTotal < z);
  const currentZoneIndex = currentZoneIndexRaw === -1 ? ZONE_TOTALS.length - 1 : currentZoneIndexRaw;
  const currentZoneMin = currentZoneIndex === 0 ? 0 : ZONE_TOTALS[currentZoneIndex - 1];
  const currentZoneMax = ZONE_TOTALS[currentZoneIndex];
  const progressInCurrentZone =
    currentZoneMax > currentZoneMin ? clamp((classTotal - currentZoneMin) / (currentZoneMax - currentZoneMin), 0, 1) : 1;
  const nextZoneTotal = currentZoneIndex < ZONE_TOTALS.length - 1 ? ZONE_TOTALS[currentZoneIndex + 1] : null;
  const zoneTheme = isDark && ZONE_THEMES[currentZoneIndex]?.dark 
    ? { ...ZONE_THEMES[currentZoneIndex], ...ZONE_THEMES[currentZoneIndex].dark }
    : ZONE_THEMES[currentZoneIndex];

  const zoneSegments = useMemo(() => {
    return ZONE_TOTALS.map((end, i) => {
      const theme = ZONE_THEMES[i];
      const darkTheme = isDark && theme?.dark ? theme.dark : theme;
      return {
        min: i === 0 ? 0 : ZONE_TOTALS[i - 1],
        max: end,
        segmentColor: darkTheme?.segmentColor || '#6366f1'
      };
    });
  }, [isDark]);

  const allClassList = Array.isArray(allClasses) ? allClasses : [];
  const classComparison = useMemo(() => {
    const summaries = allClassList.map((c) => {
      const cStudents = Array.isArray(c?.students) ? c.students : [];
      const top = [...cStudents]
        .map((s) => ({ ...s, score: Number(s.score) || 0 }))
        .sort((a, b) => b.score - a.score)[0];
      return {
        classId: c?.id,
        className: c?.name,
        topStudent: top || null,
        topScore: top ? Number(top.score) || 0 : 0
      };
    });
    const sorted = summaries.sort((a, b) => b.topScore - a.topScore);
    const maxTopScore = Math.max(...sorted.map((s) => s.topScore), 1);
    return {
      maxTopScore,
      items: sorted.map((s, idx) => ({
        ...s,
        rank: idx + 1,
        rankColor: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#a16207' : idx < 6 ? ['#6366f1', '#22c55e', '#ef4444', '#14b8a6'][idx - 3] : '#64748b'
      }))
    };
  }, [allClassList]);

  const podiumOrder =
    topThree.length >= 3
      ? [topThree[1], topThree[0], topThree[2]]
      : topThree.length === 2
        ? [topThree[1], topThree[0]]
        : topThree;

  return (
    <div
      className="eggroad-root safe-area-top"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100%',
        height: 'auto',
        overflow: 'visible',
        fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
        // Whole view background changes by current zone in journey mode.
        background: mode === 'journey' ? zoneTheme.pageBg : (isDark ? 'linear-gradient(165deg, #0f172a 0%, #1e293b 45%, #334155 100%)' : 'linear-gradient(165deg, #f8fafc 0%, #eef2ff 45%, #fdf4ff 100%)')
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '16px 16px 28px',
          minHeight: '100%',
          boxSizing: 'border-box'
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 20
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(99,102,241,0.35)'
              }}
            >
              <Trophy size={24} color="white" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase' }}>
                {mode === 'journey' ? t('egg_road.class_journey') : 'All Classes Comparison'}
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>
                {mode === 'journey' ? (classData?.name || t('egg_road.your_class')) : 'Top Student per Class'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            aria-label={t('egg_road.close')}
            title={t('egg_road.close')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              boxShadow: '0 2px 8px rgba(15,23,42,0.06)'
            }}
          >
            <X size={20} />
          </button>
        </header>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setMode('journey')}
            aria-pressed={mode === 'journey'}
            style={{
              padding: '10px 14px',
              borderRadius: 999,
              border: mode === 'journey' ? `1px solid ${zoneTheme.sectionBorder}` : `1px solid ${isDark ? 'rgba(71,85,105,0.9)' : 'rgba(226,232,240,0.9)'}`,
              background: mode === 'journey' ? zoneTheme.sectionBg : (isDark ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,0.9)'),
              cursor: 'pointer',
              fontWeight: 900,
              fontSize: 13,
              color: mode === 'journey' ? (isDark ? '#f1f5f9' : '#0f172a') : (isDark ? '#cbd5e1' : '#475569'),
              boxShadow: mode === 'journey' ? `0 10px 30px ${zoneTheme.sectionBg}` : 'none'
            }}
          >
            {t('egg_road.class_journey')}
          </button>
          <button
            type="button"
            onClick={() => setMode('comparison')}
            aria-pressed={mode === 'comparison'}
            style={{
              padding: '10px 14px',
              borderRadius: 999,
              border: mode === 'comparison' ? '1px solid rgba(99,102,241,0.45)' : `1px solid ${isDark ? 'rgba(71,85,105,0.9)' : 'rgba(226,232,240,0.9)'}`,
              background: mode === 'comparison' ? 'rgba(99,102,241,0.12)' : (isDark ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,0.9)'),
              cursor: 'pointer',
              fontWeight: 900,
              fontSize: 13,
              color: mode === 'comparison' ? (isDark ? '#f1f5f9' : '#0f172a') : (isDark ? '#cbd5e1' : '#475569'),
              boxShadow: mode === 'comparison' ? '0 10px 30px rgba(99,102,241,0.14)' : 'none'
            }}
          >
            All Classes Comparison
          </button>
        </div>

        {mode === 'journey' ? (
          <>
            <section
              style={{
                background: zoneTheme.sectionBg,
                borderRadius: 20,
                padding: '20px 18px',
                marginBottom: 18,
                border: `1px solid ${zoneTheme.sectionBorder}`,
                boxShadow: '0 12px 40px rgba(15,23,42,0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDark ? '#cbd5e1' : '#475569', fontWeight: 700, fontSize: 14 }}>
                  <TrendingUp size={18} color={zoneTheme.segmentColor} />
                  {t('egg_road.class_energy')}
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: isDark ? '#f1f5f9' : '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                  {classTotal.toLocaleString()}
                </div>
              </div>

              <div style={{ position: 'relative', height: 14, borderRadius: 999, background: isDark ? '#334155' : '#f1f5f9', overflow: 'hidden' }}>
                <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                  {zoneSegments.map((seg, i) => {
                    const segWidthPct = ((seg.max - seg.min) / totalZoneSpan) * 100;
                    const isCompleted = classTotal >= seg.max;
                    const isCurrent = i === currentZoneIndex;
                    const segProgress = isCompleted ? 1 : isCurrent ? progressInCurrentZone : 0;
                    const fillPct = clamp(segProgress, 0, 1) * 100;
                    const leftRound = i === 0 && fillPct > 0 ? 999 : 0;
                    const rightRound = i === zoneSegments.length - 1 && fillPct >= 100 ? 999 : 0;
                    return (
                      <div key={seg.max} style={{ flex: `0 0 ${segWidthPct}%`, position: 'relative', background: '#f1f5f9' }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${fillPct}%`,
                            background: seg.segmentColor,
                            borderTopLeftRadius: leftRound,
                            borderBottomLeftRadius: leftRound,
                            borderTopRightRadius: rightRound,
                            borderBottomRightRadius: rightRound,
                            transition: 'width 0.45s ease'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                <span>
                  {t('egg_road.milestone_label')}: {currentZoneMax.toLocaleString()} pts
                </span>
                {nextZoneTotal ? (
                  <span>
                    {t('egg_road.next_unlock')}: {nextZoneTotal.toLocaleString()} pts
                  </span>
                ) : (
                  <span style={{ color: '#ca8a04' }}>{t('egg_road.all_milestones')}</span>
                )}
              </div>

              <div style={{ display: 'flex', marginTop: 10, fontSize: 11, fontWeight: 900, color: '#64748b' }}>
                {zoneSegments.map((seg, i) => {
                  const segWidthPct = ((seg.max - seg.min) / totalZoneSpan) * 100;
                  return (
                    <div
                      key={seg.max}
                      style={{
                        flex: `0 0 ${segWidthPct}%`,
                        textAlign: 'center',
                        color: i === currentZoneIndex ? '#0f172a' : '#64748b'
                      }}
                    >
                      {seg.max.toLocaleString()}
                    </div>
                  );
                })}
              </div>
            </section>

            <section style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingLeft: 2 }}>
                <Sparkles size={18} color="#a855f7" />
                <span style={{ fontSize: 15, fontWeight: 800, color: '#334155' }}>{t('egg_road.top_learners')}</span>
              </div>

              {topThree.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '28px 16px',
                    color: '#64748b',
                    fontWeight: 600,
                    background: 'rgba(255,255,255,0.7)',
                    borderRadius: 16,
                    border: '1px dashed #cbd5e1'
                  }}
                >
                  {t('egg_road.add_students_hint')}
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: 10,
                    flexWrap: 'wrap'
                  }}
                >
                  {podiumOrder.map((student, i) => {
                    const rank =
                      topThree.length >= 3
                        ? i === 0
                          ? 2
                          : i === 1
                            ? 1
                            : 3
                        : topThree.length === 2
                          ? (i === 0 ? 2 : 1)
                          : 1;
                    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
                    const h = rank === 1 ? 132 : 108;
                    return (
                      <motion.div
                        key={student.id || student.name}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.35 }}
                        style={{
                          flex: '0 0 auto',
                          width: rank === 1 ? 120 : 100,
                          minHeight: h,
                          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                          borderRadius: 18,
                          border: rank === 1 ? '2px solid #eab308' : '1px solid #e2e8f0',
                          boxShadow: rank === 1 ? '0 16px 36px rgba(234,179,8,0.25)' : '0 8px 24px rgba(15,23,42,0.06)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '12px 8px 14px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <div style={{ fontSize: 22, marginBottom: 4 }}>{medal}</div>
                        <SafeAvatar
                          src={avatarSrc(student)}
                          name={student.name}
                          alt={student.name}
                          style={{
                            width: rank === 1 ? 72 : 56,
                            height: rank === 1 ? 72 : 56,
                            borderRadius: '50%',
                            border: '3px solid #fff',
                            boxShadow: '0 6px 16px rgba(15,23,42,0.12)',
                            objectFit: 'cover'
                          }}
                        />
                        <div
                          style={{
                            marginTop: 8,
                            fontWeight: 800,
                            fontSize: 13,
                            color: '#0f172a',
                            textAlign: 'center',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {student.name}
                        </div>
                        <div style={{ marginTop: 4, fontSize: 15, fontWeight: 900, color: '#6366f1', fontVariantNumeric: 'tabular-nums' }}>
                          {student.score}
                        </div>
                        <div style={{ marginTop: 2, fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                          {t('egg_road.pts')}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>

            {runnersUp.length > 0 && (
              <section>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 10, paddingLeft: 2 }}>
                  {t('egg_road.also_rocking')}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {runnersUp.map((student, idx) => (
                    <div
                      key={student.id || student.name}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 12px',
                        borderRadius: 999,
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#334155'
                      }}
                    >
                      <span style={{ fontSize: 11, color: '#94a3b8', width: 18, textAlign: 'center' }}>{4 + idx}</span>
                      <SafeAvatar
                        src={avatarSrc(student)}
                        name={student.name}
                        alt=""
                        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.name}</span>
                      <span style={{ fontWeight: 800, color: '#6366f1', fontVariantNumeric: 'tabular-nums' }}>{student.score}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <section
            style={{
              background: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)',
              borderRadius: 20,
              padding: '20px 18px',
              marginBottom: 18,
              border: isDark ? '1px solid rgba(71,85,105,0.9)' : '1px solid rgba(226,232,240,0.9)',
              boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.3)' : '0 12px 40px rgba(15,23,42,0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDark ? '#cbd5e1' : '#475569', fontWeight: 800, fontSize: 14 }}>
                <TrendingUp size={18} color={isDark ? '#818cf8' : '#6366f1'} />
                Top Student per Class (Ranked)
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, overflowX: 'auto', paddingBottom: 6 }}>
              {classComparison.items.map((item) => {
                const pct = classComparison.maxTopScore > 0 ? clamp(item.topScore / classComparison.maxTopScore, 0, 1) : 0;
                const topStudent = item.topStudent;
                return (
                  <div
                    key={item.classId}
                    style={{
                      flex: '0 0 auto',
                      width: 72,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 180,
                        borderRadius: 999,
                        background: isDark ? 'rgba(15,23,42,0.8)' : 'rgba(99,102,241,0.08)',
                        border: isDark ? `1px solid rgba(30,41,59,0.9)` : `1px solid rgba(99,102,241,0.18)`,
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.4)' : '0 10px 30px rgba(15,23,42,0.06)'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: `${pct * 100}%`,
                          background: isDark ? (
                          item.rank === 1 ? '#fbbf24' : 
                          item.rank === 2 ? '#e2e8f0' : 
                          item.rank === 3 ? '#f59e0b' : 
                          item.rank <= 6 ? ['#818cf8', '#4ade80', '#f87171', '#2dd4bf'][item.rank - 4] : 
                          '#94a3b8'
                        ) : item.rankColor,
                          borderRadius: 999
                        }}
                      />
                    </div>

                    <SafeAvatar
                      src={topStudent ? avatarSrc(topStudent) : null}
                      name={topStudent?.name || '?'}
                      alt={topStudent?.name || ''}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        objectFit: 'cover',
                        border: isDark ? '2px solid rgba(30,41,59,0.95)' : '2px solid rgba(255,255,255,0.95)',
                        boxShadow: isDark ? '0 10px 26px rgba(0,0,0,0.2)' : '0 10px 26px rgba(15,23,42,0.10)'
                      }}
                    />
                    <div
                      style={{
                        maxWidth: 72,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: 11,
                        fontWeight: 900,
                        color: isDark ? '#f1f5f9' : '#0f172a',
                        textAlign: 'center'
                      }}
                      title={topStudent?.name || ''}
                    >
                      {topStudent?.name || 'No students'}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
