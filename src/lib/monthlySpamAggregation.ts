import { format, parseISO } from 'date-fns';
import type { MultiModelPrediction, TopTerm } from '@/types';

export type MonthlySpamType = {
  month: string; // e.g., "Jan 2024"
  mostFrequentType: number; // cluster_id
  frequency: number; // count of that type
  topTerms: string[]; // top terms for that spam type
  totalSpam: number; // total spam messages that month
};

/**
 * Aggregates predictions by month and finds the most frequent spam type per month
 */
export function aggregateMonthlySpamTypes(
  predictions: MultiModelPrediction[]
): MonthlySpamType[] {
  // Group predictions by month
  const monthlyData = new Map<string, Map<number, { count: number; terms: string[] }>>();

  predictions.forEach((pred) => {
    // Only process spam messages with cluster info
    if (!pred.ensemble.is_spam || !pred.cluster) return;

    const date = parseISO(pred.timestamp);
    const monthKey = format(date, 'MMM yyyy');
    const clusterId = pred.cluster.cluster_id;

    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, new Map());
    }

    const monthMap = monthlyData.get(monthKey)!;

    if (!monthMap.has(clusterId)) {
      monthMap.set(clusterId, {
        count: 0,
  terms: pred.cluster.top_terms.slice(0, 3).map((t: TopTerm) => t.term),
      });
    }

    const clusterData = monthMap.get(clusterId)!;
    clusterData.count += 1;
  });

  // Find most frequent spam type per month
  const result: MonthlySpamType[] = [];

  monthlyData.forEach((clusterMap, monthKey) => {
    let mostFrequentType = -1;
    let maxCount = 0;
    let topTerms: string[] = [];
    let totalSpam = 0;

    clusterMap.forEach((data, clusterId) => {
      totalSpam += data.count;
      if (data.count > maxCount) {
        maxCount = data.count;
        mostFrequentType = clusterId;
        topTerms = data.terms;
      }
    });

    if (mostFrequentType !== -1) {
      result.push({
        month: monthKey,
        mostFrequentType,
        frequency: maxCount,
        topTerms,
        totalSpam,
      });
    }
  });

  // Sort by date (oldest to newest)
  result.sort((a, b) => {
    const dateA = parseISO(`01 ${a.month}`);
    const dateB = parseISO(`01 ${b.month}`);
    return dateA.getTime() - dateB.getTime();
  });

  return result;
}
