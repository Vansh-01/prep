export interface InterviewQuestion {
  id: number;
  type: "HR" | "Technical" | "Behavioral" | "Situational";
  question: string;
  expectedPoints: string[];
}

export interface JobProfileQuestions {
  [key: string]: InterviewQuestion[];
}

// Common HR questions for all profiles
const commonHRQuestions: InterviewQuestion[] = [
  {
    id: 1,
    type: "HR",
    question: "Tell me about yourself and why you're interested in this role?",
    expectedPoints: ["Background", "Skills", "Motivation", "Career Goals"],
  },
  {
    id: 2,
    type: "Behavioral",
    question: "Describe a challenging project you worked on and how you overcame obstacles.",
    expectedPoints: ["Problem Definition", "Solution", "Teamwork", "Outcome"],
  },
  {
    id: 3,
    type: "HR",
    question: "Where do you see yourself in 5 years?",
    expectedPoints: ["Career Goals", "Growth Mindset", "Company Alignment", "Skills Development"],
  },
  {
    id: 4,
    type: "Behavioral",
    question: "Tell me about a time when you had to work with a difficult team member.",
    expectedPoints: ["Conflict Resolution", "Communication", "Empathy", "Outcome"],
  },
  {
    id: 5,
    type: "HR",
    question: "What are your greatest strengths and weaknesses?",
    expectedPoints: ["Self-Awareness", "Honesty", "Growth Areas", "Examples"],
  },
];

// Software Engineer specific questions
const softwareEngineerQuestions: InterviewQuestion[] = [
  ...commonHRQuestions,
  {
    id: 101,
    type: "Technical",
    question: "Can you explain the difference between let, const, and var in JavaScript?",
    expectedPoints: ["Scope", "Hoisting", "Reassignment", "Best Practices"],
  },
  {
    id: 102,
    type: "Technical",
    question: "What is the difference between REST and GraphQL APIs?",
    expectedPoints: ["Data Fetching", "Flexibility", "Over-fetching", "Use Cases"],
  },
  {
    id: 103,
    type: "Technical",
    question: "Explain the concept of Big O notation and why it matters.",
    expectedPoints: ["Time Complexity", "Space Complexity", "Algorithm Efficiency", "Examples"],
  },
  {
    id: 104,
    type: "Technical",
    question: "What are SOLID principles in software development?",
    expectedPoints: ["Single Responsibility", "Open/Closed", "Liskov Substitution", "Interface Segregation", "Dependency Inversion"],
  },
  {
    id: 105,
    type: "Situational",
    question: "How would you handle a production bug that's affecting users?",
    expectedPoints: ["Prioritization", "Communication", "Debugging", "Prevention"],
  },
  {
    id: 106,
    type: "Technical",
    question: "Explain the difference between SQL and NoSQL databases.",
    expectedPoints: ["Schema", "Scalability", "ACID Properties", "Use Cases"],
  },
  {
    id: 107,
    type: "Technical",
    question: "What is the virtual DOM and how does React use it?",
    expectedPoints: ["Performance", "Reconciliation", "Diffing Algorithm", "Rendering"],
  },
  {
    id: 108,
    type: "Behavioral",
    question: "Tell me about a time you had to learn a new technology quickly.",
    expectedPoints: ["Learning Approach", "Resources Used", "Application", "Outcome"],
  },
];

