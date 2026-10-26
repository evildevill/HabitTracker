import { AppText as Text } from "../../components/ui/app-text";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";
import { ChartNoAxesColumnIncreasing, CircleCheck, Flame, Target, TrendingUp } from "lucide-react-native";
import { AppBackground } from "../../components/ui/app-background";
import { GlassCard } from "../../components/ui/glass-card";
import { ScreenHeading } from "../../components/ui/screen-heading";
import { color, colors, surfaces } from "../../design/tokens";
import type { Habit } from "../habits/types";

export type HabitCompletionEvent = { habitId: string; at: number; completed: boolean };
type RangeDays = 7 | 30 | 90;
type InsightsScreenProps = { habits: Habit[]; completionEvents: HabitCompletionEvent[] };

const DAY_MS = 24 * 60 * 60 * 1000;
const ranges: RangeDays[] = [7, 30, 90];

export function InsightsScreen({ habits, completionEvents }: InsightsScreenProps) {
  const styles = createStyles();
  const [range, setRange] = useState<RangeDays>(7);
  const now = Date.now();
  const start = useMemo(() => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    return date.getTime() - (range - 1) * DAY_MS;
  }, [now, range]);

  const days = useMemo(() => Array.from({ length: range }, (_, index) => {
    const date = new Date(start + index * DAY_MS);
    return { key: date.toISOString().slice(0, 10), label: range === 7 ? date.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1) : date.toLocaleDateString(undefined, { month: "numeric", day: "numeric" }), date };
  }), [range, start]);

  const scopedEvents = completionEvents.filter((event) => event.at >= start && event.at < start + range * DAY_MS && event.completed);
  const dayCounts = days.map((day) => scopedEvents.filter((event) => new Date(event.at).toISOString().slice(0, 10) === day.key).length);
  const completedToday = habits.filter((habit) => habit.completed).length;
  const todayPercent = habits.length ? Math.round((completedToday / habits.length) * 100) : 0;
  const completedInRange = scopedEvents.length;
  const activeDays = new Set(scopedEvents.map((event) => new Date(event.at).toISOString().slice(0, 10))).size;
  const bestDayCount = Math.max(0, ...dayCounts);
  const mostConsistentHabit = habits.map((habit) => ({ ...habit, count: scopedEvents.filter((event) => event.habitId === habit.id).length })).sort((a, b) => b.count - a.count)[0];
  const hasHistory = completionEvents.length > 0;
  const chartWidth = 320;
  const chartHeight = 154;
  const chartTop = 16;
  const chartBottom = 116;
  const maxValue = Math.max(1, ...dayCounts);
  const step = chartWidth / range;
  const barWidth = Math.max(3, Math.min(range === 7 ? 22 : 7, step * 0.58));

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <ScreenHeading eyebrow="YOUR PROGRESS" title="Insights" subtitle="Small signals. Useful patterns." />
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryIcon}><ChartNoAxesColumnIncreasing size={18} color={colors.brand} strokeWidth={1.9} /></View>
            <Text style={styles.summaryEyebrow}>TODAY AT A GLANCE</Text>
          </View>
          <Text style={styles.summaryTitle}>{todayPercent === 100 && habits.length > 0 ? "You showed up for yourself." : "Showing up is progress."}</Text>
          <Text style={styles.summaryBody}>You have completed {completedToday} of {habits.length} habits today. Keep your focus on the next small action.</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBlock}><Text style={styles.statValue}>{completedToday}<Text style={styles.statMuted}>/{habits.length}</Text></Text><Text style={styles.statLabel}>Completed</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}><Text style={styles.statValue}>{todayPercent}%</Text><Text style={styles.statLabel}>Today's progress</Text></View>
          </View>
          <View style={styles.track}><View style={[styles.fill, { width: todayPercent + "%" }]} /></View>
        </View>

        <View style={styles.sectionHeader}>
          <View><Text style={styles.sectionTitle}>Your patterns</Text><Text style={styles.sectionSubtitle}>Completion activity from this app session</Text></View>
        </View>

        <View style={styles.rangeControl} accessibilityRole="radiogroup" accessibilityLabel="Insight time range">
          {ranges.map((daysCount) => (
            <Pressable key={daysCount} accessibilityRole="radio" accessibilityState={{ selected: range === daysCount }} onPress={() => setRange(daysCount)} style={[styles.rangeOption, range === daysCount && styles.rangeOptionActive]}>
              <Text style={[styles.rangeText, range === daysCount && styles.rangeTextActive]}>{daysCount}D</Text>
            </Pressable>
          ))}
        </View>

        <GlassCard style={styles.chartCard}>
          <View style={styles.cardHeading}>
            <View style={styles.cardHeadingCopy}><Text style={styles.cardTitle}>Completion activity</Text><Text style={styles.cardSubtitle}>{completedInRange} completed check-ins in this range</Text></View>
            <View style={styles.chartIcon}><TrendingUp size={17} color={colors.brand} /></View>
          </View>
          {hasHistory ? (
            <>
              <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} accessibilityLabel={`Completed habit check-ins across the last ${range} days`}>
                {[0, 1, 2].map((line) => {
                  const y = chartTop + (chartBottom - chartTop) * line / 2;
                  return <Line key={line} x1="0" x2={chartWidth} y1={y} y2={y} stroke={surfaces.mutedBorder} strokeWidth="1" />;
                })}
                {dayCounts.map((count, index) => {
                  const height = count === 0 ? 3 : Math.max(5, (count / maxValue) * (chartBottom - chartTop));
                  const x = index * step + (step - barWidth) / 2;
                  return <Rect key={days[index].key} x={x} y={chartBottom - height} width={barWidth} height={height} rx={Math.min(4, barWidth / 2)} fill={count > 0 ? colors.brand : color("mint", 0.35)} />;
                })}
                {days.map((day, index) => {
                  const shouldLabel = range === 7 || index === 0 || index === Math.floor((range - 1) / 2) || index === range - 1;
                  return shouldLabel ? <SvgText key={day.key} x={index * step + step / 2} y="140" fontSize="10" fill={colors.secondary} textAnchor="middle">{day.label}</SvgText> : null;
                })}
              </Svg>
              <View style={styles.chartLegend}><View style={styles.legendDot} /><Text style={styles.legendText}>Completed check-ins</Text></View>
            </>
          ) : (
            <View style={styles.emptyChart}>
              <View style={styles.emptyChartIcon}><TrendingUp size={21} color={colors.brand} /></View>
              <Text style={styles.emptyChartTitle}>Your chart starts with one check-in</Text>
              <Text style={styles.emptyChartBody}>Mark a habit complete on Today. Your activity will appear here while this app session is open.</Text>
            </View>
          )}
        </GlassCard>

        <View style={styles.metricsGrid}>
          <GlassCard style={styles.metricCard}>
            <View style={styles.metricIcon}><CircleCheck size={17} color={colors.brand} /></View>
            <Text style={styles.metricValue}>{completedInRange}</Text>
            <Text style={styles.metricLabel}>Check-ins</Text>
            <Text style={styles.metricHint}>In selected range</Text>
          </GlassCard>
          <GlassCard style={styles.metricCard}>
            <View style={styles.metricIcon}><Target size={17} color={colors.brand} /></View>
            <Text style={styles.metricValue}>{activeDays}<Text style={styles.metricMuted}>/{range}</Text></Text>
            <Text style={styles.metricLabel}>Active days</Text>
            <Text style={styles.metricHint}>Days with a check-in</Text>
          </GlassCard>
        </View>

        <GlassCard style={styles.patternCard}>
          <View style={styles.patternTop}>
            <View style={styles.metricIcon}><Flame size={18} color={colors.coral} /></View>
            <View style={styles.patternCopy}><Text style={styles.cardTitle}>Your strongest habit</Text><Text style={styles.cardSubtitle}>Based on recorded completions</Text></View>
          </View>
          {mostConsistentHabit && mostConsistentHabit.count > 0 ? (
            <>
              <View style={styles.strongestRow}><Text style={styles.strongestName}>{mostConsistentHabit.title}</Text><Text style={styles.strongestCount}>{mostConsistentHabit.count} check-in{mostConsistentHabit.count === 1 ? "" : "s"}</Text></View>
              <View style={styles.trackLight}><View style={[styles.fillLight, { width: Math.max(4, (mostConsistentHabit.count / Math.max(1, completedInRange)) * 100) + "%" }]} /></View>
              <Text style={styles.patternFootnote}>This is your most frequently completed habit in the selected range—not a long-term streak.</Text>
            </>
          ) : (
            <Text style={styles.patternEmpty}>Complete a habit and we'll highlight which one you're returning to most often.</Text>
          )}
        </GlassCard>

        <View style={styles.noteRow}><CircleCheck size={16} color={colors.brand} /><Text style={styles.noteText}>Insights use actual check-ins only. Historical streaks and long-term consistency need saved daily history, which this version doesn't yet store.</Text></View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </AppBackground>
  );
}

