import jsPDF from "jspdf";

interface ATSAnalysis {
  score: number;
  status: "excellent" | "good" | "needs_work" | "poor";
  parsingIssues: string[];
  missingKeywords: string[];
  foundKeywords: string[];
  recommendations: string[];
}

interface IndustryInsights {
  industry: string;
  relevanceScore: number;
  keySkillsForIndustry: string[];
  industryTrends: string[];
  competitiveAdvantages: string[];
  gapsToAddress: string[];
}

interface JobMatch {
  matchScore: number;
  matchedRequirements: string[];
  missingRequirements: string[];
  keywordMatches: string[];
  keywordGaps: string[];
  tailoringTips: string[];
}

interface ResumeAnalysis {
  overallScore: number;
  categories: {
    name: string;
    score: number;
    feedback: string;
  }[];
  atsAnalysis: ATSAnalysis;
  industryInsights: IndustryInsights;
  jobMatch?: JobMatch;
  strengths: string[];
  improvements: string[];
  summary: string;
}

const getATSStatusLabel = (status: ATSAnalysis["status"]) => {
  switch (status) {
    case "excellent": return "ATS Ready";
    case "good": return "Good Compatibility";
    case "needs_work": return "Needs Optimization";
    case "poor": return "Poor Compatibility";
  }
};