// Data Analyst specific questions
const dataAnalystQuestions: InterviewQuestion[] = [
  ...commonHRQuestions,
  {
    id: 201,
    type: "Technical",
    question: "What is the difference between a LEFT JOIN and an INNER JOIN in SQL?",
    expectedPoints: ["Join Types", "Data Retention", "Use Cases", "Syntax"],
  },
  {
    id: 202,
    type: "Technical",
    question: "How would you handle missing data in a dataset?",
    expectedPoints: ["Identification", "Imputation Methods", "Deletion", "Impact Analysis"],
  },
  {
    id: 203,
    type: "Technical",
    question: "Explain the difference between correlation and causation.",
    expectedPoints: ["Definition", "Examples", "Common Mistakes", "Statistical Tests"],
  },
  {
    id: 204,
    type: "Situational",
    question: "How would you present complex data findings to non-technical stakeholders?",
    expectedPoints: ["Visualization", "Storytelling", "Simplification", "Actionable Insights"],
  },
  {
    id: 205,
    type: "Technical",
    question: "What visualization would you use to show trends over time?",
    expectedPoints: ["Line Charts", "Area Charts", "Time Series", "Best Practices"],
  },
  {
    id: 206,
    type: "Technical",
    question: "Describe your experience with Excel pivot tables and their use cases.",
    expectedPoints: ["Aggregation", "Filtering", "Calculations", "Reporting"],
  },
  {
    id: 207,
    type: "Behavioral",
    question: "Tell me about a data insight you discovered that had significant business impact.",
    expectedPoints: ["Problem", "Analysis Process", "Findings", "Business Outcome"],
  },
];

// Data Scientist specific questions
const dataScientistQuestions: InterviewQuestion[] = [
  ...commonHRQuestions,
  {
    id: 301,
    type: "Technical",
    question: "Explain the bias-variance tradeoff in machine learning.",
    expectedPoints: ["Underfitting", "Overfitting", "Model Complexity", "Generalization"],
  },
  {
    id: 302,
    type: "Technical",
    question: "What is the difference between supervised and unsupervised learning?",
    expectedPoints: ["Labels", "Use Cases", "Algorithms", "Examples"],
  },
  {
    id: 303,
    type: "Technical",
    question: "How would you handle imbalanced classes in a classification problem?",
    expectedPoints: ["Oversampling", "Undersampling", "SMOTE", "Class Weights"],
  },
  {
    id: 304,
    type: "Technical",
    question: "Explain cross-validation and why it's important.",
    expectedPoints: ["K-Fold", "Overfitting Prevention", "Model Evaluation", "Data Splitting"],
  },
  {
    id: 305,
    type: "Situational",
    question: "How would you approach building a recommendation system?",
    expectedPoints: ["Collaborative Filtering", "Content-Based", "Hybrid", "Evaluation Metrics"],
  },
  {
    id: 306,
    type: "Technical",
    question: "What are precision and recall, and when would you prioritize one over the other?",
    expectedPoints: ["Definitions", "F1 Score", "Use Cases", "Tradeoffs"],
  },
  {
    id: 307,
    type: "Behavioral",
    question: "Describe a machine learning model you deployed and its business impact.",
    expectedPoints: ["Problem Statement", "Model Choice", "Deployment", "Results"],
  },
];

// Product Manager specific questions
const productManagerQuestions: InterviewQuestion[] = [
  ...commonHRQuestions,
  {
    id: 401,
    type: "Situational",
    question: "How would you prioritize features for the next product release?",
    expectedPoints: ["User Impact", "Business Value", "Effort", "Dependencies"],
  },
  {
    id: 402,
    type: "Technical",
    question: "Describe your approach to defining and tracking product metrics.",
    expectedPoints: ["KPIs", "OKRs", "Analytics Tools", "Iteration"],
  },
  {
    id: 403,
    type: "Behavioral",
    question: "Tell me about a product decision you made that didn't work out.",
    expectedPoints: ["Context", "Decision Process", "Learnings", "Adaptation"],
  },
  {
    id: 404,
    type: "Situational",
    question: "How would you handle conflicting priorities between stakeholders?",
    expectedPoints: ["Communication", "Data-Driven", "Negotiation", "Alignment"],
  },
  {
    id: 405,
    type: "Technical",
    question: "Walk me through how you would conduct user research for a new feature.",
    expectedPoints: ["User Interviews", "Surveys", "Usability Testing", "Synthesis"],
  },
  {
    id: 406,
    type: "Situational",
    question: "How would you go about launching a product in a new market?",
    expectedPoints: ["Market Research", "Localization", "Go-to-Market", "Success Metrics"],
  },
];

