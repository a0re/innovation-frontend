import type { MultiModelPrediction } from './api';

// Sample spam messages
const spamMessages = [
  "Congratulations! You have won $1000! Click here to claim your prize now!",
  "URGENT: Your account has been suspended. Verify your identity immediately.",
  "FREE MONEY! Call now to get your cash prize. Limited time offer!",
  "You have been selected for a special offer. Reply with your bank details.",
  "WIN A FREE IPHONE! Click this link now before it expires!",
  "DISCOUNT 90% OFF! Buy now! Limited stock! Call immediately!",
  "You are the lucky winner of our lottery! Claim your $5000 prize today!",
  "CLICK HERE FOR FREE VIAGRA! Best prices guaranteed! Act now!",
  "Your package is waiting! Pay $50 shipping fee to receive your prize!",
  "Make $5000 from home! No experience needed! Start today!",
  "URGENT: IRS notification. Pay your taxes now or face prosecution!",
  "Lose 20 pounds in 2 weeks! Click for our miracle diet pill!",
  "Hot singles in your area want to meet you! Sign up free!",
  "Your computer has a virus! Download our antivirus now!",
  "Increase your credit score by 200 points! Guaranteed results!",
];

// Sample not-spam messages
const notSpamMessages = [
  "Hey, are you free for lunch tomorrow?",
  "The meeting has been rescheduled to 3pm.",
  "Thanks for your help with the project!",
  "Can you send me the report when you get a chance?",
  "Happy birthday! Hope you have a great day!",
  "Let's catch up this weekend if you're available.",
  "I finished reviewing the document. Looks good!",
  "Don't forget we have a team meeting at 10am.",
  "Could you share those files from yesterday's presentation?",
  "The project deadline has been extended to next Friday.",
  "I'll be working from home tomorrow.",
  "Great job on the presentation! Very informative.",
  "Do you have time for a quick call later?",
  "I sent you the invoice for this month.",
  "Looking forward to seeing you at the conference!",
];

// Generate realistic predictions
export function generateSamplePredictions(count: number = 30): MultiModelPrediction[] {
  const predictions: MultiModelPrediction[] = [];

  for (let i = 0; i < count; i++) {
    const isSpam = Math.random() > 0.4; // 60% spam, 40% not spam
    const message = isSpam
      ? spamMessages[Math.floor(Math.random() * spamMessages.length)]
      : notSpamMessages[Math.floor(Math.random() * notSpamMessages.length)];

    // Generate model predictions with some variance
    const baseConfidence = isSpam
      ? 0.75 + Math.random() * 0.2  // Spam: 75-95%
      : 0.70 + Math.random() * 0.25; // Not spam: 70-95%

    // Add some variance between models
    const mnbConf = Math.max(0.5, Math.min(0.99, baseConfidence + (Math.random() - 0.5) * 0.15));
    const lrConf = Math.max(0.5, Math.min(0.99, baseConfidence + (Math.random() - 0.5) * 0.15));
    const svcConf = Math.max(0.5, Math.min(0.99, baseConfidence + (Math.random() - 0.5) * 0.15));

    // Determine individual predictions
    const mnbPred = isSpam ? (Math.random() > 0.15) : (Math.random() < 0.15);
    const lrPred = isSpam ? (Math.random() > 0.15) : (Math.random() < 0.15);
    const svcPred = isSpam ? (Math.random() > 0.20) : (Math.random() < 0.20);

    // Count votes
    const spamVotes = [mnbPred, lrPred, svcPred].filter(v => v).length;
    const ensembleIsSpam = spamVotes >= 2;
    const ensembleConf = (mnbConf + lrConf + svcConf) / 3;

    // Generate cluster info for spam
    let cluster = null;
    if (ensembleIsSpam) {
      const clusterId = Math.floor(Math.random() * 5); // 5 clusters
      cluster = {
        cluster_id: clusterId,
        confidence: 0.7 + Math.random() * 0.25,
        total_clusters: 5,
        top_terms: generateClusterTerms(clusterId),
      };
    }

    // Create processed message (simplified)
    const processedMessage = message.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .slice(0, 10)
      .join(' ');

    predictions.push({
      message,
      processed_message: processedMessage,
      multinomial_nb: {
        prediction: mnbPred ? 'spam' : 'ham',
        confidence: mnbConf,
        is_spam: mnbPred,
      },
      logistic_regression: {
        prediction: lrPred ? 'spam' : 'ham',
        confidence: lrConf,
        is_spam: lrPred,
      },
      linear_svc: {
        prediction: svcPred ? 'spam' : 'ham',
        confidence: svcConf,
        is_spam: svcPred,
      },
      ensemble: {
        prediction: ensembleIsSpam ? 'spam' : 'ham',
        confidence: ensembleConf,
        is_spam: ensembleIsSpam,
        spam_votes: spamVotes,
        total_votes: 3,
      },
      cluster,
      timestamp: new Date(Date.now() - (count - i) * 10000).toISOString(), // Spread over time
    });
  }

  return predictions;
}