function createStyles() { return StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 },
  heading: { marginBottom: 25 },
  summaryCard: { borderRadius: 23, padding: 20, backgroundColor: colors.strongSurface, marginBottom: 27, gap: 12 },
  summaryTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  summaryIcon: { width: 37, height: 37, borderRadius: 13, backgroundColor: color("paper", 0.1), alignItems: "center", justifyContent: "center" },
  summaryEyebrow: { color: colors.citrus, fontSize: 10, fontWeight: "700", letterSpacing: 0.7 },
  summaryTitle: { color: colors.onStrong, fontSize: 23, fontWeight: "700", letterSpacing: -0.7, lineHeight: 29, marginTop: 3 },
  summaryBody: { color: color("paper", 0.72), fontSize: 12, lineHeight: 18 },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 7 },
  statBlock: { gap: 4 },
  statValue: { color: colors.onStrong, fontSize: 25, fontWeight: "700", letterSpacing: -0.6 },
  statMuted: { color: color("paper", 0.5), fontSize: 16, fontWeight: "600" },
  statLabel: { color: color("paper", 0.66), fontSize: 11 },
  statDivider: { width: 1, height: 38, backgroundColor: color("paper", 0.16) },
  track: { height: 6, borderRadius: 99, backgroundColor: color("paper", 0.14), overflow: "hidden", marginTop: 4 },
  fill: { height: 6, borderRadius: 99, backgroundColor: colors.citrus },
  sectionHeader: { marginBottom: 13 },
  sectionTitle: { color: colors.ink, fontSize: 21, fontWeight: "700", letterSpacing: -0.5 },
  sectionSubtitle: { color: colors.secondary, fontSize: 11, marginTop: 4 },
  rangeControl: { flexDirection: "row", padding: 4, borderRadius: 15, backgroundColor: color("paper", 0.9), borderWidth: 1, borderColor: surfaces.border, marginBottom: 14, gap: 4 },
  rangeOption: { flex: 1, minHeight: 36, alignItems: "center", justifyContent: "center", borderRadius: 11 },
  rangeOptionActive: { backgroundColor: colors.strongSurface },
  rangeText: { color: colors.secondary, fontSize: 11, fontWeight: "700" },
  rangeTextActive: { color: colors.onStrong },
  chartCard: { padding: 17, borderRadius: 22, gap: 14 },
  cardHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  cardHeadingCopy: { flex: 1, gap: 4 },
  cardTitle: { color: colors.ink, fontSize: 14, fontWeight: "700" },
  cardSubtitle: { color: colors.secondary, fontSize: 10, lineHeight: 15 },
  chartIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: color("mint", 0.16), alignItems: "center", justifyContent: "center" },
  chartLegend: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: -4 },
  legendDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.brand },
  legendText: { color: colors.secondary, fontSize: 10 },
  emptyChart: { alignItems: "center", paddingVertical: 18, paddingHorizontal: 12, gap: 9 },
  emptyChartIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: color("mint", 0.16), alignItems: "center", justifyContent: "center" },
  emptyChartTitle: { color: colors.ink, fontSize: 13, fontWeight: "700", textAlign: "center" },
  emptyChartBody: { color: colors.secondary, fontSize: 11, lineHeight: 17, textAlign: "center" },
  metricsGrid: { flexDirection: "row", gap: 12, marginTop: 13 },
  metricCard: { flex: 1, padding: 15, borderRadius: 20, gap: 7 },
  metricIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: color("mint", 0.16), alignItems: "center", justifyContent: "center" },
  metricValue: { color: colors.ink, fontSize: 25, fontWeight: "700", letterSpacing: -0.5 },
  metricMuted: { color: colors.secondary, fontSize: 13, fontWeight: "600" },
  metricLabel: { color: colors.ink, fontSize: 11, fontWeight: "700" },
  metricHint: { color: colors.secondary, fontSize: 9, lineHeight: 13 },
  patternCard: { padding: 17, borderRadius: 22, marginTop: 13, gap: 13 },
  patternTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  patternCopy: { flex: 1, gap: 4 },
  strongestRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  strongestName: { flex: 1, color: colors.ink, fontSize: 13, fontWeight: "700" },
  strongestCount: { color: colors.brand, fontSize: 10, fontWeight: "700" },
  trackLight: { height: 6, borderRadius: 99, backgroundColor: color("mint", 0.2), overflow: "hidden" },
  fillLight: { height: 6, borderRadius: 99, backgroundColor: colors.brand },
  patternFootnote: { color: colors.secondary, fontSize: 10, lineHeight: 15 },
  patternEmpty: { color: colors.secondary, fontSize: 11, lineHeight: 17 },
  noteRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, paddingHorizontal: 3, marginTop: 17 },
  noteText: { flex: 1, color: colors.secondary, fontSize: 10, lineHeight: 16 },
  bottomSpacer: { height: 92 },
}); }
