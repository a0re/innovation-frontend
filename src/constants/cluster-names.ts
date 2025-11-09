/**
 * Cluster names and metadata for spam classification
 * Should match backend cluster_names.py
 */

export interface ClusterMetadata {
  name: string
  short_name: string
  description: string
  icon: string
  color: string
}

export const CLUSTER_NAMES: Record<number, ClusterMetadata> = {
  0: {
    name: "Prize & Sweepstakes",
    short_name: "Prize Scams",
    description: "Messages about winning prizes, cash rewards, or urgent claims",
    icon: "🎁",
    color: "#f59e0b" // amber
  },
  1: {
    name: "General Commercial",
    short_name: "Commercial",
    description: "General marketing and promotional messages",
    icon: "🏪",
    color: "#3b82f6" // blue
  },
  2: {
    name: "SMS Spam",
    short_name: "SMS",
    description: "Mobile text message spam and ringtones",
    icon: "📱",
    color: "#8b5cf6" // purple
  },
  3: {
    name: "URL & Links",
    short_name: "URLs",
    description: "Messages with suspicious links and website URLs",
    icon: "🔗",
    color: "#06b6d4" // cyan
  },
  4: {
    name: "Financial Fraud",
    short_name: "Financial",
    description: "Financial scams, business opportunities, and money transfers",
    icon: "💰",
    color: "#10b981" // green
  },
  5: {
    name: "Aggressive Marketing",
    short_name: "Marketing",
    description: "Pushy sales tactics and free offers",
    icon: "📢",
    color: "#ec4899" // pink
  },
  6: {
    name: "Email Lists",
    short_name: "Mailing Lists",
    description: "Unsolicited mailing list and subscription spam",
    icon: "📧",
    color: "#6366f1" // indigo
  },
  7: {
    name: "Website Spam",
    short_name: "Websites",
    description: "Web hosting, domain, and website-related spam",
    icon: "🌐",
    color: "#14b8a6" // teal
  }
}

export function getClusterName(clusterId: number): string {
  return CLUSTER_NAMES[clusterId]?.name || `Cluster ${clusterId}`
}

export function getClusterShortName(clusterId: number): string {
  return CLUSTER_NAMES[clusterId]?.short_name || `Cluster ${clusterId}`
}

export function getClusterIcon(clusterId: number): string {
  return CLUSTER_NAMES[clusterId]?.icon || "❓"
}

export function getClusterMetadata(clusterId: number): ClusterMetadata | null {
  return CLUSTER_NAMES[clusterId] || null
}