// HR specific questions
const hrQuestions: InterviewQuestion[] = [
  ...commonHRQuestions,
  {
    id: 501,
    type: "Situational",
    question: "How would you handle an employee complaint about their manager?",
    expectedPoints: ["Confidentiality", "Investigation", "Resolution", "Follow-up"],
  },
  {
    id: 502,
    type: "Technical",
    question: "What metrics would you use to measure employee engagement?",
    expectedPoints: ["Surveys", "Retention Rates", "eNPS", "Productivity"],
  },
  {
    id: 503,
    type: "Behavioral",
    question: "Describe a time you successfully resolved a workplace conflict.",
    expectedPoints: ["Situation", "Mediation", "Communication", "Outcome"],
  },
  {
    id: 504,
    type: "Situational",
    question: "How would you design an effective onboarding program?",
    expectedPoints: ["Structure", "Culture", "Training", "Feedback"],
  },
  {
    id: 505,
    type: "Technical",
    question: "What strategies would you use to improve diversity and inclusion?",
    expectedPoints: ["Recruitment", "Training", "Culture", "Metrics"],
  },
];

// Marketing specific questions
const marketingQuestions: InterviewQuestion[] = [
  ...commonHRQuestions,
  {
    id: 601,
    type: "Technical",
    question: "How would you measure the success of a marketing campaign?",
    expectedPoints: ["ROI", "Conversion Rates", "Brand Awareness", "Attribution"],
  },
  {
    id: 602,
    type: "Situational",
    question: "How would you create a content strategy for a new product launch?",
    expectedPoints: ["Target Audience", "Channels", "Timeline", "Messaging"],
  },
  {
    id: 603,
    type: "Technical",
    question: "Explain the difference between SEO and SEM.",
    expectedPoints: ["Organic vs Paid", "Strategies", "Tools", "Use Cases"],
  },
  {
    id: 604,
    type: "Behavioral",
    question: "Tell me about a campaign you ran that exceeded expectations.",
    expectedPoints: ["Strategy", "Execution", "Results", "Learnings"],
  },
  {
    id: 605,
    type: "Situational",
    question: "How would you handle a PR crisis for your brand?",
    expectedPoints: ["Response Time", "Communication", "Transparency", "Recovery"],
  },
];

// Sales specific questions
const salesQuestions: InterviewQuestion[] = [
  ...commonHRQuestions,
  {
    id: 701,
    type: "Situational",
    question: "How would you handle a prospect who keeps delaying their decision?",
    expectedPoints: ["Understanding Objections", "Value Proposition", "Urgency", "Follow-up"],
  },
  {
    id: 702,
    type: "Technical",
    question: "Walk me through your sales process from prospecting to close.",
    expectedPoints: ["Lead Generation", "Qualification", "Presentation", "Negotiation"],
  },
  {
    id: 703,
    type: "Behavioral",
    question: "Describe a time you turned a difficult prospect into a loyal customer.",
    expectedPoints: ["Challenge", "Approach", "Relationship Building", "Outcome"],
  },
  {
    id: 704,
    type: "Situational",
    question: "How would you handle a competitor undercutting your price?",
    expectedPoints: ["Value Selling", "Differentiation", "Relationship", "Strategy"],
  },
  {
    id: 705,
    type: "Technical",
    question: "What CRM tools have you used and how do you leverage them?",
    expectedPoints: ["Tools", "Pipeline Management", "Forecasting", "Automation"],
  },
];

// Finance specific questions
const financeQuestions: InterviewQuestion[] = [
  ...commonHRQuestions,
  {
    id: 801,
    type: "Technical",
    question: "Walk me through the three financial statements and how they connect.",
    expectedPoints: ["Income Statement", "Balance Sheet", "Cash Flow", "Linkages"],
  },
  {
    id: 802,
    type: "Technical",
    question: "How would you value a company for an acquisition?",
    expectedPoints: ["DCF", "Comparable Analysis", "Precedent Transactions", "Multiples"],
  },
  {
    id: 803,
    type: "Situational",
    question: "How would you identify and reduce unnecessary costs in a budget?",
    expectedPoints: ["Analysis", "Prioritization", "Stakeholder Buy-in", "Monitoring"],
  },
  {
    id: 804,
    type: "Technical",
    question: "Explain the concept of working capital and its importance.",
    expectedPoints: ["Definition", "Components", "Management", "Impact"],
  },
  {
    id: 805,
    type: "Behavioral",
    question: "Describe a time when you identified a financial discrepancy.",
    expectedPoints: ["Discovery", "Investigation", "Resolution", "Prevention"],
  },
];