// Generate cluster terms based on cluster ID
function generateClusterTerms(clusterId: number) {
  const clusterKeywords = [
    // Cluster 0: Prize/Lottery spam
    [
      { term: 'win', score: 0.95 },
      { term: 'prize', score: 0.92 },
      { term: 'winner', score: 0.88 },
      { term: 'lottery', score: 0.85 },
      { term: 'claim', score: 0.80 },
    ],
    // Cluster 1: Urgency spam
    [
      { term: 'urgent', score: 0.96 },
      { term: 'immediately', score: 0.90 },
      { term: 'act', score: 0.87 },
      { term: 'now', score: 0.85 },
      { term: 'limited', score: 0.82 },
    ],
    // Cluster 2: Money/Finance spam
    [
      { term: 'money', score: 0.94 },
      { term: 'cash', score: 0.91 },
      { term: 'free', score: 0.89 },
      { term: 'offer', score: 0.86 },
      { term: 'discount', score: 0.83 },
    ],
    // Cluster 3: Account/Security spam
    [
      { term: 'account', score: 0.93 },
      { term: 'verify', score: 0.90 },
      { term: 'suspended', score: 0.88 },
      { term: 'security', score: 0.85 },
      { term: 'confirm', score: 0.81 },
    ],
    // Cluster 4: Product/Service spam
    [
      { term: 'click', score: 0.95 },
      { term: 'buy', score: 0.91 },
      { term: 'sale', score: 0.88 },
      { term: 'order', score: 0.84 },
      { term: 'deal', score: 0.80 },
    ],
  ];

  return clusterKeywords[clusterId % clusterKeywords.length];
}

// Generate sample stats
export function generateSampleStats() {
  const samplePredictions = generateSamplePredictions(50);
  const spamCount = samplePredictions.filter(p => p.ensemble.is_spam).length;
  const avgConfidence = samplePredictions.reduce((sum, p) => sum + p.ensemble.confidence, 0) / samplePredictions.length;

  return {
    total_predictions: samplePredictions.length,
    spam_detected: spamCount,
    not_spam_detected: samplePredictions.length - spamCount,
    average_confidence: avgConfidence,
  };
}

// Generate sample cluster info
export function generateSampleClusterInfo() {
  return {
    total_clusters: 5,
    silhouette_score: 0.742,
    description: "K-Means clustering of spam messages to identify spam subtypes",
    clusters: [
      {
        cluster_id: 0,
        num_terms: 15,
        top_terms: [
          { term: 'win', score: 0.95 },
          { term: 'prize', score: 0.92 },
          { term: 'winner', score: 0.88 },
          { term: 'lottery', score: 0.85 },
          { term: 'claim', score: 0.80 },
          { term: 'congratulations', score: 0.78 },
          { term: 'selected', score: 0.75 },
        ],
      },
      {
        cluster_id: 1,
        num_terms: 14,
        top_terms: [
          { term: 'urgent', score: 0.96 },
          { term: 'immediately', score: 0.90 },
          { term: 'act', score: 0.87 },
          { term: 'now', score: 0.85 },
          { term: 'limited', score: 0.82 },
          { term: 'expires', score: 0.79 },
        ],
      },
      {
        cluster_id: 2,
        num_terms: 16,
        top_terms: [
          { term: 'money', score: 0.94 },
          { term: 'cash', score: 0.91 },
          { term: 'free', score: 0.89 },
          { term: 'offer', score: 0.86 },
          { term: 'discount', score: 0.83 },
          { term: 'save', score: 0.80 },
        ],
      },
      {
        cluster_id: 3,
        num_terms: 13,
        top_terms: [
          { term: 'account', score: 0.93 },
          { term: 'verify', score: 0.90 },
          { term: 'suspended', score: 0.88 },
          { term: 'security', score: 0.85 },
          { term: 'confirm', score: 0.81 },
          { term: 'update', score: 0.78 },
        ],
      },
      {
        cluster_id: 4,
        num_terms: 15,
        top_terms: [
          { term: 'click', score: 0.95 },
          { term: 'buy', score: 0.91 },
          { term: 'sale', score: 0.88 },
          { term: 'order', score: 0.84 },
          { term: 'deal', score: 0.80 },
          { term: 'shop', score: 0.77 },
        ],
      },
    ],
  };
}
