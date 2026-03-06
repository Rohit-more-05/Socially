import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface ContactInfo {
  userName: string;
  userEmail: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
}

interface Answer {
  question: string;
  answer: string;
}

interface ReportData {
  contactInfo: ContactInfo;
  score: number;
  maxScore: number;
  percentage: number;
  severity: string;
  description: string;
  answers: Answer[];
}

export async function POST(req: NextRequest) {
  try {
    const data: ReportData = await req.json();
    const { contactInfo, score, maxScore, percentage, severity, description, answers } = data;

    // Convert to numbers to ensure proper handling
    const scoreNum = Number(score);
    const maxScoreNum = Number(maxScore);
    const percentageNum = Number(percentage);

    // Configure nodemailer transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password
      },
    });

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4a5568;
              color: white;
              padding: 20px;
              border-radius: 5px;
              text-align: center;
            }
            .content {
              background-color: #f7fafc;
              padding: 20px;
              margin: 20px 0;
              border-radius: 5px;
              border-left: 4px solid #4299e1;
            }
            .score-box {
              background-color: #fff;
              padding: 15px;
              margin: 15px 0;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .severity {
              font-size: 24px;
              font-weight: bold;
              color: #e53e3e;
              margin: 10px 0;
            }
            .answers {
              background-color: #fff;
              padding: 15px;
              margin: 15px 0;
              border-radius: 5px;
            }
            .question {
              font-weight: bold;
              color: #2d3748;
              margin-top: 10px;
            }
            .answer {
              color: #4a5568;
              margin-left: 20px;
              margin-bottom: 15px;
            }
            .footer {
              text-align: center;
              color: #718096;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
            }
            .important-note {
              background-color: #fef5e7;
              border-left: 4px solid #f39c12;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Depression Assessment Report</h1>
          </div>
          
          <div class="content">
            <h2>Hello ${contactInfo.parentName},</h2>
            <p>This is an automated report regarding the mental health assessment completed by <strong>${contactInfo.userName}</strong>.</p>
          </div>

          <div class="score-box">
            <h3>Assessment Results</h3>
            <p><strong>Total Score:</strong> ${scoreNum} / ${maxScoreNum} (${percentageNum.toFixed(1)}%)</p>
            <p class="severity"><strong>Severity Level:</strong> ${severity}</p>
            <p><strong>Description:</strong> ${description}</p>
          </div>

          <div class="important-note">
            <p><strong>⚠️ Important Note:</strong> This assessment is a screening tool and not a diagnostic instrument. If you have concerns about your child's mental health, please consult with a qualified mental health professional.</p>
          </div>

          <div class="answers">
            <h3>Detailed Responses</h3>
            ${answers.map((item, index) => `
              <div>
                <p class="question">${index + 1}. ${item.question}</p>
                <p class="answer">→ ${item.answer}</p>
              </div>
            `).join('')}
          </div>

          <div class="content">
            <h3>Contact Information</h3>
            <p><strong>User Name:</strong> ${contactInfo.userName}</p>
            <p><strong>User Email:</strong> ${contactInfo.userEmail}</p>
            <p><strong>Parent Phone:</strong> ${contactInfo.parentPhone}</p>
          </div>

          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    // Email options
    const mailOptions = {
      from: `Mental Health Assessment <${process.env.GMAIL_USER}>`,
      to: contactInfo.parentEmail,
      subject: `Depression Assessment Report - ${contactInfo.userName}`,
      html: htmlContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Report sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send report", error: String(error) },
      { status: 500 }
    );
  }
}