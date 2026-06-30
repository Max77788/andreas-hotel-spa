const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// Icons
const { FaRobot, FaUserTie, FaExchangeAlt, FaProjectDiagram, FaMagic, FaCogs, FaRocket } = require("react-icons/fa");
const { MdTouchApp, MdArchitecture, MdTimeline } = require("react-icons/md");

function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

const C = {
  dark: "0F172A",
  dark2: "1E293B",
  cardDark: "1E293B",
  accent: "06B6D4",
  accent2: "8B5CF6",
  accent3: "10B981",
  textLight: "F1F5F9",
  textMuted: "94A3B8",
  white: "FFFFFF",
  gold: "F59E0B",
  lightBg: "F1F5F9",
  cardLight: "FFFFFF",
};

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, color: "000000", opacity: 0.25 });

async function build() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "AI Agents for Beginners";
  pres.title = "Lesson 1: Your New Role as an Automation Manager";

  const robotIcon = await iconToBase64Png(FaRobot, "#" + C.accent, 256);
  const architectIcon = await iconToBase64Png(FaUserTie, "#" + C.accent2, 256);
  const diagramIcon = await iconToBase64Png(FaProjectDiagram, "#" + C.accent3, 256);
  const exchangeIcon = await iconToBase64Png(FaExchangeAlt, "#" + C.gold, 256);
  const magicIcon = await iconToBase64Png(FaMagic, "#" + C.accent2, 256);
  const cogsIcon = await iconToBase64Png(FaCogs, "#" + C.accent, 256);
  const rocketIcon = await iconToBase64Png(FaRocket, "#" + C.gold, 256);
  const touchIcon = await iconToBase64Png(MdTouchApp, "#" + C.accent3, 256);
  const archIcon = await iconToBase64Png(MdArchitecture, "#" + C.accent2, 256);
  const timelineIcon = await iconToBase64Png(MdTimeline, "#" + C.accent, 256);

  // ──────────────────────────────────────────────
  // SLIDE 1: Title Slide
  // ──────────────────────────────────────────────
  let s1 = pres.addSlide();
  s1.background = { color: C.dark };

  // Gradient overlay shapes
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.accent, transparency: 95 }
  });

  // Decorative accent line 
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.2, w: 0.08, h: 3.2, fill: { color: C.accent }
  });

  // Small label
  s1.addText("AI AGENTS FOR BEGINNERS", {
    x: 1.2, y: 1.3, w: 7, h: 0.4, fontSize: 11, fontFace: "Calibri",
    color: C.accent, charSpacing: 6, bold: true
  });

  // Title
  s1.addText("Your New Role as an\nAutomation Manager", {
    x: 1.2, y: 1.8, w: 7.5, h: 1.6, fontSize: 38, fontFace: "Arial Black",
    color: C.textLight, lineSpacingMultiple: 1.1
  });

  // Subtitle
  s1.addText("Lesson 1: From AI Worker to AI Architect", {
    x: 1.2, y: 3.5, w: 7, h: 0.5, fontSize: 16, fontFace: "Calibri",
    color: C.textMuted, italic: true
  });

  // Robot icon on the right
  s1.addImage({ data: robotIcon, x: 8.2, y: 1.8, w: 1.2, h: 1.2 });

  // Bottom accent bar
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.2, w: 10, h: 0.08, fill: { color: C.accent }
  });

  // ──────────────────────────────────────────────
  // SLIDE 2: The Hook — Stop Being a Digital Courier
  // ──────────────────────────────────────────────
  let s2 = pres.addSlide();
  s2.background = { color: C.lightBg };

  // Title bar
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.dark }
  });
  s2.addText("THE HOOK", {
    x: 0.7, y: 0.2, w: 3, h: 0.5, fontSize: 11, fontFace: "Calibri",
    color: C.accent, charSpacing: 5, bold: true
  });
  s2.addText("Stop Being a Digital Courier", {
    x: 0.7, y: 0.5, w: 8, h: 0.4, fontSize: 13, fontFace: "Calibri",
    color: C.textMuted
  });

  // Exchange icon
  s2.addImage({ data: exchangeIcon, x: 0.6, y: 1.4, w: 0.55, h: 0.55 });

  // Hook statement
  s2.addText("Manual copy-pasting into chat boxes\nis just faster grunt work.", {
    x: 1.3, y: 1.3, w: 7.5, h: 0.9, fontSize: 22, fontFace: "Arial",
    color: C.dark, bold: true, lineSpacingMultiple: 1.2
  });

  // Two column cards
  const cardY = 2.6;
  const cardH = 2.2;

  // Left card — Before
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: cardY, w: 4.2, h: cardH, fill: { color: C.cardLight }, shadow: makeShadow()
  });
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: cardY, w: 0.07, h: cardH, fill: { color: "EF4444" }
  });
  s2.addImage({ data: touchIcon, x: 0.9, y: cardY + 0.3, w: 0.4, h: 0.4 });
  s2.addText("What You're Doing", {
    x: 1.4, y: cardY + 0.25, w: 3, h: 0.35, fontSize: 14, fontFace: "Arial",
    bold: true, color: C.dark
  });
  s2.addText([
    { text: "Extract data from one system", options: { bullet: true, breakLine: true } },
    { text: "Format it manually", options: { bullet: true, breakLine: true } },
    { text: "Paste into another chat/app", options: { bullet: true, breakLine: true } },
    { text: "Repeat every hour", options: { bullet: true } }
  ], { x: 0.9, y: cardY + 0.7, w: 3.7, h: 1.3, fontSize: 13, fontFace: "Calibri", color: "475569", lineSpacingMultiple: 1.4, valign: "top" });

  // Right card — Should be doing
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: cardY, w: 4.2, h: cardH, fill: { color: C.cardLight }, shadow: makeShadow()
  });
  s2.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: cardY, w: 0.07, h: cardH, fill: { color: C.accent3 }
  });
  s2.addImage({ data: cogsIcon, x: 5.5, y: cardY + 0.3, w: 0.4, h: 0.4 });
  s2.addText("What AI Should Be Doing", {
    x: 6.0, y: cardY + 0.25, w: 3, h: 0.35, fontSize: 14, fontFace: "Arial",
    bold: true, color: C.dark
  });
  s2.addText([
    { text: "Triggered by events (email, webhook)", options: { bullet: true, breakLine: true } },
    { text: "Processes data automatically", options: { bullet: true, breakLine: true } },
    { text: "Delivers results to the right place", options: { bullet: true, breakLine: true } },
    { text: "Runs on its own, 24/7", options: { bullet: true } }
  ], { x: 5.5, y: cardY + 0.7, w: 3.7, h: 1.3, fontSize: 13, fontFace: "Calibri", color: "475569", lineSpacingMultiple: 1.4, valign: "top" });

  // ──────────────────────────────────────────────
  // SLIDE 3: The Shift — From AI Worker to AI Architect
  // ──────────────────────────────────────────────
  let s3 = pres.addSlide();
  s3.background = { color: C.dark };

  // Title
  s3.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent }
  });
  s3.addText("THE SHIFT", {
    x: 0.7, y: 0.3, w: 3, h: 0.5, fontSize: 11, fontFace: "Calibri",
    color: C.accent, charSpacing: 5, bold: true
  });

  // Big text
  s3.addText("From AI Worker to\nAI Architect", {
    x: 0.7, y: 0.9, w: 8, h: 1.4, fontSize: 36, fontFace: "Arial Black",
    color: C.textLight, lineSpacingMultiple: 1.1
  });

  // Three cards — the shift spectrum
  const s3CardY = 2.8;
  const s3CardW = 2.7;
  const s3CardH = 2.3;
  const s3Gap = 0.35;
  const s3StartX = 0.7;

  // Card 1: Worker
  s3.addShape(pres.shapes.RECTANGLE, {
    x: s3StartX, y: s3CardY, w: s3CardW, h: s3CardH, fill: { color: C.cardDark }, shadow: makeShadow()
  });
  s3.addShape(pres.shapes.RECTANGLE, {
    x: s3StartX, y: s3CardY, w: s3CardW, h: 0.06, fill: { color: "EF4444" }
  });
  s3.addImage({ data: touchIcon, x: s3StartX + 0.3, y: s3CardY + 0.3, w: 0.4, h: 0.4 });
  s3.addText("AI Worker", {
    x: s3StartX + 0.8, y: s3CardY + 0.3, w: 1.7, h: 0.35, fontSize: 16, fontFace: "Arial",
    bold: true, color: C.textLight
  });
  s3.addText("Executes individual prompts. One task at a time. You're still in the loop.", {
    x: s3StartX + 0.3, y: s3CardY + 0.85, w: 2.2, h: 1.2, fontSize: 12, fontFace: "Calibri",
    color: C.textMuted, lineSpacingMultiple: 1.3
  });

  // Card 2: Architect
  s3.addShape(pres.shapes.RECTANGLE, {
    x: s3StartX + s3CardW + s3Gap, y: s3CardY, w: s3CardW, h: s3CardH, fill: { color: C.cardDark }, shadow: makeShadow()
  });
  s3.addShape(pres.shapes.RECTANGLE, {
    x: s3StartX + s3CardW + s3Gap, y: s3CardY, w: s3CardW, h: 0.06, fill: { color: C.accent2 }
  });
  s3.addImage({ data: archIcon, x: s3StartX + s3CardW + s3Gap + 0.3, y: s3CardY + 0.3, w: 0.4, h: 0.4 });
  s3.addText("AI Architect", {
    x: s3StartX + s3CardW + s3Gap + 0.8, y: s3CardY + 0.3, w: 1.7, h: 0.35, fontSize: 16,
    fontFace: "Arial", bold: true, color: C.textLight
  });
  s3.addText("Designs automated workflows. Builds systems that run independently. Sets the rules.", {
    x: s3StartX + s3CardW + s3Gap + 0.3, y: s3CardY + 0.85, w: 2.2, h: 1.2, fontSize: 12,
    fontFace: "Calibri", color: C.textMuted, lineSpacingMultiple: 1.3
  });

  // Card 3: Orchestrator
  s3.addShape(pres.shapes.RECTANGLE, {
    x: s3StartX + 2 * (s3CardW + s3Gap), y: s3CardY, w: s3CardW, h: s3CardH, fill: { color: C.cardDark }, shadow: makeShadow()
  });
  s3.addShape(pres.shapes.RECTANGLE, {
    x: s3StartX + 2 * (s3CardW + s3Gap), y: s3CardY, w: s3CardW, h: 0.06, fill: { color: C.accent3 }
  });
  s3.addImage({ data: robotIcon, x: s3StartX + 2 * (s3CardW + s3Gap) + 0.3, y: s3CardY + 0.3, w: 0.4, h: 0.4 });
  s3.addText("AI Orchestrator", {
    x: s3StartX + 2 * (s3CardW + s3Gap) + 0.8, y: s3CardY + 0.3, w: 1.7, h: 0.35, fontSize: 16,
    fontFace: "Arial", bold: true, color: C.textLight
  });
  s3.addText("Coordinates multiple agents. Manages handoffs. Monitors and adapts in real time.", {
    x: s3StartX + 2 * (s3CardW + s3Gap) + 0.3, y: s3CardY + 0.85, w: 2.2, h: 1.2, fontSize: 12,
    fontFace: "Calibri", color: C.textMuted, lineSpacingMultiple: 1.3
  });

  // Arrow indicator below
  s3.addShape(pres.shapes.LINE, {
    x: s3StartX + 0.5, y: 5.3, w: 8.1, h: 0, line: { color: C.accent, width: 1.5, dashType: "dash" }
  });
  s3.addText("More impact  →", {
    x: 6.5, y: 5.05, w: 3, h: 0.3, fontSize: 11, fontFace: "Calibri",
    color: C.accent, italic: true, align: "right"
  });

  // ──────────────────────────────────────────────
  // SLIDE 4: The Three-Question Blueprint (overview)
  // ──────────────────────────────────────────────
  let s4 = pres.addSlide();
  s4.background = { color: C.lightBg };

  s4.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.dark }
  });
  s4.addText("CORE PRINCIPLE", {
    x: 0.7, y: 0.2, w: 4, h: 0.5, fontSize: 11, fontFace: "Calibri",
    color: C.accent, charSpacing: 5, bold: true
  });
  s4.addText("The Three-Question Blueprint", {
    x: 0.7, y: 0.5, w: 8, h: 0.4, fontSize: 13, fontFace: "Calibri",
    color: C.textMuted
  });

  // Big question text
  s4.addText("Every automated system answers\nexactly three questions:", {
    x: 0.7, y: 1.2, w: 8.5, h: 1.1, fontSize: 24, fontFace: "Arial",
    color: C.dark, bold: true, lineSpacingMultiple: 1.2
  });

  // Three question cards
  const qY = 2.6;
  const qH = 2.4;
  const qW = 2.8;
  const qGap = 0.3;
  const qStartX = 0.7;

  // Q1
  s4.addShape(pres.shapes.RECTANGLE, {
    x: qStartX, y: qY, w: qW, h: qH, fill: { color: C.cardLight }, shadow: makeShadow()
  });
  s4.addShape(pres.shapes.RECTANGLE, {
    x: qStartX, y: qY, w: qW, h: 0.07, fill: { color: C.accent }
  });
  s4.addText("01", {
    x: qStartX + 0.3, y: qY + 0.25, w: 0.6, h: 0.5, fontSize: 28, fontFace: "Arial Black",
    color: C.accent
  });
  s4.addText("What triggers\nthe work?", {
    x: qStartX + 0.3, y: qY + 0.8, w: 2.3, h: 0.8, fontSize: 18, fontFace: "Arial",
    bold: true, color: C.dark, lineSpacingMultiple: 1.2
  });
  s4.addText("Email arrives. Form submits. Timer fires. Webhook hits.", {
    x: qStartX + 0.3, y: qY + 1.6, w: 2.3, h: 0.6, fontSize: 12, fontFace: "Calibri",
    color: "64748B", lineSpacingMultiple: 1.3
  });

  // Q2
  s4.addShape(pres.shapes.RECTANGLE, {
    x: qStartX + qW + qGap, y: qY, w: qW, h: qH, fill: { color: C.cardLight }, shadow: makeShadow()
  });
  s4.addShape(pres.shapes.RECTANGLE, {
    x: qStartX + qW + qGap, y: qY, w: qW, h: 0.07, fill: { color: C.accent2 }
  });
  s4.addText("02", {
    x: qStartX + qW + qGap + 0.3, y: qY + 0.25, w: 0.6, h: 0.5, fontSize: 28, fontFace: "Arial Black",
    color: C.accent2
  });
  s4.addText("What logic processes\nthe data?", {
    x: qStartX + qW + qGap + 0.3, y: qY + 0.8, w: 2.3, h: 0.8, fontSize: 18, fontFace: "Arial",
    bold: true, color: C.dark, lineSpacingMultiple: 1.2
  });
  s4.addText("AI decides. Rules filter. Code transforms. API enriches.", {
    x: qStartX + qW + qGap + 0.3, y: qY + 1.6, w: 2.3, h: 0.6, fontSize: 12, fontFace: "Calibri",
    color: "64748B", lineSpacingMultiple: 1.3
  });

  // Q3
  s4.addShape(pres.shapes.RECTANGLE, {
    x: qStartX + 2 * (qW + qGap), y: qY, w: qW, h: qH, fill: { color: C.cardLight }, shadow: makeShadow()
  });
  s4.addShape(pres.shapes.RECTANGLE, {
    x: qStartX + 2 * (qW + qGap), y: qY, w: qW, h: 0.07, fill: { color: C.accent3 }
  });
  s4.addText("03", {
    x: qStartX + 2 * (qW + qGap) + 0.3, y: qY + 0.25, w: 0.6, h: 0.5, fontSize: 28, fontFace: "Arial Black",
    color: C.accent3
  });
  s4.addText("Where does the final\naction go?", {
    x: qStartX + 2 * (qW + qGap) + 0.3, y: qY + 0.8, w: 2.3, h: 0.8, fontSize: 18, fontFace: "Arial",
    bold: true, color: C.dark, lineSpacingMultiple: 1.2
  });
  s4.addText("Slack message. Email reply. Sheet update. API call.", {
    x: qStartX + 2 * (qW + qGap) + 0.3, y: qY + 1.6, w: 2.3, h: 0.6, fontSize: 12, fontFace: "Calibri",
    color: "64748B", lineSpacingMultiple: 1.3
  });

  // ──────────────────────────────────────────────
  // SLIDE 5: Three-Question Blueprint — Visual Flow Diagram
  // ──────────────────────────────────────────────
  let s5 = pres.addSlide();
  s5.background = { color: C.dark };

  // Title
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent }
  });
  s5.addText("THE THREE-QUESTION BLUEPRINT", {
    x: 0.7, y: 0.3, w: 8, h: 0.5, fontSize: 11, fontFace: "Calibri",
    color: C.accent, charSpacing: 5, bold: true
  });
  s5.addText("Visual Flow Diagram", {
    x: 0.7, y: 0.9, w: 8, h: 0.5, fontSize: 26, fontFace: "Arial Black",
    color: C.textLight
  });

  // Flow diagram — three connected boxes
  const flowY = 1.8;
  const flowH = 2.0;
  const flowW = 2.5;
  const flowGap = 0.5;
  const flowStartX = 0.7;

  // Box 1: Trigger
  s5.addShape(pres.shapes.RECTANGLE, {
    x: flowStartX, y: flowY, w: flowW, h: flowH, fill: { color: C.cardDark }, shadow: makeShadow()
  });
  s5.addShape(pres.shapes.RECTANGLE, {
    x: flowStartX, y: flowY, w: flowW, h: 0.06, fill: { color: C.accent }
  });
  s5.addImage({ data: magicIcon, x: flowStartX + 0.3, y: flowY + 0.25, w: 0.4, h: 0.4 });
  s5.addText("Trigger", {
    x: flowStartX + 0.8, y: flowY + 0.25, w: 1.5, h: 0.35, fontSize: 14, fontFace: "Arial",
    bold: true, color: C.textLight
  });
  s5.addText([
    { text: "New email in inbox", options: { bullet: true, breakLine: true } },
    { text: "Form submission", options: { bullet: true, breakLine: true } },
    { text: "Scheduled time", options: { bullet: true } }
  ], {
    x: flowStartX + 0.3, y: flowY + 0.75, w: 2.0, h: 1.0, fontSize: 12, fontFace: "Calibri",
    color: C.textMuted, lineSpacingMultiple: 1.4
  });

  // Arrow 1→2
  s5.addShape(pres.shapes.LINE, {
    x: flowStartX + flowW, y: flowY + flowH / 2, w: flowGap, h: 0,
    line: { color: C.accent, width: 2 }
  });
  s5.addText(">", {
    x: flowStartX + flowW + 0.1, y: flowY + flowH / 2 - 0.2, w: 0.3, h: 0.4,
    fontSize: 18, fontFace: "Arial", color: C.accent, bold: true
  });

  // Box 2: Logic
  s5.addShape(pres.shapes.RECTANGLE, {
    x: flowStartX + flowW + flowGap + 0.2, y: flowY, w: flowW, h: flowH, fill: { color: C.cardDark }, shadow: makeShadow()
  });
  s5.addShape(pres.shapes.RECTANGLE, {
    x: flowStartX + flowW + flowGap + 0.2, y: flowY, w: flowW, h: 0.06, fill: { color: C.accent2 }
  });
  s5.addImage({ data: cogsIcon, x: flowStartX + flowW + flowGap + 0.5, y: flowY + 0.25, w: 0.4, h: 0.4 });
  s5.addText("Logic", {
    x: flowStartX + flowW + flowGap + 1.0, y: flowY + 0.25, w: 1.5, h: 0.35, fontSize: 14,
    fontFace: "Arial", bold: true, color: C.textLight
  });
  s5.addText([
    { text: "AI reads & classifies", options: { bullet: true, breakLine: true } },
    { text: "Rules filter by content", options: { bullet: true, breakLine: true } },
    { text: "Data is transformed", options: { bullet: true } }
  ], {
    x: flowStartX + flowW + flowGap + 0.5, y: flowY + 0.75, w: 2.0, h: 1.0, fontSize: 12,
    fontFace: "Calibri", color: C.textMuted, lineSpacingMultiple: 1.4
  });

  // Arrow 2→3
  const box2Right = flowStartX + 2 * (flowW + flowGap) + 0.2;
  s5.addShape(pres.shapes.LINE, {
    x: box2Right, y: flowY + flowH / 2, w: flowGap, h: 0,
    line: { color: C.accent2, width: 2 }
  });
  s5.addText(">", {
    x: box2Right + 0.1, y: flowY + flowH / 2 - 0.2, w: 0.3, h: 0.4,
    fontSize: 18, fontFace: "Arial", color: C.accent2, bold: true
  });

  // Box 3: Action
  const box3X = flowStartX + 2 * (flowW + flowGap) + 0.4;
  s5.addShape(pres.shapes.RECTANGLE, {
    x: box3X, y: flowY, w: flowW, h: flowH, fill: { color: C.cardDark }, shadow: makeShadow()
  });
  s5.addShape(pres.shapes.RECTANGLE, {
    x: box3X, y: flowY, w: flowW, h: 0.06, fill: { color: C.accent3 }
  });
  s5.addImage({ data: rocketIcon, x: box3X + 0.3, y: flowY + 0.25, w: 0.4, h: 0.4 });
  s5.addText("Action", {
    x: box3X + 0.8, y: flowY + 0.25, w: 1.5, h: 0.35, fontSize: 14, fontFace: "Arial",
    bold: true, color: C.textLight
  });
  s5.addText([
    { text: "Send Slack notification", options: { bullet: true, breakLine: true } },
    { text: "Update Google Sheet", options: { bullet: true, breakLine: true } },
    { text: "Create calendar event", options: { bullet: true } }
  ], {
    x: box3X + 0.3, y: flowY + 0.75, w: 2.0, h: 1.0, fontSize: 12, fontFace: "Calibri",
    color: C.textMuted, lineSpacingMultiple: 1.4
  });

  // Bottom insight
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.3, w: 8.6, h: 0.9, fill: { color: C.cardDark }
  });
  s5.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.3, w: 0.07, h: 0.9, fill: { color: C.gold }
  });
  s5.addText("💡  Every automation you build will answer these three questions. Write them down before you write a single line of code.", {
    x: 1.0, y: 4.35, w: 8.0, h: 0.8, fontSize: 13, fontFace: "Calibri",
    color: C.textLight, lineSpacingMultiple: 1.3, valign: "middle"
  });

  // ──────────────────────────────────────────────
  // SLIDE 6: Actionable Skill — n8n Canvas
  // ──────────────────────────────────────────────
  let s6 = pres.addSlide();
  s6.background = { color: C.lightBg };

  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.dark }
  });
  s6.addText("ACTIONABLE SKILL", {
    x: 0.7, y: 0.2, w: 4, h: 0.5, fontSize: 11, fontFace: "Calibri",
    color: C.accent, charSpacing: 5, bold: true
  });
  s6.addText("Diagram Before You Build", {
    x: 0.7, y: 0.5, w: 8, h: 0.4, fontSize: 13, fontFace: "Calibri",
    color: C.textMuted
  });

  // Main content — left text
  s6.addImage({ data: diagramIcon, x: 0.7, y: 1.3, w: 0.5, h: 0.5 });

  s6.addText("Visually diagram a manual workplace\nbottleneck on the n8n canvas", {
    x: 1.4, y: 1.2, w: 4.5, h: 0.9, fontSize: 22, fontFace: "Arial",
    color: C.dark, bold: true, lineSpacingMultiple: 1.2
  });

  s6.addText("before connecting any software.", {
    x: 1.4, y: 2.0, w: 4.5, h: 0.5, fontSize: 18, fontFace: "Arial",
    color: C.accent, bold: true
  });

  // Steps
  const stepsY = 2.8;
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: stepsY, w: 4.5, h: 0.65, fill: { color: C.cardLight }, shadow: makeShadow()
  });
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: stepsY, w: 0.07, h: 0.65, fill: { color: C.accent }
  });
  s6.addText("1.  Identify one repetitive task you do daily", {
    x: 1.0, y: stepsY + 0.08, w: 4.0, h: 0.5, fontSize: 13, fontFace: "Calibri",
    color: C.dark, valign: "middle"
  });

  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: stepsY + 0.8, w: 4.5, h: 0.65, fill: { color: C.cardLight }, shadow: makeShadow()
  });
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: stepsY + 0.8, w: 0.07, h: 0.65, fill: { color: C.accent2 }
  });
  s6.addText("2.  Map it as Trigger → Logic → Action", {
    x: 1.0, y: stepsY + 0.88, w: 4.0, h: 0.5, fontSize: 13, fontFace: "Calibri",
    color: C.dark, valign: "middle"
  });

  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: stepsY + 1.6, w: 4.5, h: 0.65, fill: { color: C.cardLight }, shadow: makeShadow()
  });
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: stepsY + 1.6, w: 0.07, h: 0.65, fill: { color: C.accent3 }
  });
  s6.addText("3.  Draw it on the n8n canvas with empty nodes", {
    x: 1.0, y: stepsY + 1.68, w: 4.0, h: 0.5, fontSize: 13, fontFace: "Calibri",
    color: C.dark, valign: "middle"
  });

  // Right side — n8n visual concept
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 5.7, y: 1.2, w: 3.8, h: 3.8, fill: { color: C.dark }, shadow: makeShadow()
  });
  s6.addText("n8n Canvas", {
    x: 5.7, y: 1.3, w: 3.8, h: 0.4, fontSize: 11, fontFace: "Calibri",
    color: C.accent, charSpacing: 3, bold: true, align: "center"
  });

  // Mini flow inside the canvas
  const miniX = 6.0;
  const miniW = 3.2;
  // Trigger node
  s6.addShape(pres.shapes.RECTANGLE, {
    x: miniX + 0.1, y: 1.9, w: miniW - 0.2, h: 0.5, fill: { color: C.cardDark }
  });
  s6.addShape(pres.shapes.RECTANGLE, {
    x: miniX + 0.1, y: 1.9, w: 0.06, h: 0.5, fill: { color: C.accent }
  });
  s6.addText("Trigger: New Email", {
    x: miniX + 0.25, y: 1.9, w: miniW - 0.4, h: 0.5, fontSize: 11, fontFace: "Calibri",
    color: C.textLight, valign: "middle"
  });

  // Arrow
  s6.addShape(pres.shapes.LINE, {
    x: miniX + miniW / 2, y: 2.45, w: 0, h: 0.25,
    line: { color: C.accent, width: 1.5 }
  });

  // Logic node
  s6.addShape(pres.shapes.RECTANGLE, {
    x: miniX + 0.1, y: 2.75, w: miniW - 0.2, h: 0.5, fill: { color: C.cardDark }
  });
  s6.addShape(pres.shapes.RECTANGLE, {
    x: miniX + 0.1, y: 2.75, w: 0.06, h: 0.5, fill: { color: C.accent2 }
  });
  s6.addText("Logic: AI Classify", {
    x: miniX + 0.25, y: 2.75, w: miniW - 0.4, h: 0.5, fontSize: 11, fontFace: "Calibri",
    color: C.textLight, valign: "middle"
  });

  // Arrow
  s6.addShape(pres.shapes.LINE, {
    x: miniX + miniW / 2, y: 3.3, w: 0, h: 0.25,
    line: { color: C.accent2, width: 1.5 }
  });

  // Action node
  s6.addShape(pres.shapes.RECTANGLE, {
    x: miniX + 0.1, y: 3.6, w: miniW - 0.2, h: 0.5, fill: { color: C.cardDark }
  });
  s6.addShape(pres.shapes.RECTANGLE, {
    x: miniX + 0.1, y: 3.6, w: 0.06, h: 0.5, fill: { color: C.accent3 }
  });
  s6.addText("Action: Slack Message", {
    x: miniX + 0.25, y: 3.6, w: miniW - 0.4, h: 0.5, fontSize: 11, fontFace: "Calibri",
    color: C.textLight, valign: "middle"
  });

  // ──────────────────────────────────────────────
  // SLIDE 7: Summary & Your First Step
  // ──────────────────────────────────────────────
  let s7 = pres.addSlide();
  s7.background = { color: C.dark };

  s7.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent }
  });

  s7.addText("YOUR FIRST STEP", {
    x: 0.7, y: 0.3, w: 8, h: 0.5, fontSize: 11, fontFace: "Calibri",
    color: C.accent, charSpacing: 5, bold: true
  });

  s7.addText("Start Thinking Like\nan Architect", {
    x: 0.7, y: 0.9, w: 8, h: 1.2, fontSize: 34, fontFace: "Arial Black",
    color: C.textLight, lineSpacingMultiple: 1.1
  });

  // Key takeaways
  const tY = 2.4;
  s7.addImage({ data: timelineIcon, x: 0.7, y: tY, w: 0.35, h: 0.35 });
  s7.addText("Before you automate, ask the three questions", {
    x: 1.2, y: tY, w: 7.5, h: 0.4, fontSize: 15, fontFace: "Calibri",
    color: C.textLight, valign: "middle"
  });

  s7.addImage({ data: diagramIcon, x: 0.7, y: tY + 0.6, w: 0.35, h: 0.35 });
  s7.addText("Diagram the workflow before writing any code", {
    x: 1.2, y: tY + 0.6, w: 7.5, h: 0.4, fontSize: 15, fontFace: "Calibri",
    color: C.textLight, valign: "middle"
  });

  s7.addImage({ data: architectIcon, x: 0.7, y: tY + 1.2, w: 0.35, h: 0.35 });
  s7.addText("Your value is in designing systems, not running errands", {
    x: 1.2, y: tY + 1.2, w: 7.5, h: 0.4, fontSize: 15, fontFace: "Calibri",
    color: C.textLight, valign: "middle"
  });

  // Action box
  s7.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.1, w: 8.6, h: 1.0, fill: { color: C.cardDark }
  });
  s7.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 4.1, w: 8.6, h: 0.06, fill: { color: C.gold }
  });
  s7.addImage({ data: rocketIcon, x: 1.0, y: 4.25, w: 0.4, h: 0.4 });
  s7.addText("Your task this week: identify ONE bottleneck and draw it on n8n. Just the blueprint — no connectors yet.", {
    x: 1.6, y: 4.2, w: 7.2, h: 0.8, fontSize: 14, fontFace: "Calibri",
    color: C.textLight, lineSpacingMultiple: 1.3, valign: "middle"
  });

  await pres.writeFile({ fileName: "/home/max/projects/andreas-hotel-spa/Lesson1-Your-New-Role.pptx" });
  console.log("✅ Done!");
}

build().catch(e => { console.error(e); process.exit(1); });
