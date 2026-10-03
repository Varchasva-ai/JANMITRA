import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; hi: string }> = {
  // Brand & Tagline
  'brand.name': { en: 'JanMitra', hi: 'जनमित्र' },
  'brand.tagline': { en: 'Understand. Discover. Apply.', hi: 'समझें। खोजें। आवेदन करें।' },
  'brand.subtitle': { en: 'Citizen-First Benefits & Services Navigator', hi: 'नागरिक-हितैषी सरकारी योजना व सेवा मार्गदर्शक' },

  // Navigation
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.discover': { en: 'Discover Benefits', hi: 'योजनाएं खोजें' },
  'nav.services': { en: 'Services', hi: 'सरकारी सेवाएं' },
  'nav.journey': { en: 'My Journey', hi: 'मेरी प्रगति यात्रा' },
  'nav.documents': { en: 'My Documents', hi: 'मेरे दस्तावेज' },
  'nav.saved': { en: 'Saved', hi: 'सहेजे गए' },
  'nav.profile': { en: 'Profile', hi: 'प्रोफाइल' },
  'nav.explain': { en: 'Explain This', hi: 'नियम समझें' },

  // Disclaimer
  'disclaimer.text': {
    en: 'JanMitra is an independent information and navigation platform. It does not represent the Government of India or any state government. Government authorities make the final decision on eligibility and applications.',
    hi: 'जनमित्र एक स्वतंत्र नागरिक सूचना एवं सहायता मंच है। यह भारत सरकार या किसी भी राज्य सरकार का प्रतिनिधित्व नहीं करता है। पात्रता और आवेदन पर अंतिम निर्णय संबंधित सरकारी प्राधिकरण करते हैं।'
  },
  'disclaimer.short': {
    en: 'Independent Platform • Final decision rests with government authorities',
    hi: 'स्वतंत्र सूचना मंच • अंतिम निर्णय सरकारी अधिकारियों का'
  },

  // Hero
  'hero.title': { en: 'What are you trying to do?', hi: 'आप क्या करना चाहते हैं?' },
  'hero.subtitle': {
    en: "Tell JanMitra what you need. We'll help you find relevant government benefits and guide you through the process.",
    hi: 'जनमित्र को अपनी जरूरत बताएं। हम संबंधित सरकारी योजनाओं की खोज और पूरी प्रक्रिया में आपका मार्गदर्शन करेंगे।'
  },
  'hero.input_placeholder': {
    en: "E.g. I am a 20 yr B.Tech student in Lucknow looking for financial help, or I need an income certificate...",
    hi: "उदा. मैं लखनऊ से 20 वर्ष का बी.टेक छात्र हूँ और फीस सहायता चाहिए, या मुझे आय प्रमाण पत्र बनवाना है..."
  },
  'hero.analyze_button': { en: 'Analyze My Situation', hi: 'मेरी स्थिति का विश्लेषण करें' },
  'hero.voice_button': { en: 'Voice Search', hi: 'बोलकर खोजें' },

  // Categories
  'cat.education': { en: 'Education', hi: 'शिक्षा' },
  'cat.education_sub': { en: 'Scholarships, fee assistance and student benefits', hi: 'छात्रवृत्ति, फीस प्रतिपूर्ति एवं छात्र लाभ' },
  'cat.finance': { en: 'Financial Support', hi: 'वित्तीय सहायता' },
  'cat.finance_sub': { en: 'Assistance programs for low-income families', hi: 'कम आय वाले परिवारों के लिए सहायता कार्यक्रम' },
  'cat.senior': { en: 'Senior Citizens', hi: 'वरिष्ठ नागरिक' },
  'cat.senior_sub': { en: 'Pensions and senior citizen health services', hi: 'पेंशन एवं वृद्धजन स्वास्थ्य सेवाएं' },
  'cat.health': { en: 'Healthcare', hi: 'स्वास्थ्य सेवाएं' },
  'cat.health_sub': { en: 'Cashless medical treatment & Ayushman Bharat', hi: 'मुफ्त इलाज एवं आयुष्मान भारत योजना' },
  'cat.housing': { en: 'Housing', hi: 'आवास' },
  'cat.housing_sub': { en: 'PMAY housing grants & construction assistance', hi: 'पीएम आवास योजना एवं मकान निर्माण अनुदान' },
  'cat.employment': { en: 'Employment', hi: 'रोजगार व श्रम' },
  'cat.employment_sub': { en: 'Skill development, vendor credit & worker benefits', hi: 'कौशल विकास, वेंडर ऋण एवं श्रमिक कल्याण' },
  'cat.certificates': { en: 'Certificates & Documents', hi: 'प्रमाण पत्र एवं दस्तावेज' },
  'cat.certificates_sub': { en: 'Income, domicile, caste and other public certificates', hi: 'आय, निवास, जाति और अन्य सरकारी प्रमाण पत्र' },
  'cat.agriculture': { en: 'Agriculture', hi: 'कृषि एवं किसान' },
  'cat.agriculture_sub': { en: 'PM-Kisan, crop insurance & farmer schemes', hi: 'पीएम-किसान, फसल बीमा एवं कृषक सहायता' },
  'cat.business': { en: 'Business & MSME', hi: 'व्यापार एवं स्वरोजगार' },
  'cat.business_sub': { en: 'Subsidized loans and entrepreneurship programs', hi: 'रियायती ऋण, सब्सिडी एवं स्टार्टअप सहायता' },
  'cat.not_sure': { en: "I'm Not Sure", hi: 'मुझे समझ नहीं आ रहा' },
  'cat.not_sure_sub': { en: "Tell us your situation and we'll help you navigate", hi: 'अपनी स्थिति बताएं और हम सही रास्ता दिखाएंगे' },

  // Results & Evaluation
  'results.heading': { en: 'Potentially relevant for you', hi: 'आपके लिए संभावित रूप से उपयोगी' },
  'results.subheading': {
    en: 'Based on the personal information provided. You may be eligible.',
    hi: 'प्रस्तुत विवरण के आधार पर। आप पात्र हो सकते हैं।'
  },
  'results.matched': { en: 'Match', hi: 'अनुरूप' },
  'results.uncertain': { en: 'Need More Info', hi: 'और जानकारी चाहिए' },
  'results.issue': { en: 'Potential Issue', hi: 'संभावित बाधा' },
  'results.check_eligibility': { en: 'Check Full Eligibility & Requirements', hi: 'पूर्ण पात्रता व आवश्यकताएं देखें' },
  'results.why_matched': { en: "Why you're seeing this", hi: 'आपको यह योजना क्यों दिखाई गई' },
  'results.missing_info': { en: 'Information still required', hi: 'आवश्यक अतिरिक्त जानकारी' },
  'results.potential_benefit': { en: 'Potential Benefit', hi: 'संभावित लाभ' },

  // What am I missing
  'missing.progress': { en: 'Your Progress', hi: 'आपकी तैयारी' },
  'results.completed': { en: 'Completed', hi: 'पूर्ण विवरण' },
  'results.needed': { en: 'Still Needed', hi: 'अभी आवश्यक' },
  'results.how_to_get': { en: 'How do I get the missing certificate?', hi: 'लापता प्रमाण पत्र कैसे बनवाएं?' },

  // Services Navigator
  'services.heading': { en: 'Government Public Service Navigator', hi: 'सरकारी जन सेवा मार्गदर्शक' },
  'services.subheading': { en: 'Step-by-step guidance for certificates, land extracts, and official administrative clearances.', hi: 'प्रमाण पत्र, खतौनी भूलेख एवं सरकारी प्रक्रियाओं का चरणबद्ध मार्गदर्शन।' },
  'services.search_placeholder': { en: 'Search certificates, revenue, rations...', hi: 'प्रमाण पत्र, खतौनी, राशन सेवाएं खोजें...' },
  'services.fee': { en: 'Fee', hi: 'शुल्क' },
  'services.time': { en: 'Time', hi: 'समय' },
  'services.locker_check': { en: 'Locker check', hi: 'लॉकर जांच' },
  'services.docs_ready': { en: 'documents ready', hi: 'दस्तावेज तैयार' },
  'services.view_checklist': { en: 'View Checklist & Procedure', hi: 'चेकलिस्ट व प्रक्रिया देखें' },
  'services.official_portal': { en: 'Official Portal', hi: 'आधिकारिक पोर्टल' },
  'services.what_is_this': { en: 'What is this?', hi: 'यह सेवा क्या है?' },
  'services.what_you_need': { en: 'What you need (Document Requirements)', hi: 'आवश्यक दस्तावेज चेकलिस्ट' },
  'services.matched_against_locker': { en: 'Matched against your Document Locker', hi: 'आपके दस्तावेज लॉकर से मिलान' },
  'services.mandatory': { en: 'Mandatory', hi: 'अनिवार्य' },
  'services.available': { en: 'Available', hi: 'उपलब्ध' },
  'services.expired': { en: 'Expired', hi: 'समय समाप्त' },
  'services.missing': { en: 'Missing', hi: 'बाकी' },
  'services.procedure': { en: 'Step-by-Step Official Procedure', hi: 'कदम-दर-कदम आधिकारिक प्रक्रिया' },
  'services.where_to_go': { en: 'Where to go', hi: 'कहाँ जाएं' },
  'services.what_happens_next': { en: 'What happens afterward', hi: 'इसके बाद क्या होगा' },

  // Document Locker
  'docs.heading': { en: 'My Documents & Locker', hi: 'मेरे दस्तावेज व लॉकर' },
  'docs.subheading': { en: 'Organize personal credentials and run preliminary document readiness checks for public services.', hi: 'अपने प्रमाणपत्र सुरक्षित रखें और योजनाओं के लिए कागज़ात की प्रारंभिक जांच करें।' },
  'docs.badge': { en: 'Document Intelligence', hi: 'दस्तावेज प्रबंधन' },
  'docs.upload_scan': { en: 'Upload Document (Scan)', hi: 'दस्तावेज अपलोड करें (स्कैन)' },
  'docs.guardrail_title': { en: 'Preliminary Document Check Notice:', hi: 'दस्तावेज प्रारंभिक जांच सूचना:' },
  'docs.guardrail_text': { en: 'JanMitra performs non-authoritative structural and formatting checks. We never claim legal validation; official verification is completed exclusively by government issuing officers.', hi: 'जनमित्र केवल संरचनात्मक एवं प्रारूप जांच करता है। हम कानूनी सत्यापन का दावा नहीं करते; अंतिम जांच केवल अधिकृत सरकारी अधिकारी करते हैं।' },
  'docs.matcher_title': { en: 'Document-to-Service Readiness', hi: 'योजना के अनुसार दस्तावेज तैयारी' },
  'docs.matcher_sub': { en: 'Select any program to automatically audit your document locker against its requirements.', hi: 'किसी भी योजना को चुनकर देखें कि आपके कौन से कागज़ तैयार हैं और कौन से बाकी हैं।' },
  'docs.audit_for': { en: 'Audit for:', hi: 'योजना चुनें:' },
  'docs.how_obtain': { en: 'How do I obtain this?', hi: 'यह कागज़ कैसे बनवाएं?' },
  'docs.all_ready': { en: 'All documents ready for submission', hi: 'आवेदन के लिए सभी कागज़ात तैयार हैं' },
  'docs.still_needed': { en: 'document(s) still required', hi: 'कागज़ात अभी बाकी हैं' },

  // Journey Dashboard
  'journey.heading': { en: 'My Application Journeys', hi: 'मेरी आवेदन प्रगति यात्रा' },
  'journey.subheading': { en: 'Real-time milestone tracking, document prerequisite chains, and official status logs.', hi: 'चरणबद्ध प्रगति ट्रैकिंग, आवश्यक कागज़ात और आधिकारिक स्थिति।' },
  'journey.empty_title': { en: 'No Active Journeys Yet', hi: 'अभी कोई सक्रिय आवेदन यात्रा नहीं है' },
  'journey.empty_desc': { en: 'Explore government schemes or services and click "Start Application Journey" to begin tracking.', hi: 'सरकारी योजनाओं या सेवाओं को देखें और ट्रैकिंग शुरू करने के लिए "आवेदन यात्रा शुरू करें" पर क्लिक करें।' },
  'journey.discover_cta': { en: 'Discover Benefits Now', hi: 'योजनाएं खोजें' },
  'journey.active_badge': { en: 'Active Application', hi: 'सक्रिय आवेदन' },
  'journey.last_updated': { en: 'Updated:', hi: 'अपडेट किया गया:' },
  'journey.goal': { en: 'Goal:', hi: 'लक्ष्य:' },
  'journey.current_stage': { en: 'Current Stage', hi: 'वर्तमान चरण' },
  'journey.app_number': { en: 'Application / Ref Number:', hi: 'आवेदन / संदर्भ संख्या:' },
  'journey.save_notes': { en: 'Save Notes', hi: 'नोट्स सहेजें' },
  'journey.track_status': { en: 'Track Official Status', hi: 'सरकारी स्थिति ट्रैक करें' },

  // Stages
  'stage.preparation': { en: 'Preparation', hi: 'तैयारी (कागज़ात)' },
  'stage.ready_to_apply': { en: 'Ready to Apply', hi: 'आवेदन हेतु तैयार' },
  'stage.submitted': { en: 'Submitted', hi: 'जमा किया गया' },
  'stage.under_verification': { en: 'Under Verification', hi: 'जांच प्रक्रियाधीन (लेखपाल)' },
  'stage.action_required': { en: 'Action Required', hi: 'सुधार अपेक्षित' },
  'stage.approved': { en: 'Approved', hi: 'स्वीकृत ✓' },
  'stage.completed': { en: 'Completed', hi: 'लाभ प्राप्त (सफल)' },

  // Government Simplifier (Explain This)
  'explain.heading': { en: 'Explain This: Government Language → Human Action', hi: 'नियम समझें: कठिन सरकारी भाषा → सरल आम बोलचाल' },
  'explain.subheading': { en: 'Paste dense bureaucratic gazettes, court orders, or notifications to extract clear directions and avoid common traps.', hi: 'कठिन सरकारी आदेश, अधिसूचना या सर्कुलर पेस्ट करें और आसान शब्दों में समझें कि आपको क्या करना है।' },
  'explain.badge': { en: 'AI Government Language Simplifier', hi: 'शासनादेश एवं कानूनी भाषा अनुवादक' },
  'explain.choose_snippet': { en: 'Choose a Real Government Order to Simplify:', hi: 'सरल भाषा में समझने के लिए सरकारी आदेश चुनें:' },
  'explain.paste_custom': { en: 'Or Paste Your Own Document / Order Text:', hi: 'या अपना सरकारी आदेश / पत्र यहाँ पेस्ट करें:' },
  'explain.button_simplify': { en: 'Simplify with JanMitra', hi: 'जनमित्र से सरल भाषा में समझें' },
  'explain.who_gets_it': { en: 'Who qualifies for this:', hi: 'किसे लाभ मिलेगा (पात्रता):' },
  'explain.action_step': { en: 'Action to take:', hi: 'आपको क्या कदम उठाना है:' },
  'explain.caution': { en: 'Common trap / Warning:', hi: 'सावधानी / सामान्य गलती:' },

  // Profile Editor
  'profile.title': { en: 'Personal Citizen Profile', hi: 'नागरिक प्रोफाइल विवरण' },
  'profile.subtitle': { en: 'This data is stored on your device and used solely to calculate scheme criteria.', hi: 'यह जानकारी आपके डिवाइस पर सुरक्षित रहती है और केवल योजना पात्रता जांचने के लिए उपयोग होती है।' },
  'profile.switch_account': { en: 'Switch Account / Role', hi: 'खाता / भूमिका बदलें' },
  'profile.sign_out': { en: 'Sign Out', hi: 'लॉग आउट' },
  'profile.account_ref': { en: 'Account Ref ID', hi: 'खाता संदर्भ आईडी' },
  'profile.name': { en: 'Full Name', hi: 'पूरा नाम' },
  'profile.age': { en: 'Age', hi: 'आयु' },
  'profile.state': { en: 'State', hi: 'राज्य' },
  'profile.district': { en: 'District', hi: 'ज़िला' },
  'profile.education': { en: 'Education Level', hi: 'शिक्षा का स्तर' },
  'profile.occupation': { en: 'Occupation / Employment', hi: 'व्यवसाय / आजीविका' },
  'profile.income': { en: 'Annual Household Income (₹)', hi: 'वार्षिक पारिवारिक आय (₹)' },
  'profile.category': { en: 'Social Category', hi: 'सामाजिक वर्ग' },
  'profile.save_button': { en: 'Save Profile Changes', hi: 'प्रोफाइल विवरण सहेजें' },
  'profile.saved_success': { en: 'Profile Saved & Recalculated!', hi: 'प्रोफाइल सहेजा गया और पात्रता पुनः जांची गई!' },

  // Vakh Civic Chaupal
  'vakh.heading': { en: 'Vakh Civic Chaupal', hi: 'वख जन-चौपाल (स्थानीय नागरिक सूचना पट्ट)' },
  'vakh.subheading': { en: 'Real-time ground notices on local CSC desks, Aadhaar camps, and Lekhpal verification schedules.', hi: 'जमीनी सरकारी शिविर, सीएससी काउंटर उपलब्धता और तहसील सत्यापन की वास्तविक सूचनाएं।' },
  'vakh.curated_by': { en: 'Curated & Moderated by:', hi: 'क्यूरेटेड व मॉडरेटेड:' },
  'vakh.post_placeholder': { en: 'Share a ground update (e.g., Tehsil counter queue, CSC camp dates, token status)...', hi: 'ज़मीनी अपडेट साझा करें (उदा. तहसील काउंटर पर भीड़, सीएससी शिविर की तारीख, टोकन स्थिति)...' },
  'vakh.post_button': { en: 'Post Update', hi: 'सूचना साझा करें' },
  'vakh.filter_district': { en: 'Filter by District', hi: 'ज़िले के अनुसार देखें' },
  'vakh.all_districts': { en: 'All Districts (Uttar Pradesh)', hi: 'सभी ज़िले (उत्तर प्रदेश)' },
  'vakh.all_updates': { en: 'All Updates', hi: 'सभी सूचनाएं' },

  // Common UI
  'action.save': { en: 'Save', hi: 'सहेजें' },
  'action.saved': { en: 'Saved', hi: 'सहेजा गया' },
  'action.start_journey': { en: 'Start Application Journey', hi: 'आवेदन यात्रा शुरू करें' },
  'action.view_source': { en: 'View Official Source', hi: 'आधिकारिक स्रोत देखें' },
  'action.why_saying_this': { en: 'Why is JanMitra saying this?', hi: 'जनमित्र यह जानकारी किस आधार पर दे रहा है?' },
  'action.upload_doc': { en: 'Upload Document', hi: 'दस्तावेज अपलोड करें' },
  'action.preliminary_check': { en: 'Preliminary Document Check', hi: 'दस्तावेज की प्रारंभिक जांच' },
  'action.close': { en: 'Close', hi: 'बंद करें' },
  'action.search': { en: 'Search benefits, services, documents...', hi: 'योजनाएं, सेवाएं, दस्तावेज खोजें...' },
  'action.listen': { en: 'Listen', hi: 'सुनें' },
  'action.listening': { en: 'Listening...', hi: 'सुन रहे हैं...' },
  'action.resolve': { en: 'Resolve', hi: 'समाधान करें' },
  'action.open_service': { en: 'Open Service', hi: 'सेवा देखें' },
  'action.proceed': { en: 'Proceed to Step', hi: 'अगला कदम उठाएं' },
  'action.edit_notes': { en: 'Edit Notes', hi: 'नोट्स संपादित करें' },
  'action.save_changes': { en: 'Save Changes', hi: 'बदलाव सहेजें' },

  // Differentiators & Headers
  'engine.eligibility': { en: 'Eligibility Engine', hi: 'पात्रता इंजन' },
  'engine.dependency': { en: 'Differentiator • Dependency Engine', hi: 'विशेषता • दस्तावेज़ निर्भरता इंजन' },
  'engine.dependency_title': { en: 'Government Service Dependency Graph', hi: 'सरकारी सेवा निर्भरता आरेख (दस्तावेज़ सम्बद्धता)' },
  'engine.dependency_desc': { en: 'Understand how administrative documents link together before official application submission.', hi: 'सरकारी आवेदन जमा करने से पहले समझें कि कौन सा दस्तावेज़ किस सेवा से जुड़ा है।' },
  'engine.next_recommended': { en: 'Next Recommended Step:', hi: 'अगला अनुशंसित कदम:' },
  'engine.obtain': { en: 'Obtain', hi: 'प्राप्त करें:' },
  'engine.locker_satisfied': { en: 'Available in locker', hi: 'लॉकर में उपलब्ध है' },
  'engine.action_required_lock': { en: 'Action required before scheme lock', hi: 'योजना आवेदन से पूर्व अनिवार्य' },
  'engine.tree_legend_satisfied': { en: '✓ = Satisfied from your Document Locker', hi: '✓ = आपके दस्तावेज़ लॉकर में पहले से उपलब्ध है' },
  'engine.tree_legend_blocked': { en: '⚠ = Prerequisite that blocks final approval', hi: '⚠ = अनिवार्य दस्तावेज़ जिसके बिना आवेदन रुक सकता है' },

  // Lifecycle
  'lifecycle.title': { en: 'Interactive Application Lifecycle State:', hi: 'आवेदन जीवनचक्र स्थिति (लाइफसाइकिल):' },
  'lifecycle.subtitle': { en: '(Click to test lifecycle transitions)', hi: '(स्थिति बदलने के लिए क्लिक करें)' },
  'lifecycle.milestone': { en: 'Milestone Progress', hi: 'मील के पत्थर / चरणबद्ध प्रगति' },
  'lifecycle.nav': { en: 'Lifecycle Navigation', hi: 'आवेदन यात्रा सूची' },

  // Sandbox & Tracking
  'sandbox.badge': { en: 'Government Sandbox Adapters', hi: 'सरकारी सैंडबॉक्स सत्यापन एडेप्टर' },
  'sandbox.title': { en: 'Live Gateway Simulator (UP e-District, DigiLocker, DBT)', hi: 'लाइव गेटवे सत्यापन सिम्युलेटर (यूपी ई-डिस्ट्रिक्ट, डिजीलॉकर, डीबीटी)' },
  'sandbox.desc': { en: 'Simulate electronic verification against official government API endpoints.', hi: 'आधिकारिक सरकारी एपीआई एंडपॉइंट्स के साथ इलेक्ट्रॉनिक सत्यापन का परीक्षण करें।' },
  'sandbox.edistrict_tab': { en: 'UP e-District', hi: 'यूपी ई-डिस्ट्रिक्ट' },
  'sandbox.dbt_tab': { en: 'NPCI / PFMS DBT', hi: 'एनपीसीआई / पीएफएमएस डीबीटी' },
  'sandbox.cert_label': { en: 'UP Certificate Number (14 digits):', hi: 'यूपी प्रमाण पत्र संख्या (14 अंक):' },
  'sandbox.aadhaar_label': { en: 'Aadhaar Last 4 Digits:', hi: 'आधार के अंतिम 4 अंक:' },
  'sandbox.btn_running': { en: 'Querying Sandbox...', hi: 'सत्यापन किया जा रहा है...' },
  'sandbox.btn_run': { en: 'Run Official Verification', hi: 'आधिकारिक सत्यापन चलाएं' },
  'tracking.portal_badge': { en: 'Statutory Transparency Portal', hi: 'वैधानिक पारदर्शिता पोर्टल' },
  'tracking.portal_title': { en: 'UP Right to Public Services Status Tracker', hi: 'उत्तर प्रदेश जनहित गारंटी सेवा स्थिति ट्रैकर' },
  'tracking.portal_desc': { en: 'Enter any UP e-District or scholarship application number to audit handling officers and Janhit Guarantee SLA deadlines.', hi: 'अधिकारियों की जिम्मेदारी और जनहित गारंटी की समय सीमा देखने के लिए आवेदन संख्या दर्ज करें।' },
  'tracking.btn_tracking': { en: 'Auditing Gateway...', hi: 'गेटवे से जांच हो रही है...' },
  'tracking.btn_track': { en: 'Track Verified Status', hi: 'सत्यापित स्थिति ट्रैक करें' }
};

export const formatSchemeLevel = (level: string, lang: Language): string => {
  if (lang === 'hi') {
    if (level.includes('State') || level.includes('Uttar Pradesh')) return 'राज्य (उत्तर प्रदेश)';
    if (level.includes('Centrally Sponsored')) return 'केंद्र प्रायोजित योजना';
    if (level.includes('Central') || level.includes('Govt of India')) return 'केंद्र (भारत सरकार)';
    return level;
  }
  return level;
};

export const formatCategory = (category: string, lang: Language): string => {
  if (lang === 'hi') {
    const map: Record<string, string> = {
      education: 'शिक्षा',
      agriculture: 'कृषि',
      senior_citizen: 'वरिष्ठ नागरिक',
      health: 'स्वास्थ्य',
      financial: 'वित्तीय सहायता',
      housing: 'आवास',
      business: 'व्यापार व उद्योग',
      employment: 'रोजगार व श्रम',
      certificates: 'प्रमाण पत्र एवं दस्तावेज',
      women_child: 'महिला व बाल विकास'
    };
    return map[category.toLowerCase()] || category;
  }
  return category;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('janmitra_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('janmitra_lang', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
