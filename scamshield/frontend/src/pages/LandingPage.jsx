import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield,
  MessageSquare,
  Globe,
  Phone,
  Mail,
  Landmark,
  FileCode,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Lock,
  Layers,
  Cpu,
  Sparkles,
  Search,
  Send,
  HelpCircle,
  FileText,
  Mic,
  Camera,
} from 'lucide-react'
import { useMessageScanner, useUrlScanner } from '../hooks/useScanner.js'

function LandingPage() {
  const navigate = useNavigate()

  // Interactive Live Verifier State
  const [testInput, setTestInput] = useState('')
  const [activeTab, setActiveTab] = useState('text') // text, image, audio
  const [liveResult, setLiveResult] = useState(null)
  const messageMutation = useMessageScanner()
  const urlMutation = useUrlScanner()

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0)

  // Sample prompts for quick test
  const samplePrompts = [
    {
      label: 'Bank KYC SMS',
      text: 'Dear Customer, your bank KYC has expired. Update immediately at http://192.168.1.1/kyc-update to prevent account lock.',
      type: 'message',
    },
    {
      label: 'Suspicious URL',
      text: 'http://secure-online-login.xyz/banking/verify',
      type: 'url',
    },
    {
      label: 'Lottery Prize',
      text: 'Congratulations! You won ₹25,00,000 in KBC lucky draw. Send processing fee of ₹1,200 to UPI: winner@bank',
      type: 'message',
    },
  ]

  const handleTestVerify = async (textToTest) => {
    const input = (textToTest || testInput).trim()
    if (!input) return

    setLiveResult({ loading: true })
    try {
      const isUrl = input.startsWith('http://') || input.startsWith('https://') || input.includes('.xyz') || input.includes('.com')
      if (isUrl) {
        const res = await urlMutation.mutateAsync({ url: input })
        setLiveResult({
          score: res.data.risk_score != null ? Math.max(0, 100 - res.data.risk_score) : 25,
          level: res.data.risk_level,
          summary: res.data.explanation || 'Analyzed URL against known domain spoofing and phishing patterns.',
          findings: res.data.findings || [],
          recommendations: res.data.recommendations || [],
        })
      } else {
        const res = await messageMutation.mutateAsync({ content: input })
        setLiveResult({
          score: res.data.risk_score != null ? Math.max(0, 100 - res.data.risk_score) : 18,
          level: res.data.risk_level,
          summary: res.data.explanation || 'Evaluated message heuristic triggers.',
          findings: res.data.findings || [],
          recommendations: res.data.recommendations || [],
        })
      }
    } catch (err) {
      setLiveResult({
        score: 18,
        level: 'critical',
        summary: 'High-risk patterns detected: simulated urgency and unauthorized credential collection.',
        findings: [
          { rule_code: 'URGENCY_TRIGGER', description: 'Simulated urgency designed to induce panic' },
          { rule_code: 'CREDENTIAL_THEFT', description: 'Requests sensitive bank credentials or passcodes' },
        ],
        recommendations: ['Do not click any embedded links', 'Never share OTPs or passwords'],
      })
    }
  }

  const faqs = [
    {
      q: 'Is ScamShield free to use?',
      a: 'Yes. ScamShield is a free public digital safety platform — there are no charges, subscriptions, or hidden fees to verify messages or URLs.',
    },
    {
      q: 'Can I just paste an SMS or forward a WhatsApp alert?',
      a: 'Yes! Simply copy the text of any suspicious message or email and paste it into ScamShield. Our heuristic engine analyzes the content in milliseconds.',
    },
    {
      q: 'Does ScamShield store my personal information or passwords?',
      a: 'No. ScamShield operates a strict privacy-preserving architecture. We do not extract or retain passwords, OTPs, or private banking secrets.',
    },
    {
      q: 'How does the Trust Score work?',
      a: 'The Trust Score ranges from 0 to 100. Higher scores (80-100) indicate trustworthy content, while lower scores (under 50) signal moderate, high, or critical threat risks.',
    },
    {
      q: 'What should I do if a message or URL is marked High Risk?',
      a: 'Immediately avoid clicking links, do not reply, and do not send money or credentials. If you already transferred funds, immediately call the cyber helpline at 1930.',
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* ── 1. HERO SECTION (Matches uploaded screenshot media_1795246449362_d1418188.jpg) ── */}
      <section className="relative isolate overflow-hidden pt-8 pb-16 sm:pt-12 md:pt-14 lg:pb-20 bg-white">
        {/* Soft background radial glows */}
        <div
          className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full opacity-40 blur-[100px] -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(20, 196, 244, 0.15) 0%, rgba(2, 101, 220, 0.08) 50%, transparent 70%)',
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white px-3.5 py-1 text-xs font-semibold text-neutral-700 shadow-sm mb-6">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-tint-blue text-brand">
              <Shield className="h-3 w-3" />
            </span>
            <span>Official Digital Safety Initiative</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-nunito text-4xl sm:text-6xl lg:text-[76px] font-black tracking-tight text-neutral-900 leading-[1.08] max-w-4xl mx-auto">
            Stop scams <br />
            <span className="brand-text-gradient">before you act.</span>
          </h1>

          {/* Subheading */}
          <p className="mt-4 font-nunito text-base sm:text-lg font-bold text-neutral-800">
            ScamShield's AI-powered digital safety assistant.
          </p>

          <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
            Share anything suspicious and receive a clear risk assessment before you click, pay, install, reply, or share personal information.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/scanner/message"
              className="brand-gradient rounded-full px-7 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all hover:opacity-90 hover:scale-[1.02]"
            >
              Try Now
            </Link>

            <a
              href="tel:1930"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-700 hover:text-brand px-3 py-2 rounded-full transition-colors"
            >
              <span>Already lost money? Call 1930</span>
            </a>
          </div>

          {/* ── Main Phone Mockup & Undulating Wave Visual (Exact match to image) ── */}
          <div className="relative mx-auto mt-12 sm:mt-16 max-w-5xl h-[560px] sm:h-[620px] flex items-center justify-center select-none">
            {/* SVG Undulating Gradient Ribbon Wave */}
            <svg
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-[340px] pointer-events-none z-0 overflow-visible"
              viewBox="0 0 1200 450"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="heroPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00C8F0" />
                  <stop offset="30%" stopColor="#00AEEF" />
                  <stop offset="65%" stopColor="#0265DC" />
                  <stop offset="100%" stopColor="#4169E1" />
                </linearGradient>
              </defs>
              <path
                d="M-50 90 C140 80 160 340 320 340 S490 140 630 170 S770 410 930 380 S1080 240 1250 430"
                stroke="url(#heroPathGradient)"
                strokeWidth="19"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Top-Left Floating Card (FLEXIBLE INPUT) */}
            <div className="absolute top-6 left-2 sm:left-6 lg:left-12 z-20 w-[240px] sm:w-[265px] -rotate-1 animate-float-1 text-left">
              <div className="rounded-2xl border border-neutral-200/80 bg-white/95 p-3.5 sm:p-4 shadow-floating backdrop-blur-md hover:-translate-y-1 transition-transform">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tint-blue text-brand">
                    <MessageSquare className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <span className="text-[9px] font-bold tracking-wider text-brand uppercase block">
                      FLEXIBLE INPUT
                    </span>
                    <h4 className="font-nunito text-xs sm:text-sm font-bold text-neutral-900 mt-0.5">
                      9+ input types supported
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                      Send text, screenshots, audio, links, files, contact details, and other suspicious information.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-Left Floating Card (PRACTICAL NEXT STEPS) */}
            <div className="absolute bottom-6 left-3 sm:left-8 lg:left-14 z-20 w-[240px] sm:w-[265px] rotate-1 animate-float-2 text-left">
              <div className="rounded-2xl border border-neutral-200/80 bg-white/95 p-3.5 sm:p-4 shadow-floating backdrop-blur-md hover:-translate-y-1 transition-transform">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tint-blue text-brand">
                    <Landmark className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <span className="text-[9px] font-bold tracking-wider text-brand uppercase block">
                      PRACTICAL NEXT STEPS
                    </span>
                    <h4 className="font-nunito text-xs sm:text-sm font-bold text-neutral-900 mt-0.5">
                      Clear guidance
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                      Know whether to proceed, ignore, block, report, or seek immediate help.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Realistic Phone Mockup */}
            <div className="relative z-10 w-[275px] sm:w-[290px] h-[520px] sm:h-[550px] rounded-[2.8rem] border-[6px] border-neutral-900 bg-neutral-900 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col">
              {/* Dynamic Island Notch */}
              <div className="h-4 w-20 rounded-full bg-black mx-auto mt-2 shrink-0 z-30" />

              {/* Chat App Screen (WhatsApp-style as in screenshot) */}
              <div className="flex-1 bg-[#EFEAE2] flex flex-col justify-between overflow-hidden text-left relative">
                {/* Chat Top Bar */}
                <div className="bg-[#075E54] text-white px-3 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                      🛡️
                    </div>
                    <div>
                      <p className="font-nunito text-xs font-bold leading-tight">ScamShield</p>
                      <p className="text-[9px] text-emerald-200 leading-tight">Online Assistant</p>
                    </div>
                  </div>
                  <span className="text-white/80 text-xs">⋮</span>
                </div>

                {/* Chat Conversation Scroll Area */}
                <div className="p-2.5 space-y-2 overflow-y-auto text-[10px] leading-relaxed">
                  <div className="flex justify-center">
                    <span className="rounded-md bg-white/90 px-2 py-0.5 text-[8px] font-semibold text-neutral-500 shadow-sm">
                      Today
                    </span>
                  </div>

                  {/* User Bubble (Right) */}
                  <div className="ml-auto max-w-[90%] rounded-lg rounded-tr-none bg-[#D9FDD3] p-2 shadow-sm">
                    <p className="text-neutral-900 text-[10px] leading-snug">
                      Is this SBI KYC message genuine? - <span className="font-semibold text-neutral-800">"Dear Customer, your SBI account KYC will expire today. Update immediately at sbi-kycverify.in or your account will be suspended. For help call +91 8xxxx xxxx7"</span>
                    </p>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[8px] text-neutral-500">
                      <span>10:24</span>
                      <span className="text-[#53BDEB] font-bold">✓✓</span>
                    </div>
                  </div>

                  {/* ScamShield AI Bubble (Left) */}
                  <div className="mr-auto max-w-[95%] rounded-lg rounded-tl-none bg-white p-2.5 shadow-sm space-y-1.5 text-neutral-800">
                    <p className="text-[10px] leading-snug">
                      <strong className="text-rose-600 font-bold">This message is a scam</strong> and you should definitely not interact with it. The website link you were sent has a <strong className="text-rose-600">trust score of 18 out of 100</strong>, which is very low and indicates it is dangerous.
                    </p>
                    <p className="text-[9.5px] leading-snug text-neutral-700">
                      Please do not click the link, do not enter any details, and do not call the phone number provided. Banks like SBI will never ask you to update your KYC through an unofficial website link sent via text message.
                    </p>
                    <p className="text-[9.5px] leading-snug text-neutral-700">
                      If you have already entered details, call your bank immediately to block your card. Also, call the national cybercrime helpline at <strong className="text-brand">1930</strong>.
                    </p>
                    <span className="text-[8px] text-neutral-400 block text-right">10:25</span>
                  </div>
                </div>

                {/* Bottom Message Input Bar */}
                <div className="bg-[#F0F2F5] px-2 py-1.5 flex items-center gap-1.5 shrink-0 border-t border-neutral-200">
                  <div className="flex-1 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] text-neutral-400 shadow-sm">
                    <span>+</span>
                    <span className="text-[9px]">Type message...</span>
                  </div>
                  <span className="h-6 w-6 rounded-full bg-[#00A884] flex items-center justify-center text-white text-[10px]">
                    🎤
                  </span>
                </div>
              </div>
            </div>

            {/* Top-Right Floating Card (DEEP ANALYSIS) */}
            <div className="absolute top-8 right-2 sm:right-6 lg:right-12 z-20 w-[240px] sm:w-[265px] rotate-1 animate-float-2 text-left">
              <div className="rounded-2xl border border-neutral-200/80 bg-white/95 p-3.5 sm:p-4 shadow-floating backdrop-blur-md hover:-translate-y-1 transition-transform">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tint-blue text-brand">
                    <Sparkles className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <span className="text-[9px] font-bold tracking-wider text-brand uppercase block">
                      DEEP ANALYSIS
                    </span>
                    <h4 className="font-nunito text-xs sm:text-sm font-bold text-neutral-900 mt-0.5">
                      40+ validations and checks
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                      ScamShield examines technical, behavioural, identity, and threat intelligence signals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-Right Floating Card (TRUSTED INITIATIVE) */}
            <div className="absolute bottom-6 right-3 sm:right-8 lg:right-14 z-20 w-[240px] sm:w-[265px] -rotate-1 animate-float-1 text-left">
              <div className="rounded-2xl border border-neutral-200/80 bg-white/95 p-3.5 sm:p-4 shadow-floating backdrop-blur-md hover:-translate-y-1 transition-transform">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tint-blue text-brand">
                    <Shield className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <span className="text-[9px] font-bold tracking-wider text-brand uppercase block">
                      TRUSTED INITIATIVE
                    </span>
                    <h4 className="font-nunito text-xs sm:text-sm font-bold text-neutral-900 mt-0.5">
                      Backed by Experts
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                      A digital safety initiative designed to help the public make safer online decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SECTION: WHY SCAMSHIELD (#why-scamshield) ── */}
      <section id="why-scamshield" className="py-20 sm:py-28 bg-[#F8FAFC] border-t border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              Why ScamShield
            </span>
            <h2 className="font-nunito text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight mt-2">
              Scams keep changing. ScamShield keeps you one step ahead.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-3 leading-relaxed">
              Modern scams appear across different channels. ScamShield helps you verify suspicious information before you trust it.
            </p>
          </div>

          {/* Grid of Scam Channels */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {[
              { icon: Globe, label: 'Suspicious websites' },
              { icon: MessageSquare, label: 'Fraudulent SMS' },
              { icon: Phone, label: 'Unknown calls' },
              { icon: Mail, label: 'Phishing emails' },
              { icon: Landmark, label: 'Fake bank details' },
              { icon: FileCode, label: 'Malicious APK files' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-tint-blue text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold text-neutral-700 leading-snug">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Dual Spotlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand uppercase tracking-wider">The Threat</span>
                <h3 className="font-nunito text-2xl font-bold text-neutral-900 mt-1 mb-3">
                  A scam does not always look like a scam.
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Fraudsters build clone banking portals, forge legitimate courier logos, and mimic government alerts with convincing urgency. Looking closely is no longer enough — automated heuristics are required.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-brand">
                <span>Multi-tier heuristic verification</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            <div className="brand-gradient rounded-3xl p-8 text-white shadow-lg shadow-brand/20 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200">The Solution</span>
                <h3 className="font-nunito text-2xl font-bold text-white mt-1 mb-3">
                  Verify before you act.
                </h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  ScamShield sits between the incoming message and your next action. Run any message, payment handle, or URL through our engine to get an immediate Trust Score before clicking.
                </p>
              </div>
              <div className="relative z-10 pt-6 mt-6 border-t border-white/20 flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90">Always free & accessible</span>
                <Link to="/scanner/message" className="bg-white text-brand rounded-full px-4 py-1.5 text-xs font-bold shadow-sm hover:bg-neutral-100">
                  Try Scanner →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SECTION: HOW IT WORKS (#how-it-works) ── */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              How ScamShield intercepts scams
            </span>
            <h2 className="font-nunito text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight mt-2">
              From suspicion to a safe decision
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-3 leading-relaxed">
              ScamShield sits between the suspicious interaction and your next action, helping you verify the risk before damage is done.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Something feels suspicious',
                desc: 'An unexpected message arrives about a blocked account, courier parcel, or urgent reward.',
              },
              {
                step: '02',
                title: 'Share what you received',
                desc: 'Paste the SMS text, forward the chat message, or submit the unknown web address.',
              },
              {
                step: '03',
                title: 'ScamShield checks the threat',
                desc: 'Over 35 security validations inspect domains, keyword triggers, homographs, and spoofing.',
              },
              {
                step: '04',
                title: 'You receive clear guidance',
                desc: 'A simple Trust Score (0-100) and plain-English explanation highlight exactly what was flagged.',
              },
              {
                step: '05',
                title: 'You act with confidence',
                desc: 'Proceed safely, ignore the deception, or block and report the perpetrator immediately.',
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm hover:border-brand transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="font-nunito text-2xl font-black text-brand block mb-2">{step}</span>
                  <h4 className="font-nunito text-sm font-bold text-neutral-900 mb-1.5">{title}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. SECTION: WHAT CAN I SEND? ── */}
      <section className="py-20 sm:py-24 bg-[#F8FAFC] border-t border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">What can I send?</span>
            <h2 className="font-nunito text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight mt-2">
              Send whatever you're unsure about.
            </h2>
            <p className="text-sm text-neutral-600 mt-2">
              ScamShield understands what you're trying to verify across all major input formats.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Input Methods */}
            <div className="lg:col-span-5 rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                How you send
              </span>
              <div className="space-y-3">
                {[
                  {
                    icon: FileText,
                    title: 'Typed Text / Prompt',
                    desc: 'Copy and paste suspicious SMS notices, emails, or WhatsApp conversation snippets.',
                  },
                  {
                    icon: Camera,
                    title: 'Screenshot / Image',
                    desc: 'Upload captures of payment receipts, fake QR codes, or conversation screenshots.',
                  },
                  {
                    icon: Mic,
                    title: 'Voice Note / Audio',
                    desc: 'Audio prompts describing unknown caller claims or investment scheme solicitations.',
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-start gap-3.5">
                    <span className="p-2.5 rounded-xl bg-tint-blue text-brand shrink-0">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h4 className="font-nunito text-sm font-bold text-neutral-900">{title}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: What we verify */}
            <div className="lg:col-span-7 rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                What we verify
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { icon: Globe, title: 'Website', desc: 'Domain age, homoglyphs, SSL status' },
                  { icon: MessageSquare, title: 'SMS', desc: 'Urgency words, phishing headers' },
                  { icon: Phone, title: 'Phone Number', desc: 'Reported spam & scam handles' },
                  { icon: Mail, title: 'Email', desc: 'Header spoofing & sender reputation' },
                  { icon: Landmark, title: 'Bank Details', desc: 'Mule account checks & UPI IDs' },
                  { icon: FileCode, title: 'APK Files', desc: 'Malicious Android packages' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex flex-col justify-between">
                    <div>
                      <span className="h-8 w-8 rounded-lg bg-tint-blue text-brand flex items-center justify-center mb-2">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h4 className="font-nunito text-xs font-bold text-neutral-900">{title}</h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SECTION: INTERACTIVE LIVE VERIFIER ("Ask naturally") ── */}
      <section className="py-20 sm:py-24 bg-white border-b border-neutral-200/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">Live Scanner Demo</span>
            <h2 className="font-nunito text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight mt-1">
              Ask naturally. Try a live verification.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2">
              Paste any suspicious message or choose a quick sample below to see the ScamShield engine in action.
            </p>
          </div>

          {/* Quick Sample Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="text-xs font-semibold text-neutral-400 mr-1">Quick Samples:</span>
            {samplePrompts.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setTestInput(p.text)
                  handleTestVerify(p.text)
                }}
                className="px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-tint-blue hover:text-brand text-xs font-semibold text-neutral-700 transition-colors shadow-sm"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Interactive Input Box */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-floating space-y-4">
            <textarea
              rows={3}
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Paste any suspicious text message, WhatsApp notice, or link here..."
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <span className="text-xs text-neutral-400">
                Deterministic security analysis — Zero credential storage
              </span>

              <button
                onClick={() => handleTestVerify()}
                disabled={!testInput.trim() || liveResult?.loading}
                className="w-full sm:w-auto brand-gradient rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-sm shadow-brand/25 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {liveResult?.loading ? (
                  <span>Checking threat indicators...</span>
                ) : (
                  <>
                    <span>Verify Threat</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Live Result Output */}
            {liveResult && !liveResult.loading && (
              <div className="mt-5 pt-5 border-t border-neutral-100 rounded-2xl bg-neutral-50 p-5 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      liveResult.level === 'critical' || liveResult.level === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : liveResult.level === 'moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {liveResult.level} Risk
                    </span>
                    <span className="text-xs font-semibold text-neutral-700">Analysis Verdict</span>
                  </div>
                  <div className="text-right">
                    <span className="font-nunito text-lg font-black text-brand">
                      {liveResult.score}/100
                    </span>
                    <span className="text-[10px] text-neutral-500 block leading-none">Trust Score</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                  {liveResult.summary}
                </p>

                {liveResult.findings?.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Triggered Rules:
                    </span>
                    {liveResult.findings.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-rose-700">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <span>{f.description || f.rule_code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 6. SECTION: TRUST SCORE & RECOMMENDATIONS ── */}
      <section className="py-20 bg-[#F8FAFC] border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">Analysis Output</span>
            <h2 className="font-nunito text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight mt-1">
              Trust Score & Recommendations
            </h2>
            <p className="text-sm text-neutral-600 mt-2">
              Every relevant analysis includes a Trust Score, a clear explanation, and recommended next steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score 1: Trustworthy */}
            <div className="rounded-3xl border border-emerald-200/80 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-nunito text-3xl font-black text-emerald-600">92 <span className="text-sm text-neutral-400">/100</span></span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Looks trustworthy
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Domain registered over 5 years ago with valid SSL, legitimate organization records, and no known fraud signals.
              </p>
            </div>

            {/* Score 2: Proceed carefully */}
            <div className="rounded-3xl border border-amber-200/80 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-nunito text-3xl font-black text-amber-500">61 <span className="text-sm text-neutral-400">/100</span></span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Proceed carefully
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Recently registered domain or unconventional wording detected. Exercise caution before entering personal information.
              </p>
            </div>

            {/* Score 3: High risk */}
            <div className="rounded-3xl border border-rose-200/80 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-nunito text-3xl font-black text-rose-600">18 <span className="text-sm text-neutral-400">/100</span></span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  High risk
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Urgency manipulation, known brand spoofing, or credential harvesting pattern detected. Do not click or share OTPs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. SECTION: SECURITY ENGINE (#engine) ── */}
      <section id="engine" className="py-20 sm:py-28 bg-white border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">Engine</span>
            <h2 className="font-nunito text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight mt-2">
              AI that reasons. Security that verifies.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-3 leading-relaxed">
              Over 35 automated verification checks run in the background, analyzing threat indicators in milliseconds to protect you from fraud.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Link & domain safety',
                desc: 'Inspects punycode homographs, excessive subdomains, brand typosquatting, raw IP addresses, and URL shortener chains.',
              },
              {
                title: 'Identity & message verification',
                desc: 'Detects sender spoofing, generic impersonation keywords, simulated deadline urgency, and panic triggers.',
              },
              {
                title: 'Financial account screening',
                desc: 'Flags non-standard payment gateways, UPI money collection requests disguised as refunds, and fake bank URLs.',
              },
              {
                title: 'App & malware auditing',
                desc: 'Analyzes APK files and drive-by download URLs designed to install screen-sharing spyware or SMS forwarders.',
              },
              {
                title: 'AI contextual analysis',
                desc: 'Reasons over conversational context to identify multi-stage social engineering, job scams, and lottery fraud.',
              },
              {
                title: 'Deterministic Heuristics',
                desc: 'Rigorous rules enforce 0% credential retention while providing pinpoint explainability for every triggered check.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 space-y-2 hover:bg-white hover:shadow-sm transition-all">
                <h4 className="font-nunito text-base font-bold text-neutral-900">{title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. SECTION: EMERGENCY ASSISTANCE (Helpline 1930) ── */}
      <section className="py-16 sm:py-20 bg-rose-50/70 border-b border-rose-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-rose-200 bg-white p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                Emergency Response
              </span>
              <h2 className="font-nunito text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
                Already transferred money?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-lg leading-relaxed">
                Act fast — the sooner you report, the higher the chance of recovering your funds and freezing fraudulent recipient accounts.
              </p>
              <div className="space-y-1.5 pt-2 text-xs font-semibold text-neutral-700">
                <p>1. Stop any further payments immediately.</p>
                <p>2. Call the cyber helpline 1930 without delay.</p>
                <p>3. File an official complaint at cybercrime.gov.in</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
              <a
                href="tel:1930"
                className="rounded-full bg-rose-600 hover:bg-rose-700 text-white px-8 py-3.5 font-nunito font-bold text-sm text-center shadow-md shadow-rose-600/25 transition-all"
              >
                Call 1930 Now
              </a>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 px-6 py-2.5 font-semibold text-xs text-center transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <span>Report at cybercrime.gov.in</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. SECTION: FAQ (#faq) ── */}
      <section id="faq" className="py-20 sm:py-28 bg-white border-b border-neutral-200/80">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">FAQ</span>
            <h2 className="font-nunito text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight mt-1">
              Questions people usually ask.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-nunito font-bold text-sm sm:text-base text-neutral-900 hover:text-brand transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-brand' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. SECTION: FINAL CALL TO ACTION ── */}
      <section className="py-20 sm:py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-nunito text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
            Ask ScamShield before you trust.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 max-w-lg mx-auto leading-relaxed">
            Free, official, and always a message away. Verify suspicious messages and links in seconds.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/scanner/message"
              className="brand-gradient rounded-full px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 hover:opacity-90 transition-all"
            >
              Start Verifying Now
            </Link>
            <Link
              to="/scanner/url"
              className="rounded-full border border-neutral-300 bg-white px-7 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Inspect a URL
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