export const generateResumePDF = (analysis: ResumeAnalysis) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 20;
  
  const checkPageBreak = (requiredSpace: number = 30) => {
    if (yPos + requiredSpace > 280) {
      pdf.addPage();
      yPos = 20;
    }
  };

  const addTitle = (text: string, size: number = 18) => {
    checkPageBreak(20);
    pdf.setFontSize(size);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(33, 33, 33);
    pdf.text(text, margin, yPos);
    yPos += size * 0.5 + 4;
  };

  const addSubtitle = (text: string, size: number = 14) => {
    checkPageBreak(15);
    pdf.setFontSize(size);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(66, 66, 66);
    pdf.text(text, margin, yPos);
    yPos += size * 0.4 + 3;
  };

  const addText = (text: string, indent: number = 0) => {
    checkPageBreak(10);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(80, 80, 80);
    const lines = pdf.splitTextToSize(text, contentWidth - indent);
    pdf.text(lines, margin + indent, yPos);
    yPos += lines.length * 5 + 2;
  };

  const addBulletPoint = (text: string, indent: number = 5) => {
    checkPageBreak(10);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(80, 80, 80);
    const lines = pdf.splitTextToSize(text, contentWidth - indent - 5);
    pdf.text("•", margin + indent, yPos);
    pdf.text(lines, margin + indent + 5, yPos);
    yPos += lines.length * 5 + 2;
  };

  const addScore = (label: string, score: number, maxScore: number = 100) => {
    checkPageBreak(15);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(66, 66, 66);
    pdf.text(label, margin, yPos);
    
    // Score with color
    const scoreText = `${score}/${maxScore}`;
    if (score >= 80) pdf.setTextColor(34, 197, 94); // green
    else if (score >= 60) pdf.setTextColor(234, 179, 8); // yellow
    else pdf.setTextColor(239, 68, 68); // red
    
    pdf.setFont("helvetica", "bold");
    pdf.text(scoreText, pageWidth - margin - 20, yPos);
    yPos += 7;
  };

  const addKeywords = (keywords: string[], isPositive: boolean = true) => {
    if (keywords.length === 0) return;
    checkPageBreak(15);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    
    const keywordText = keywords.join(", ");
    const lines = pdf.splitTextToSize(keywordText, contentWidth - 10);
    
    if (isPositive) pdf.setTextColor(34, 197, 94);
    else pdf.setTextColor(239, 68, 68);
    
    pdf.text(lines, margin + 5, yPos);
    yPos += lines.length * 5 + 3;
  };

  const addDivider = () => {
    checkPageBreak(10);
    yPos += 3;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
  };

  // ========== HEADER ==========
  addTitle("Resume Analysis Report", 22);
  yPos += 2;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Generated on ${new Date().toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })}`, margin, yPos);
  yPos += 10;
  addDivider();

  // ========== OVERALL SCORE ==========
  addTitle("Overall Score", 16);
  
  // Large score display
  checkPageBreak(25);
  pdf.setFontSize(48);
  pdf.setFont("helvetica", "bold");
  if (analysis.overallScore >= 80) pdf.setTextColor(34, 197, 94);
  else if (analysis.overallScore >= 60) pdf.setTextColor(234, 179, 8);
  else pdf.setTextColor(239, 68, 68);
  pdf.text(analysis.overallScore.toString(), margin, yPos + 15);
  
  pdf.setFontSize(16);
  pdf.setTextColor(128, 128, 128);
  pdf.text("/100", margin + 35, yPos + 15);
  yPos += 25;

  // Summary
  addText(analysis.summary);
  yPos += 5;
  addDivider();

  // ========== SCORE BREAKDOWN ==========
  addTitle("Score Breakdown", 16);
  yPos += 3;
  
  analysis.categories.forEach((category) => {
    addScore(category.name, category.score);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(120, 120, 120);
    const feedbackLines = pdf.splitTextToSize(category.feedback, contentWidth - 10);
    pdf.text(feedbackLines, margin + 5, yPos);
    yPos += feedbackLines.length * 4 + 5;
  });
  
  addDivider();

  // ========== STRENGTHS ==========
  addTitle("Strengths", 16);
  yPos += 2;
  analysis.strengths.forEach((strength) => {
    addBulletPoint(strength);
  });
  yPos += 3;

  // ========== IMPROVEMENTS ==========
  addTitle("Areas for Improvement", 16);
  yPos += 2;
  analysis.improvements.forEach((improvement) => {
    addBulletPoint(improvement);
  });
  addDivider();

  // ========== ATS ANALYSIS ==========
  addTitle("ATS Compatibility Analysis", 16);
  yPos += 3;
  
  // ATS Score and Status
  checkPageBreak(20);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(66, 66, 66);
  pdf.text("ATS Score:", margin, yPos);
  
  if (analysis.atsAnalysis.score >= 80) pdf.setTextColor(34, 197, 94);
  else if (analysis.atsAnalysis.score >= 60) pdf.setTextColor(234, 179, 8);
  else pdf.setTextColor(239, 68, 68);
  pdf.text(`${analysis.atsAnalysis.score}%`, margin + 30, yPos);
  
  pdf.setTextColor(66, 66, 66);
  pdf.text("Status:", margin + 55, yPos);
  pdf.text(getATSStatusLabel(analysis.atsAnalysis.status), margin + 75, yPos);
  yPos += 10;

  // Found Keywords
  addSubtitle("Keywords Found", 12);
  addKeywords(analysis.atsAnalysis.foundKeywords, true);
  yPos += 3;

  // Missing Keywords
  addSubtitle("Missing Keywords", 12);
  addKeywords(analysis.atsAnalysis.missingKeywords, false);
  yPos += 3;

  // Parsing Issues
  if (analysis.atsAnalysis.parsingIssues.length > 0) {
    addSubtitle("Potential Parsing Issues", 12);
    analysis.atsAnalysis.parsingIssues.forEach((issue) => {
      addBulletPoint(issue);
    });
    yPos += 3;
  }

  // ATS Recommendations
  addSubtitle("ATS Optimization Tips", 12);
  analysis.atsAnalysis.recommendations.forEach((rec) => {
    addBulletPoint(rec);
  });
  addDivider();

  // ========== INDUSTRY INSIGHTS ==========
  addTitle(`Industry Insights: ${analysis.industryInsights.industry}`, 16);
  yPos += 3;
  
  addScore("Industry Relevance Score", analysis.industryInsights.relevanceScore);
  yPos += 5;

  // Key Skills for Industry
  addSubtitle("Key Skills for This Industry", 12);
  addKeywords(analysis.industryInsights.keySkillsForIndustry, true);
  yPos += 3;

  // Industry Trends
  addSubtitle("Current Industry Trends", 12);
  analysis.industryInsights.industryTrends.forEach((trend) => {
    addBulletPoint(trend);
  });
  yPos += 3;

  // Competitive Advantages
  addSubtitle("Your Competitive Advantages", 12);
  analysis.industryInsights.competitiveAdvantages.forEach((adv) => {
    addBulletPoint(adv);
  });
  yPos += 3;

  // Gaps to Address
  addSubtitle("Gaps to Address", 12);
  analysis.industryInsights.gapsToAddress.forEach((gap) => {
    addBulletPoint(gap);
  });
  
  // ========== JOB MATCH (if available) ==========
  if (analysis.jobMatch) {
    addDivider();
    addTitle("Job Description Match Analysis", 16);
    yPos += 3;
    
    addScore("Job Match Score", analysis.jobMatch.matchScore);
    yPos += 5;

    // Matched Keywords
    addSubtitle("Matched Keywords", 12);
    addKeywords(analysis.jobMatch.keywordMatches, true);
    yPos += 3;

    // Missing Keywords
    addSubtitle("Missing Keywords", 12);
    addKeywords(analysis.jobMatch.keywordGaps, false);
    yPos += 3;

    // Met Requirements
    addSubtitle("Met Requirements", 12);
    analysis.jobMatch.matchedRequirements.forEach((req) => {
      addBulletPoint(req);
    });
    yPos += 3;

    // Missing Requirements
    addSubtitle("Missing Requirements", 12);
    analysis.jobMatch.missingRequirements.forEach((req) => {
      addBulletPoint(req);
    });
    yPos += 3;

    // Tailoring Tips
    addSubtitle("Resume Tailoring Tips", 12);
    analysis.jobMatch.tailoringTips.forEach((tip) => {
      addBulletPoint(tip);
    });
  }

  // ========== FOOTER ==========
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Page ${i} of ${totalPages} | PrepMaster Resume Analysis`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  // Save the PDF
  const fileName = `Resume_Analysis_${new Date().toISOString().split("T")[0]}.pdf`;
  pdf.save(fileName);
  
  return fileName;
};
