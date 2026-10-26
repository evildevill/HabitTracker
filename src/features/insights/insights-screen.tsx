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
const localDayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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
    return { key: localDayKey(date), label: range === 7 ? date.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1) : date.toLocaleDateString(undefined, { month: "numeric", day: "numeric" }), date };
  }), [range, start]);

  const latestStateByHabitDay = new Map<string, HabitCompletionEvent>();
  completionEvents
    .filter((event) => event.at >= start && event.at < start + range * DAY_MS)
    .sort((a, b) => a.at - b.at)
    .forEach((event) => {
      const key = event.habitId + ":" + localDayKey(new Date(event.at));
      latestStateByHabitDay.set(key, event);
    });
  const scopedEvents = Array.from(latestStateByHabitDay.values()).filter((event) => event.completed);
  const dayCounts = days.map((day) => scopedEvents.filter((event) => localDayKey(new Date(event.at)) === day.key).length);
  const completedToday = habits.filter((habit) => habit.completed).length;
  const todayPercent = habits.length ? Math.round((completedToday / habits.length) * 100) : 0;
  const completedInRange = scopedEvents.length;
  const activeDays = new Set(scopedEvents.map((event) => localDayKey(new Date(event.at)))).size;
  const bestDayCount = Math.max(0, ...dayCounts);
  const hasHistory = scopedEvents.length > 0;
  const habitCounts = habits.map((habit) => ({
    id: habit.id,
    title: habit.title,
    count: scopedEvents.filter((event) => event.habitId === habit.id).length,
  })).sort((a, b) => b.count - a.count);
  const strongestHabit = habitCounts.find((habit) => habit.count > 0);
  const weakestHabit = [...habitCounts].reverse().find((habit) => habit.count < (strongestHabit?.count ?? 0));
  const weekdayTotals = Array.from({ length: 7 }, (_, weekday) => {
    const weekdayDays = days.filter((day) => day.date.getDay() === weekday);
    return {
      weekday,
      label: new Date(2024, 0, weekday + 7).toLocaleDateString(undefined, { weekday: "short" }),
      count: weekdayDays.reduce((sum, day) => sum + (dayCounts.find((_, index) => days[index].key === day.key) ?? 0), 0),
      availableDays: weekdayDays.length,
    };
  });
  const strongestWeekday = weekdayTotals.filter((day) => day.availableDays > 0).sort((a, b) => b.count / b.availableDays - a.count / a.availableDays)[0];
  const possibleCheckIns = habits.length * range;
  const consistency = possibleCheckIns ? Math.round((completedInRange / possibleCheckIns) * 100) : 0;
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
          <View><Text style={styles.sectionTitle}>Your patterns</Text><Text style={styles.sectionSubtitle}>Locally saved habit check-ins</Text></View>
        </View>

        <View style={styles.rangeControl} accessibilityLabel="Insight time range">
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
              <Text style={styles.emptyChartBody}>Mark a habit complete on Today. Your activity will appear here as you complete habits. Check-ins are saved on this device.</Text>
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

        <View style={styles.metricsGrid}>
          <GlassCard style={styles.metricCard}>
            <View style={styles.metricIcon}><Target size={17} color={colors.brand} /></View>
            <Text style={styles.metricValue}>{consistency}%</Text>
            <Text style={styles.metricLabel}>Check-in rate</Text>
            <Text style={styles.metricHint}>Against all habits × {range} days</Text>
          </GlassCard>
          <GlassCard style={styles.metricCard}>
            <View style={styles.metricIcon}><TrendingUp size={17} color={colors.brand} /></View>
            <Text style={styles.metricValue}>{bestDayCount}</Text>
            <Text style={styles.metricLabel}>Best day</Text>
            <Text style={styles.metricHint}>Most check-ins in one day</Text>
          </GlassCard>
        </View>

        <GlassCard style={styles.patternCard}>
          <View style={styles.patternTop}>
            <View style={styles.metricIcon}><ChartNoAxesColumnIncreasing size={18} color={colors.brand} /></View>
            <View style={styles.patternCopy}><Text style={styles.cardTitle}>When you show up</Text><Text style={styles.cardSubtitle}>Average check-ins by weekday in this range</Text></View>
          </View>
          {hasHistory ? (
            <View style={styles.weekdayBars}>
              {weekdayTotals.map((day) => {
                const peak = Math.max(1, ...weekdayTotals.map((item) => item.availableDays ? item.count / item.availableDays : 0));
                const ratio = day.availableDays ? (day.count / day.availableDays) / peak : 0;
                return (
                  <View key={day.weekday} style={styles.weekdayColumn}>
                    <Text style={styles.weekdayValue}>{day.availableDays ? day.count : "–"}</Text>
                    <View style={styles.weekdayTrack}><View style={[styles.weekdayFill, { height: Math.max(3, ratio * 48), opacity: day.availableDays ? 1 : 0.25 }]} /></View>
                    <Text style={styles.weekdayLabel}>{day.label.slice(0, 1)}</Text>
                  </View>
                );
              })}
            </View>
          ) : <Text style={styles.patternEmpty}>Your weekday rhythm will appear after you record a few check-ins.</Text>}
          {strongestWeekday && strongestWeekday.count > 0 ? <Text style={styles.patternFootnote}>Your most active weekday in this range is {strongestWeekday.label}.</Text> : null}
        </GlassCard>

        <GlassCard style={styles.patternCard}>
          <View style={styles.patternTop}>
            <View style={styles.metricIcon}><Flame size={18} color={colors.coral} /></View>
            <View style={styles.patternCopy}><Text style={styles.cardTitle}>Your strongest habit</Text><Text style={styles.cardSubtitle}>Based on recorded completions</Text></View>
          </View>
          {strongestHabit && strongestHabit.count > 0 ? (
            <>
              <View style={styles.strongestRow}><Text style={styles.strongestName}>{strongestHabit.title}</Text><Text style={styles.strongestCount}>{strongestHabit.count} check-in{strongestHabit.count === 1 ? "" : "s"}</Text></View>
              <View style={styles.trackLight}><View style={[styles.fillLight, { width: Math.max(4, (strongestHabit.count / Math.max(1, completedInRange)) * 100) + "%" }]} /></View>
              <Text style={styles.patternFootnote}>This is your most frequently completed habit in the selected range—not a long-term streak.</Text>
            </>
          ) : (
            <Text style={styles.patternEmpty}>Complete a habit and we'll highlight which one you're returning to most often.</Text>
          )}
        </GlassCard>

        <GlassCard style={styles.patternCard}>
          <View style={styles.patternTop}>
            <View style={styles.metricIcon}><Target size={18} color={colors.coral} /></View>
            <View style={styles.patternCopy}><Text style={styles.cardTitle}>Habit to give attention</Text><Text style={styles.cardSubtitle}>A gentle nudge, not a judgement</Text></View>
          </View>
          {weakestHabit && weakestHabit.count === 0 ? (
            <Text style={styles.patternEmpty}>“{weakestHabit.title}” has no completed check-ins in this range. Try making it smaller or choosing a time that fits your day.</Text>
          ) : weakestHabit ? (
            <View style={styles.strongestRow}><Text style={styles.strongestName}>{weakestHabit.title}</Text><Text style={styles.strongestCount}>{weakestHabit.count} check-ins</Text></View>
          ) : (
            <Text style={styles.patternEmpty}>Add a habit to start comparing patterns across your routine.</Text>
          )}
        </GlassCard>

        <View style={styles.noteRow}><CircleCheck size={16} color={colors.brand} /><Text style={styles.noteText}>Insights use actual check-ins saved on this device. Streaks and missed-day rates aren't shown because the app doesn't yet keep a complete daily record of every habit.</Text></View>
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
  weekdayBars: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", minHeight: 91, paddingTop: 10 },
  weekdayColumn: { flex: 1, alignItems: "center", gap: 6 },
  weekdayValue: { color: colors.secondary, fontSize: 9, fontWeight: "600" },
  weekdayTrack: { height: 50, width: 13, justifyContent: "flex-end", borderRadius: 8, backgroundColor: color("mint", 0.15), overflow: "hidden" },
  weekdayFill: { width: "100%", borderRadius: 8, backgroundColor: colors.brand },
  weekdayLabel: { color: colors.secondary, fontSize: 10, fontWeight: "600" },
  noteRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, paddingHorizontal: 3, marginTop: 17 },
  noteText: { flex: 1, color: colors.secondary, fontSize: 10, lineHeight: 16 },
  bottomSpacer: { height: 92 },
}); }