// Operations specific questions
const operationsQuestions: InterviewQuestion[] = [
  ...commonHRQuestions,
  {
    id: 901,
    type: "Situational",
    question: "How would you improve the efficiency of a slow process?",
    expectedPoints: ["Analysis", "Bottlenecks", "Optimization", "Measurement"],
  },
  {
    id: 902,
    type: "Technical",
    question: "Explain the concept of lean operations and its key principles.",
    expectedPoints: ["Waste Reduction", "Continuous Improvement", "Value Stream", "Kaizen"],
  },
  {
    id: 903,
    type: "Behavioral",
    question: "Tell me about a process improvement you implemented.",
    expectedPoints: ["Problem", "Solution", "Implementation", "Results"],
  },
  {
    id: 904,
    type: "Situational",
    question: "How would you handle a supply chain disruption?",
    expectedPoints: ["Risk Assessment", "Alternative Sources", "Communication", "Contingency"],
  },
  {
    id: 905,
    type: "Technical",
    question: "What KPIs would you track for operational excellence?",
    expectedPoints: ["Efficiency", "Quality", "Cost", "Delivery"],
  },
];

// Default/General questions for custom profiles
const generalQuestions: InterviewQuestion[] = [
  ...commonHRQuestions,
  {
    id: 1001,
    type: "Situational",
    question: "How do you stay updated with industry trends and developments?",
    expectedPoints: ["Learning Sources", "Networking", "Continuous Learning", "Application"],
  },
  {
    id: 1002,
    type: "Behavioral",
    question: "Describe a time when you had to adapt to a significant change at work.",
    expectedPoints: ["Change Description", "Adaptation Process", "Challenges", "Outcome"],
  },
  {
    id: 1003,
    type: "Situational",
    question: "How would you handle multiple deadlines competing for your attention?",
    expectedPoints: ["Prioritization", "Time Management", "Communication", "Quality"],
  },
  {
    id: 1004,
    type: "Behavioral",
    question: "Tell me about a time you exceeded expectations on a project.",
    expectedPoints: ["Context", "Actions", "Extra Mile", "Results"],
  },
  {
    id: 1005,
    type: "Situational",
    question: "How would you approach learning a completely new skill for your job?",
    expectedPoints: ["Learning Strategy", "Resources", "Practice", "Application"],
  },
];

export const jobProfileQuestions: JobProfileQuestions = {
  software_engineer: softwareEngineerQuestions,
  data_analyst: dataAnalystQuestions,
  data_scientist: dataScientistQuestions,
  product_manager: productManagerQuestions,
  hr: hrQuestions,
  marketing: marketingQuestions,
  sales: salesQuestions,
  finance: financeQuestions,
  operations: operationsQuestions,
};

export const getQuestionsForProfile = (jobProfile: string | null): InterviewQuestion[] => {
  if (!jobProfile) return generalQuestions;
  
  // Handle custom job profiles (other:custom_value)
  if (jobProfile.startsWith("other:")) {
    return generalQuestions;
  }
  
  return jobProfileQuestions[jobProfile] || generalQuestions;
};

export const getProfileDisplayName = (jobProfile: string | null): string => {
  if (!jobProfile) return "General";
  
  const displayNames: { [key: string]: string } = {
    software_engineer: "Software Engineer",
    data_analyst: "Data Analyst",
    data_scientist: "Data Scientist",
    product_manager: "Product Manager",
    hr: "Human Resources",
    marketing: "Marketing",
    sales: "Sales",
    finance: "Finance",
    operations: "Operations",
  };
  
  if (jobProfile.startsWith("other:")) {
    return jobProfile.replace("other:", "");
  }
  
  return displayNames[jobProfile] || "General";
};
