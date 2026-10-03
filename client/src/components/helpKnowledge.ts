import type { WorkerProfile } from '../types';

export type ChatLanguage = 'en' | 'hi' | 'hinglish';

export interface LocalizedText {
  en: string;
  hi: string;
  hinglish: string;
}

export interface HelpAnswer {
  id: string;
  questions: Record<ChatLanguage, string[]>;
  keywords?: string[][];
  answer: LocalizedText;
  href?: string;
  linkLabel?: LocalizedText;
}

export const HELP_ANSWERS: HelpAnswer[] = [
  {
    id: 'book-worker',
    questions: {
      en: ['how do i book a worker', 'how i book worker', 'how do i book worker', 'how can i book worker', 'how to book a worker', 'book a worker', 'hire a worker', 'how do i hire someone', 'how can i book a service', 'how does booking work'],
      hi: ['मैं वर्कर कैसे बुक करूं', 'मुझे वर्कर बुक करना है', 'बुकिंग कैसे करें', 'सेवा कैसे बुक करें'],
      hinglish: ['worker kaise book karu', 'mujhe worker book karna hai', 'booking kaise kare', 'booking kaise kre', 'booking krna hai', 'booking krni hai', 'book kaise kre', 'service kaise book karu', 'kisi ko hire kaise karu'],
    },
    keywords: [
      ['booking', 'kaise', 'kare'],
      ['booking', 'kaise', 'karu'],
      ['booking', 'karna', 'hai'],
      ['booking', 'karni', 'hai'],
      ['book', 'kaise', 'kare'],
      ['book', 'kaise', 'karu'],
      ['worker', 'book', 'karna'],
      ['how', 'book', 'worker'],
      ['book', 'worker'],
      ['book', 'service'],
      ['booking', 'worker'],
    ],
    answer: {
      en: 'Browse approved workers on Home, filter by service or city, and open a worker profile. Select Book, then enter the service, date and time, full address, and current location. Sign in or create a customer account if prompted.',
      hi: 'होम पेज पर उपलब्ध सत्यापित वर्कर देखें और सेवा या शहर के अनुसार खोजें। वर्कर की प्रोफ़ाइल खोलकर “बुक” चुनें, फिर सेवा, तारीख, समय, पूरा पता और अपनी वर्तमान लोकेशन भरें। पूछे जाने पर पहले ग्राहक खाते में साइन इन करें या नया खाता बनाएं।',
      hinglish: 'Home par approved workers dekhein aur service ya city se filter karein. Worker profile kholkar Book chunein, phir service, date, time, poora address aur apni current location bharein. Agar kaha jaye to pehle customer account mein sign in ya register karein.',
    },
    href: '/#workers-section',
    linkLabel: { en: 'Browse workers', hi: 'वर्कर देखें', hinglish: 'Workers dekhein' },
  },
  {
    id: 'services-cities',
    questions: {
      en: ['what services are available', 'which services do you offer', 'what cities are available', 'is a plumber available', 'do you have an electrician', 'cleaning service', 'carpenter', 'painter', 'appliance repair', 'ac repair', 'gardening service'],
      hi: ['कौन सी सेवाएं उपलब्ध हैं', 'कौन सी सर्विस मिलती है', 'किन शहरों में सेवा है', 'क्या प्लंबर मिलेगा', 'इलेक्ट्रिशियन उपलब्ध है', 'मुझे प्लंबर चाहिए', 'बिजली का काम कौन करेगा'],
      hinglish: ['kaunsi services available hain', 'kaun kaun si service milti hai', 'kin cities mein service hai', 'plumber milega kya', 'plumber chahiye', 'electrician available hai', 'electrician chahiye', 'safai service chahiye'],
    },
    answer: {
      en: 'The portal lists Plumbing, Electrical, Cleaning, Painting, Carpentry, Appliance Repair, and Gardening, along with workers’ listed skills. The city filter includes Bangalore, Mumbai, Delhi NCR, Hyderabad, and Pune. Check live listings for current availability; bookings must be within 50 km of the worker’s service location.',
      hi: 'पोर्टल पर प्लंबिंग, इलेक्ट्रिकल, सफाई, पेंटिंग, बढ़ईगीरी, उपकरण मरम्मत और बागवानी सेवाएं तथा वर्कर के दर्ज कौशल उपलब्ध हैं। शहर फ़िल्टर में बेंगलुरु, मुंबई, दिल्ली NCR, हैदराबाद और पुणे हैं। मौजूदा उपलब्धता के लिए सूची देखें। बुकिंग वर्कर की सेवा लोकेशन से 50 किमी के भीतर होनी चाहिए।',
      hinglish: 'Portal par plumbing, electrical, cleaning, painting, carpentry, appliance repair aur gardening services listed hain. City filter mein Bangalore, Mumbai, Delhi NCR, Hyderabad aur Pune hain. Abhi availability ke liye live listing dekhein. Booking worker ki service location se 50 km ke andar honi chahiye.',
    },
    href: '/#workers-section',
    linkLabel: { en: 'See available workers', hi: 'उपलब्ध वर्कर देखें', hinglish: 'Available workers dekhein' },
  },
  {
    id: 'rates',
    questions: {
      en: ['how much does it cost', 'what is the price', 'how much will i pay', 'what are the charges', 'is there a hidden fee', 'daily wage', 'booking total', 'do you charge a platform fee', 'is gst included', 'are materials included'],
      hi: ['कितना खर्च आएगा', 'कीमत क्या है', 'मुझे कितना भुगतान करना होगा', 'क्या कोई छिपा शुल्क है', 'दैनिक मजदूरी कितनी है', 'क्या सामग्री का पैसा शामिल है'],
      hinglish: ['kitna kharcha aayega', 'price kya hai', 'mujhe kitna pay karna hoga', 'koi hidden charge hai kya', 'daily wage kitni hai', 'kitna paisa lagega', 'gst include hai kya', 'material ka paisa included hai'],
    },
    answer: {
      en: 'Each worker sets the daily wage shown on their profile. The total is that wage, plus a 20% surcharge (rounded to the nearest rupee) only if you mark the booking urgent. Review the amount on the booking page before submitting.',
      hi: 'हर वर्कर अपनी प्रोफ़ाइल पर दैनिक दर तय करता है। कुल राशि में वही दर शामिल होती है। बुकिंग को अर्जेंट चुनने पर ही 20% अतिरिक्त शुल्क (निकटतम रुपये तक राउंड) जुड़ता है। पुष्टि करने से पहले बुकिंग पेज पर राशि देख लें।',
      hinglish: 'Har worker apni profile par daily wage set karta hai. Total mein wahi rate hota hai. Sirf urgent booking chunne par 20% extra charge (nearest rupee tak round) lagta hai. Confirm karne se pehle booking page par total dekh lein.',
    },
    href: '/#workers-section',
    linkLabel: { en: 'Compare worker rates', hi: 'वर्कर की दरें देखें', hinglish: 'Worker rates compare karein' },
  },
  {
    id: 'urgent',
    questions: {
      en: ['how to book urgently', 'urgent booking fee', 'emergency service', 'is there an urgent charge', 'need a worker urgently'],
      hi: ['अर्जेंट बुकिंग कैसे करें', 'तुरंत सेवा चाहिए', 'अर्जेंट शुल्क कितना है', 'इमरजेंसी सेवा मिलती है'],
      hinglish: ['urgent booking kaise kare', 'turant service chahiye', 'urgent charge kitna hai', 'emergency service chahiye'],
    },
    answer: {
      en: 'Select the urgent option on the booking form. It adds 20% of the worker’s daily wage to the total (rounded to the nearest rupee). The updated amount is shown before you confirm.',
      hi: 'बुकिंग फ़ॉर्म में अर्जेंट विकल्प चुनें। इससे वर्कर की दैनिक दर का 20% अतिरिक्त शुल्क (निकटतम रुपये तक राउंड) जुड़ता है। पुष्टि से पहले नई कुल राशि दिखाई जाती है।',
      hinglish: 'Booking form mein urgent option chunein. Worker ki daily wage ka 20% extra charge (nearest rupee tak round) judta hai. Confirm karne se pehle updated total dikhega.',
    },
  },
  {
    id: 'payment',
    questions: {
      en: ['how can i pay', 'how do i pay', 'how i pay', 'how can i make payment', 'how do i make payment', 'payment methods', 'can i pay cash', 'pay cash after service', 'can i pay online', 'is cash on delivery available', 'razorpay payment'],
      hi: ['भुगतान कैसे करें', 'क्या नकद भुगतान कर सकते हैं', 'क्या ऑनलाइन भुगतान है', 'कैश में भुगतान करूं', 'पेमेंट के तरीके क्या हैं'],
      hinglish: ['payment kaise kare', 'payment kaise kre', 'apayment kaise kre', 'a payment kaise kre', 'payment kese kare', 'payment kaise karu', 'payment krna hai', 'paise kaise pay kare', 'cash de sakte hain', 'cash payment kar sakte hain', 'online payment hai kya', 'cash mein pay karu'],
    },
    keywords: [
      ['payment', 'kaise', 'kare'],
      ['payment', 'kaise', 'karu'],
      ['payment', 'karna', 'hai'],
      ['payment', 'kaise', 'karo'],
      ['paise', 'kaise', 'pay', 'kare'],
      ['cash', 'payment', 'kaise', 'kare'],
      ['online', 'payment', 'kaise', 'kare'],
      ['how', 'i', 'pay'],
      ['how', 'pay'],
      ['how', 'i', 'payment'],
      ['pay', 'cash'],
      ['pay', 'online'],
      ['payment', 'method'],
    ],
    answer: {
      en: 'Choose secure online payment through Razorpay or cash after the service on the booking form. Online booking requests are sent after payment verification. Cash is paid directly to the worker after the service is completed.',
      hi: 'बुकिंग फ़ॉर्म में Razorpay से ऑनलाइन भुगतान या सेवा के बाद नकद भुगतान चुनें। ऑनलाइन बुकिंग अनुरोध भुगतान सत्यापित होने के बाद भेजा जाता है। नकद राशि सेवा पूरी होने पर सीधे वर्कर को दें।',
      hinglish: 'Booking form par Razorpay se online payment ya service ke baad cash chunein. Online booking request payment verify hone ke baad bheji jaati hai. Cash service complete hone ke baad seedha worker ko dein.',
    },
  },
  {
    id: 'payment-failed',
    questions: {
      en: ['payment failed', 'payment did not work', 'money deducted but booking failed', 'payment error', 'how to retry payment', 'payment was cancelled', 'charged but no booking', 'upi payment failed', 'card was charged'],
      hi: ['पेमेंट फेल हो गया', 'पैसे कट गए लेकिन बुकिंग नहीं हुई', 'भुगतान में समस्या है', 'पेमेंट दोबारा कैसे करें', 'UPI से पैसे कट गए'],
      hinglish: ['payment fail ho gaya', 'paise kat gaye booking nahi hui', 'payment mein problem hai', 'payment dobara kaise kare', 'payment error aa raha hai', 'upi se paise kat gaye'],
    },
    answer: {
      en: 'If checkout was dismissed or did not complete, you can retry from My Bookings. Check the booking’s payment status before trying again. The portal cannot confirm a bank-side debit or promise a refund timeline.',
      hi: 'यदि भुगतान विंडो बंद हो गई या भुगतान पूरा नहीं हुआ, तो My Bookings से दोबारा प्रयास करें। फिर से भुगतान करने से पहले बुकिंग की भुगतान स्थिति जांचें। पोर्टल बैंक से कटी राशि या रिफंड का समय सुनिश्चित नहीं कर सकता।',
      hinglish: 'Agar checkout band ho gaya ya payment complete nahi hua, My Bookings se dobara try karein. Dobara pay karne se pehle booking ka payment status check karein. Portal bank debit ya refund ka time confirm nahi kar sakta.',
    },
    href: '/my-bookings',
    linkLabel: { en: 'Open My Bookings', hi: 'मेरी बुकिंग खोलें', hinglish: 'My Bookings kholein' },
  },
  {
    id: 'refund',
    questions: {
      en: ['refund policy', 'when will i get a refund', 'where is my refund', 'will i get my money back', 'refund status', 'cancelled booking refund'],
      hi: ['रिफंड कब मिलेगा', 'मेरे पैसे वापस कब आएंगे', 'रिफंड की स्थिति क्या है', 'क्या पैसे वापस मिलेंगे'],
      hinglish: ['refund kab milega', 'mere paise wapas kab aayenge', 'refund status kya hai', 'paise wapas milenge kya'],
    },
    answer: {
      en: 'The portal does not publish refund eligibility or processing timelines, so I cannot confirm whether or when a payment will be returned. Check payment status in My Bookings; cancelling a booking does not itself display or initiate a refund.',
      hi: 'पोर्टल पर रिफंड की पात्रता या समय-सीमा प्रकाशित नहीं है, इसलिए मैं रिफंड मिलने की पुष्टि नहीं कर सकता। My Bookings में भुगतान स्थिति जांचें। बुकिंग रद्द करने से अपने-आप रिफंड शुरू होने की जानकारी नहीं दी जाती।',
      hinglish: 'Portal par refund eligibility ya processing time nahi diya gaya hai, isliye main refund kab ya milega ya nahi confirm nahi kar sakta. My Bookings mein payment status check karein. Booking cancel karne se refund apne-aap shuru nahi hota.',
    },
    href: '/my-bookings',
    linkLabel: { en: 'Check payment status', hi: 'भुगतान स्थिति देखें', hinglish: 'Payment status dekhein' },
  },
  {
    id: 'schedule',
    questions: {
      en: ['what time slots are available', 'what are the booking timings', 'when can i book', 'can i book tomorrow', 'can i book today', 'same day booking', 'booking date and time', 'what time does the worker come'],
      hi: ['कौन से समय उपलब्ध हैं', 'बुकिंग का समय क्या है', 'कल बुकिंग कर सकते हैं', 'आज बुकिंग कर सकते हैं', 'वर्कर कितने बजे आएगा'],
      hinglish: ['kaun se time slots available hain', 'booking ka time kya hai', 'kal booking kar sakte hain', 'aaj booking kar sakte hain', 'same day booking', 'worker kitne baje aayega'],
    },
    answer: {
      en: 'Choose a date and one of these two-hour slots: 8–10 AM, 10 AM–12 PM, 12–2 PM, 2–4 PM, or 4–6 PM. The form initially selects tomorrow, but you can change the date.',
      hi: 'तारीख और दो घंटे का स्लॉट चुनें: सुबह 8–10, 10–12, दोपहर 12–2, 2–4 या 4–6 बजे। फ़ॉर्म में शुरुआत में कल की तारीख चुनी होती है, जिसे आप बदल सकते हैं।',
      hinglish: 'Date aur do ghante ka slot chunein: subah 8–10, 10–12, dopahar 12–2, 2–4 ya 4–6 baje. Form mein pehle se kal ki date hoti hai, aap ise badal sakte hain.',
    },
  },
  {
    id: 'service-radius',
    questions: {
      en: ['why do you need my location', '50 km service radius', 'how far can a worker travel', 'location permission not working', 'booking distance limit', 'worker is too far away'],
      hi: ['मेरी लोकेशन क्यों चाहिए', '50 किलोमीटर की सीमा क्या है', 'वर्कर दूर है', 'लोकेशन की अनुमति कैसे दें'],
      hinglish: ['meri location kyun chahiye', '50 km limit kya hai', 'worker bahut door hai', 'location permission kaise dein'],
    },
    answer: {
      en: 'Bookings require browser location access and are limited to 50 km from the worker’s saved service location. Allow location access in your browser; if the worker is outside the radius, choose another worker.',
      hi: 'बुकिंग के लिए ब्राउज़र की लोकेशन अनुमति आवश्यक है और वर्कर की दर्ज सेवा लोकेशन से 50 किमी तक ही बुकिंग हो सकती है। ब्राउज़र में लोकेशन अनुमति दें। वर्कर सीमा से बाहर हो तो दूसरा वर्कर चुनें।',
      hinglish: 'Booking ke liye browser location permission chahiye aur worker ki saved service location se 50 km ke andar hi booking ho sakti hai. Browser mein location allow karein. Worker door ho to doosra worker chunein.',
    },
    href: '/#workers-section',
    linkLabel: { en: 'Choose a worker', hi: 'वर्कर चुनें', hinglish: 'Worker chunein' },
  },
  {
    id: 'track-booking',
    questions: {
      en: ['track my booking', 'where is my booking', 'booking status', 'check booking status', 'how do i see my order', 'worker live location', 'track the worker'],
      hi: ['मेरी बुकिंग कहां है', 'बुकिंग की स्थिति कैसे देखें', 'वर्कर की लोकेशन कैसे देखें', 'मेरी बुकिंग ट्रैक करें'],
      hinglish: ['meri booking kahan hai', 'booking status', 'booking status kaise dekhein', 'worker ki live location kaise dekhein', 'booking track karni hai'],
    },
    answer: {
      en: 'Open My Bookings to see the booking status. New requests are pending until the worker accepts or rejects them. For accepted bookings, the worker’s live location may appear if they start sharing it.',
      hi: 'बुकिंग की स्थिति देखने के लिए My Bookings खोलें। नया अनुरोध तब तक लंबित रहता है जब तक वर्कर उसे स्वीकार या अस्वीकार न करे। स्वीकृत बुकिंग में वर्कर द्वारा लोकेशन शेयर करने पर लाइव लोकेशन दिख सकती है।',
      hinglish: 'Booking status dekhne ke liye My Bookings kholein. Nayi request tab tak pending rahegi jab tak worker accept ya reject na kare. Accepted booking mein worker location share kare to live location dikhegi.',
    },
    href: '/my-bookings',
    linkLabel: { en: 'View My Bookings', hi: 'मेरी बुकिंग देखें', hinglish: 'My Bookings dekhein' },
  },
  {
    id: 'cancel-booking',
    questions: {
      en: ['how do i cancel a booking', 'cancel my booking', 'can i cancel after acceptance', 'cancel booking request', 'change or cancel booking'],
      hi: ['बुकिंग कैसे रद्द करें', 'मेरी बुकिंग रद्द करनी है', 'स्वीकृत बुकिंग रद्द कर सकते हैं', 'बुकिंग कैंसल कैसे करें'],
      hinglish: ['booking kaise cancel kare', 'meri booking cancel karni hai', 'accepted booking cancel kar sakte hain', 'booking cancel kaise kare'],
    },
    answer: {
      en: 'Customers can cancel only while a booking is pending. Open My Bookings and use its cancel action. The portal does not specify a refund policy for cancellations.',
      hi: 'ग्राहक केवल लंबित बुकिंग रद्द कर सकते हैं। My Bookings खोलें और रद्द करने का विकल्प चुनें। पोर्टल रद्द की गई बुकिंग के लिए रिफंड नीति नहीं बताता।',
      hinglish: 'Customer sirf pending booking cancel kar sakte hain. My Bookings kholkar cancel option use karein. Portal cancellation ke refund rules nahi batata.',
    },
    href: '/my-bookings',
    linkLabel: { en: 'Open My Bookings', hi: 'मेरी बुकिंग खोलें', hinglish: 'My Bookings kholein' },
  },
  {
    id: 'customer-account',
    questions: {
      en: ['how do i create an account', 'customer sign up', 'register as customer', 'how to sign up', 'what do i need to register'],
      hi: ['खाता कैसे बनाएं', 'ग्राहक के रूप में रजिस्टर कैसे करें', 'साइन अप कैसे करें'],
      hinglish: ['account kaise banaye', 'customer ke roop mein register kaise kare', 'sign up kaise kare'],
    },
    answer: {
      en: 'Select Register, choose Customer, and enter your name, email, phone number, and a password of at least six characters. Sign in with your email and password.',
      hi: 'Register चुनें, Customer भूमिका चुनें और अपना नाम, ईमेल, फ़ोन नंबर तथा कम से कम छह अक्षरों का पासवर्ड भरें। इसके बाद ईमेल और पासवर्ड से साइन इन करें।',
      hinglish: 'Register chunein, Customer select karein aur naam, email, phone number aur kam-se-kam 6 characters ka password bharein. Phir email aur password se sign in karein.',
    },
    href: '/register',
    linkLabel: { en: 'Create an account', hi: 'खाता बनाएं', hinglish: 'Account banayein' },
  },
  {
    id: 'login-password',
    questions: {
      en: ['forgot password', 'reset my password', 'cannot log in', 'login problem', 'mobile otp login', 'login with phone number', 'password reset link'],
      hi: ['पासवर्ड भूल गया', 'पासवर्ड रीसेट कैसे करें', 'लॉगिन नहीं हो रहा', 'मोबाइल OTP से लॉगिन'],
      hinglish: ['password bhool gaya', 'password reset kaise kare', 'login nahi ho raha', 'mobile OTP se login kar sakte hain'],
    },
    answer: {
      en: 'On Login, select Forgot password and enter your account email. The reset link is emailed to you and expires after 15 minutes. Login uses email and password; mobile OTP login is currently disabled.',
      hi: 'Login पेज पर Forgot password चुनें और अपने खाते का ईमेल भरें। रीसेट लिंक ईमेल से आएगा और 15 मिनट में समाप्त हो जाएगा। लॉगिन ईमेल और पासवर्ड से होता है; मोबाइल OTP लॉगिन अभी उपलब्ध नहीं है।',
      hinglish: 'Login page par Forgot password chunein aur account email bharein. Reset link email se aayega aur 15 minute mein expire hoga. Login email aur password se hota hai; mobile OTP login abhi band hai.',
    },
    href: '/forgot-password',
    linkLabel: { en: 'Reset your password', hi: 'पासवर्ड रीसेट करें', hinglish: 'Password reset karein' },
  },
  {
    id: 'profile',
    questions: {
      en: ['edit my profile', 'update my account details', 'change profile information', 'update worker skills', 'change my daily wage'],
      hi: ['मेरी प्रोफ़ाइल कैसे बदलें', 'खाते की जानकारी कैसे बदलें', 'वर्कर की स्किल कैसे बदलें'],
      hinglish: ['profile update kaise kare', 'account details kaise badle', 'worker skills kaise change kare'],
    },
    answer: {
      en: 'Sign in and open Profile to update customer details. Workers can manage skills, service location, and daily wage in Profile & Documents.',
      hi: 'साइन इन करके ग्राहक जानकारी बदलने के लिए Profile खोलें। वर्कर अपनी स्किल, सेवा लोकेशन और दैनिक दर Profile & Documents में बदल सकते हैं।',
      hinglish: 'Sign in karke customer details ke liye Profile kholein. Workers apni skills, service location aur daily wage Profile & Documents mein update kar sakte hain.',
    },
    href: '/profile',
    linkLabel: { en: 'Open your profile', hi: 'प्रोफ़ाइल खोलें', hinglish: 'Profile kholein' },
  },
  {
    id: 'worker-registration',
    questions: {
      en: ['how do i become a worker', 'register as worker', 'join as a professional', 'how to list my services', 'worker registration process'],
      hi: ['वर्कर के रूप में कैसे जुड़ें', 'वर्कर रजिस्ट्रेशन कैसे करें', 'अपनी सेवा कैसे जोड़ें'],
      hinglish: ['worker kaise bane', 'worker registration kaise kare', 'professional ke roop mein kaise jude', 'apni service kaise list kare'],
    },
    answer: {
      en: 'Register and select Worker / Professional. Complete your profile with contact details, skills, address, service location, experience, and daily wage. Upload Aadhaar and/or PAN for verification. Customers can see your profile after admin approval.',
      hi: 'Register चुनकर Worker / Professional भूमिका चुनें। संपर्क जानकारी, कौशल, पता, सेवा लोकेशन, अनुभव और दैनिक दर भरें। सत्यापन के लिए Aadhaar और/या PAN अपलोड करें। एडमिन की मंज़ूरी के बाद ग्राहक आपकी प्रोफ़ाइल देख पाएंगे।',
      hinglish: 'Register mein Worker / Professional chunein. Contact details, skills, address, service location, experience aur daily wage bharein. Verification ke liye Aadhaar aur/ya PAN upload karein. Admin approval ke baad customers profile dekh sakte hain.',
    },
    href: '/register',
    linkLabel: { en: 'Register as a worker', hi: 'वर्कर के रूप में रजिस्टर करें', hinglish: 'Worker ke roop mein register karein' },
  },
  {
    id: 'worker-verification',
    questions: {
      en: ['how do i get verified', 'worker verification documents', 'verification pending', 'upload aadhaar', 'upload pan card', 'why am i not listed'],
      hi: ['वर्कर सत्यापन कैसे होगा', 'कौन से दस्तावेज़ अपलोड करें', 'सत्यापन लंबित है', 'मेरा प्रोफ़ाइल सूची में क्यों नहीं है'],
      hinglish: ['worker verification kaise hoga', 'kaun se documents upload kare', 'verification pending hai', 'profile list mein kyun nahi hai'],
    },
    answer: {
      en: 'Workers upload Aadhaar and/or PAN from Profile & Documents. After uploading, verification is pending review. Only administrator-approved workers appear in customer listings.',
      hi: 'वर्कर Profile & Documents से Aadhaar और/या PAN अपलोड करें। अपलोड के बाद सत्यापन समीक्षा के लिए लंबित रहता है। केवल एडमिन द्वारा स्वीकृत वर्कर ही ग्राहक सूची में दिखाई देते हैं।',
      hinglish: 'Workers Profile & Documents se Aadhaar aur/ya PAN upload karein. Upload ke baad verification review ke liye pending hota hai. Sirf admin-approved workers customer list mein dikhte hain.',
    },
    href: '/worker/profile',
    linkLabel: { en: 'Open worker profile', hi: 'वर्कर प्रोफ़ाइल खोलें', hinglish: 'Worker profile kholein' },
  },
  {
    id: 'arrival-code',
    questions: {
      en: ['what is the arrival code', 'where do i find the booking otp', 'worker has arrived', 'how to verify worker arrival', 'arrival code expired'],
      hi: ['अराइवल कोड क्या है', 'बुकिंग OTP कहां मिलेगा', 'वर्कर आ गया है', 'अराइवल कोड कैसे दें'],
      hinglish: ['arrival code kya hai', 'booking OTP kahan milega', 'worker aa gaya hai', 'arrival code kaise dein'],
    },
    answer: {
      en: 'For an accepted booking, generate the arrival code from its details and share it with the worker when they arrive. The worker must verify it before completing the job. The code expires after four hours.',
      hi: 'स्वीकृत बुकिंग के विवरण से अराइवल कोड बनाएं और वर्कर के आने पर उन्हें बताएं। काम पूरा करने से पहले वर्कर को यह कोड सत्यापित करना होगा। कोड चार घंटे बाद समाप्त हो जाता है।',
      hinglish: 'Accepted booking ki details se arrival code generate karein aur worker ke aane par share karein. Kaam complete karne se pehle worker ko code verify karna hoga. Code 4 ghante baad expire hota hai.',
    },
    href: '/my-bookings',
    linkLabel: { en: 'Open My Bookings', hi: 'मेरी बुकिंग खोलें', hinglish: 'My Bookings kholein' },
  },
  {
    id: 'review',
    questions: {
      en: ['how do i leave a review', 'rate the worker', 'submit feedback', 'give a rating', 'can i review a completed booking'],
      hi: ['वर्कर को रेटिंग कैसे दें', 'रिव्यू कैसे लिखें', 'सेवा पर प्रतिक्रिया कैसे दें'],
      hinglish: ['worker ko rating kaise dein', 'review kaise likhe', 'service ka feedback kaise dein'],
    },
    answer: {
      en: 'After a booking is marked completed, open it in My Bookings to submit a 1–5 star rating and optional written feedback. Only one review is allowed per booking.',
      hi: 'बुकिंग पूरी होने के बाद My Bookings में उसे खोलकर 1–5 स्टार रेटिंग और चाहें तो लिखित प्रतिक्रिया दें। हर बुकिंग पर एक ही रिव्यू दिया जा सकता है।',
      hinglish: 'Booking complete hone ke baad My Bookings mein kholkar 1–5 star rating aur chahein to written feedback dein. Har booking par ek hi review diya ja sakta hai.',
    },
    href: '/my-bookings',
    linkLabel: { en: 'Open My Bookings', hi: 'मेरी बुकिंग खोलें', hinglish: 'My Bookings kholein' },
  },
  {
    id: 'photos',
    questions: {
      en: ['can i upload photos', 'add a photo to booking', 'how to send problem pictures', 'solution photos', 'what image types are accepted'],
      hi: ['बुकिंग में फोटो कैसे भेजें', 'क्या समस्या की फोटो अपलोड कर सकते हैं', 'कौन सा फोटो फॉर्मेट मान्य है'],
      hinglish: ['booking mein photo kaise bheje', 'problem ki photo upload kar sakte hain', 'kaunsa photo format chalega'],
    },
    answer: {
      en: 'Customers can attach up to five problem photos (JPG, PNG, WebP, or GIF; up to 8 MB each) on the booking form. Workers can upload solution photos after verifying arrival for an accepted booking.',
      hi: 'ग्राहक बुकिंग फ़ॉर्म पर समस्या की अधिकतम 5 तस्वीरें जोड़ सकते हैं (JPG, PNG, WebP या GIF; हर फ़ाइल अधिकतम 8 MB)। स्वीकृत बुकिंग में आगमन सत्यापित होने के बाद वर्कर समाधान की तस्वीरें अपलोड कर सकते हैं।',
      hinglish: 'Customer booking form par problem ki maximum 5 photos add kar sakte hain (JPG, PNG, WebP ya GIF; har file 8 MB tak). Accepted booking mein arrival verify hone ke baad worker solution photos upload kar sakte hain.',
    },
    href: '/#workers-section',
    linkLabel: { en: 'Start a booking', hi: 'बुकिंग शुरू करें', hinglish: 'Booking shuru karein' },
  },
  {
    id: 'booking-rejected',
    questions: {
      en: ['worker rejected my booking', 'booking was rejected', 'what if no worker accepts', 'booking still pending', 'how long until booking is accepted'],
      hi: ['वर्कर ने बुकिंग अस्वीकार की', 'बुकिंग लंबित है', 'अगर वर्कर स्वीकार न करे तो क्या करें'],
      hinglish: ['worker ne booking reject kar di', 'booking pending hai', 'worker accept na kare to kya kare'],
    },
    answer: {
      en: 'Workers can accept or reject pending requests. Check My Bookings for the latest status. The portal does not specify an acceptance deadline or automatic reassignment process; you can browse and request another available worker.',
      hi: 'वर्कर लंबित अनुरोध स्वीकार या अस्वीकार कर सकते हैं। नई स्थिति के लिए My Bookings देखें। पोर्टल स्वीकृति की समय-सीमा या अपने-आप दूसरा वर्कर देने की प्रक्रिया नहीं बताता। आप किसी अन्य उपलब्ध वर्कर को चुनकर अनुरोध भेज सकते हैं।',
      hinglish: 'Worker pending request accept ya reject kar sakte hain. Latest status My Bookings mein dekhein. Portal acceptance deadline ya automatic doosra worker assign karne ki baat nahi batata. Aap kisi aur available worker ko request bhej sakte hain.',
    },
    href: '/my-bookings',
    linkLabel: { en: 'Check booking status', hi: 'बुकिंग स्थिति देखें', hinglish: 'Booking status dekhein' },
  },
  {
    id: 'booking-details',
    questions: {
      en: ['what details do i need to book', 'what information is required for booking', 'do i need to share my address', 'do i need to upload a photo', 'what should i enter in booking form'],
      hi: ['बुकिंग के लिए क्या जानकारी चाहिए', 'क्या पूरा पता देना जरूरी है', 'बुकिंग में कौन सी जानकारी भरें'],
      hinglish: ['booking ke liye kya details chahiye', 'poora address dena zaroori hai', 'booking form mein kya bhare'],
    },
    answer: {
      en: 'Choose a service, date and two-hour time slot, provide a complete service address, and allow current-location access to check the 50 km limit. You may also add instructions and up to five optional problem photos.',
      hi: 'सेवा, तारीख और दो घंटे का समय-स्लॉट चुनें। पूरा सेवा-पता दें और 50 किमी की सीमा जांचने के लिए वर्तमान लोकेशन की अनुमति दें। चाहें तो निर्देश और समस्या की अधिकतम 5 वैकल्पिक तस्वीरें भी जोड़ें।',
      hinglish: 'Service, date aur 2-hour time slot chunein. Poora service address dein aur 50 km limit check karne ke liye current location allow karein. Chahein to instructions aur maximum 5 problem photos bhi add karein.',
    },
    href: '/#workers-section',
    linkLabel: { en: 'Start a booking', hi: 'बुकिंग शुरू करें', hinglish: 'Booking shuru karein' },
  },
  {
    id: 'change-booking',
    questions: {
      en: ['change my booking date', 'edit booking details', 'reschedule my booking', 'change the time slot', 'modify my booking'],
      hi: ['बुकिंग की तारीख कैसे बदलें', 'बुकिंग का समय बदलना है', 'बुकिंग रीशेड्यूल कैसे करें'],
      hinglish: ['booking ki date kaise badle', 'booking ka time change karna hai', 'booking reschedule kaise kare'],
    },
    answer: {
      en: 'The portal does not provide a booking edit or reschedule action. Customers can cancel a booking while it is pending, then create a new request with the correct details. The portal does not specify refunds for cancellations.',
      hi: 'पोर्टल पर बुकिंग बदलने या रीशेड्यूल करने का विकल्प उपलब्ध नहीं है। ग्राहक लंबित बुकिंग रद्द करके सही जानकारी के साथ नया अनुरोध बना सकते हैं। रद्द करने पर रिफंड की जानकारी पोर्टल नहीं देता।',
      hinglish: 'Portal par booking edit ya reschedule ka option nahi hai. Pending booking cancel karke sahi details ke saath nayi request bhejein. Cancellation refund ki jaankari portal nahi deta.',
    },
    href: '/my-bookings',
    linkLabel: { en: 'Open My Bookings', hi: 'मेरी बुकिंग खोलें', hinglish: 'My Bookings kholein' },
  },
  {
    id: 'pricing-scope',
    questions: {
      en: ['are parts and materials included', 'is gst charged', 'extra work charges', 'how is the final quote calculated', 'does daily wage include materials'],
      hi: ['क्या पार्ट्स और सामग्री शामिल हैं', 'क्या GST लगता है', 'अतिरिक्त काम का शुल्क कितना है'],
      hinglish: ['parts aur material included hain', 'GST charge hota hai kya', 'extra work ka charge kitna hai'],
    },
    answer: {
      en: 'The portal shows each worker’s daily wage and a 20% urgent surcharge when selected. It does not specify taxes, parts/material costs, extra-work charges, or a separate quote process; confirm those details with the worker before booking.',
      hi: 'पोर्टल पर वर्कर की दैनिक दर और अर्जेंट चुनने पर 20% अतिरिक्त शुल्क दिखता है। टैक्स, पार्ट्स/सामग्री, अतिरिक्त काम या अलग कोटेशन की प्रक्रिया की जानकारी नहीं दी गई है; बुकिंग से पहले वर्कर से पुष्टि करें।',
      hinglish: 'Portal worker ki daily wage aur urgent chunne par 20% extra charge dikhata hai. Tax, parts/material, extra work ya alag quote process specify nahi hai; booking se pehle worker se confirm karein.',
    },
  },
  {
    id: 'delete-account',
    questions: {
      en: ['delete my account', 'close my account', 'remove my personal data', 'deactivate my account'],
      hi: ['मेरा खाता कैसे हटाएं', 'अकाउंट बंद कैसे करें', 'मेरी जानकारी मिटाएं'],
      hinglish: ['account delete kaise kare', 'account band karna hai', 'meri details hata do'],
    },
    answer: {
      en: 'The portal does not provide an account deletion control or publish an account-deletion process. I can’t confirm deletion from this chat.',
      hi: 'पोर्टल पर खाता हटाने का विकल्प या प्रकाशित प्रक्रिया उपलब्ध नहीं है। इस चैट से खाता हटाने की पुष्टि नहीं की जा सकती।',
      hinglish: 'Portal par account delete karne ka option ya process listed nahi hai. Is chat se account delete hone ki pushti nahi kar sakta.',
    },
  },
  {
    id: 'support',
    questions: {
      en: ['how can i contact support', 'customer care phone number', 'contact customer service', 'talk to a person', 'complaint or dispute', 'report a problem'],
      hi: ['सहायता से कैसे संपर्क करें', 'कस्टमर केयर नंबर क्या है', 'शिकायत कैसे करें', 'किसी व्यक्ति से बात करनी है'],
      hinglish: ['support se contact kaise kare', 'customer care number kya hai', 'complaint kaise kare', 'kisi person se baat karni hai'],
    },
    answer: {
      en: 'I can’t find a published support phone number or complaint channel in the portal. Check the booking details and notifications for updates; I won’t invent contact details.',
      hi: 'पोर्टल पर प्रकाशित सहायता फ़ोन नंबर या शिकायत चैनल उपलब्ध नहीं है। अपडेट के लिए बुकिंग विवरण और नोटिफ़िकेशन देखें। मैं संपर्क जानकारी बनाकर नहीं बताऊंगा।',
      hinglish: 'Portal par support phone number ya complaint channel listed nahi hai. Updates ke liye booking details aur notifications dekhein. Main contact details bana kar nahi bataunga.',
    },
  },
  {
    id: 'worker-bookings',
    questions: {
      en: ['how do i accept a job', 'worker bookings page', 'manage my jobs', 'worker earnings and payout', 'how do workers get paid'],
      hi: ['वर्कर बुकिंग कैसे स्वीकार करें', 'अपने जॉब कैसे देखें', 'वर्कर को भुगतान कैसे मिलता है'],
      hinglish: ['worker booking accept kaise kare', 'apne jobs kaise dekhein', 'worker ko payment kaise milta hai'],
    },
    answer: {
      en: 'Workers can open Bookings after signing in to review pending requests and accept or reject them. The portal does not describe a separate worker payout or earnings workflow.',
      hi: 'वर्कर साइन इन करके Bookings में लंबित अनुरोध देख और स्वीकार या अस्वीकार कर सकते हैं। पोर्टल वर्कर के लिए अलग भुगतान या कमाई निकालने की प्रक्रिया नहीं बताता।',
      hinglish: 'Worker sign in karke Bookings mein pending requests dekhkar accept ya reject kar sakte hain. Portal worker payout ya earnings withdraw karne ka alag process nahi batata.',
    },
    href: '/worker/bookings',
    linkLabel: { en: 'Open worker bookings', hi: 'वर्कर बुकिंग खोलें', hinglish: 'Worker Bookings kholein' },
  },
];

export const QUICK_QUESTIONS: Record<ChatLanguage, string[]> = {
  en: ['How do I book a worker?', 'How much does a booking cost?', 'Can I pay cash?', 'How do I cancel a booking?'],
  hi: ['वर्कर कैसे बुक करें?', 'बुकिंग का खर्च कितना है?', 'क्या नकद भुगतान कर सकते हैं?', 'बुकिंग कैसे रद्द करें?'],
  hinglish: ['Worker kaise book karu?', 'Booking ka kharcha kitna hai?', 'Cash de sakte hain?', 'Booking cancel kaise kare?'],
};

export const CHAT_COPY: Record<ChatLanguage, { greeting: string; fallback: string; placeholder: string; popular: string; languageName: string }> = {
  en: {
    greeting: 'Hi! Ask about bookings, services, payments, or your account. I answer from portal information and won’t guess about unspecified policies. Please do not share passwords or payment details.',
    fallback: 'I could not find a verified answer to that question in the portal information. Try asking about booking, services, price, payment, refunds, cancellation, login, or worker registration. I will not guess about policies the portal does not specify.',
    placeholder: 'Ask in English, हिंदी, or Hinglish…',
    popular: 'Popular questions',
    languageName: 'English',
  },
  hi: {
    greeting: 'नमस्ते! बुकिंग, सेवाओं, भुगतान या खाते के बारे में पूछें। जवाब पोर्टल की जानकारी पर आधारित हैं; अज्ञात नियमों के बारे में मैं अनुमान नहीं लगाऊंगा। कृपया पासवर्ड या भुगतान विवरण साझा न करें।',
    fallback: 'पोर्टल की जानकारी में इस सवाल का सत्यापित जवाब नहीं मिला। बुकिंग, सेवा, कीमत, भुगतान, रिफंड, रद्द करने, लॉगिन या वर्कर रजिस्ट्रेशन के बारे में पूछें। अनजान नियमों का मैं अनुमान नहीं लगाऊंगा।',
    placeholder: 'हिंदी में अपना सवाल लिखें…',
    popular: 'अक्सर पूछे जाने वाले सवाल',
    languageName: 'हिंदी',
  },
  hinglish: {
    greeting: 'Namaste! Booking, service, payment ya account ke baare mein poochhein. Jawab portal ki jaankari par based hain; main anjaan policies ka guess nahi karunga. Password ya payment details share na karein.',
    fallback: 'Portal ki verified jaankari mein is sawal ka jawab nahi mila. Booking, service, price, payment, refund, cancellation, login ya worker registration ke baare mein poochhein. Main anjaan policies ka guess nahi karunga.',
    placeholder: 'Hindi, English ya Hinglish mein poochhein…',
    popular: 'Aksar poochhe jaane wale sawal',
    languageName: 'Hinglish',
  },
};

export const detectLanguage = (text: string): ChatLanguage => {
  if (/[\u0900-\u097f]/u.test(text)) return 'hi';

  const romanHindiMarkers = /\b(?:aap|apka|apki|apne|kaise|kya|hai|hain|karu|kare|karo|karna|chahiye|mujhe|mera|meri|mere|ka|ki|ke|nahi|nahin|kaun|kitna|kitni|kab|kahan|kyun|kyu|paise|paisa|bheje|dekhein|milta|milega|sakte|sakti|sakta|raha|rahi|gaya|gayi|ho|hoga|hogi|kijiye|karein|kaisa|kaisi|batao|bataiye|chalega|konsa|kaunsa|kar sakte)\b/i;
  return romanHindiMarkers.test(text) ? 'hinglish' : 'en';
};

export const normalizeQuestion = (value: string) =>
  value.toLocaleLowerCase().normalize('NFC')
    .replace(/(^|\s)a(?=(?:payment|booking|worker|account|service)\b)/g, '$1')
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => ({
      kre: 'kare',
      krke: 'karke',
      kr: 'kar',
      kro: 'karo',
      krna: 'karna',
      krni: 'karni',
      krne: 'karne',
      krta: 'karta',
      krti: 'karti',
      krte: 'karte',
      krwaya: 'karwaya',
      kru: 'karu',
      krun: 'karun',
      kse: 'kaise',
      kese: 'kaise',
      kesa: 'kaisa',
      kesi: 'kaisi',
      payed: 'paid',
      picturs: 'photo',
      pictues: 'photo',
      pictue: 'photo',
      bokking: 'booking',
      bookng: 'booking',
      bookin: 'booking',
      paymnt: 'payment',
      paymant: 'payment',
      paymet: 'payment',
      paymnet: 'payment',
      woker: 'worker',
      plz: 'please',
      pls: 'please',
      bk: 'book',
      wrker: 'worker',
      workers: 'worker',
      services: 'service',
      bookings: 'booking',
      payments: 'payment',
      prices: 'price',
      charges: 'charge',
      slots: 'slot',
      timings: 'timing',
      docs: 'documents',
      document: 'documents',
      details: 'detail',
    }[word] || word))
    .join(' ')
    .trim();

const SERVICE_ALIASES: Record<string, string[]> = {
  plumbing: ['plumbing', 'plumber', 'pipe', 'tap', 'leak', 'नल', 'प्लंबर', 'plumber'],
  electrical: ['electrical', 'electrician', 'electric', 'wiring', 'light', 'switch', 'इलेक्ट्रिशियन', 'बिजली'],
  cleaning: ['cleaning', 'cleaner', 'clean', 'housekeeping', 'safai', 'सफाई', 'क्लीनिंग'],
  painting: ['painting', 'painter', 'paint', 'wall', 'पेंटिंग', 'पेंटर'],
  carpentry: ['carpentry', 'carpenter', 'furniture', 'wood', 'बढ़ई', 'बढ़ईगीरी'],
  'appliance repair': ['appliance', 'repair', 'ac repair', 'ac', 'washing machine', 'fridge', 'उपकरण मरम्मत'],
  gardening: ['gardening', 'gardener', 'garden', 'lawn', 'बागवानी'],
  masonry: ['masonry', 'mason', 'brick', 'plaster', 'राजमिस्त्री'],
  welding: ['welding', 'welder', 'वेल्डिंग'],
};

const CITY_ALIASES: Record<string, string[]> = {
  Bangalore: ['bangalore', 'bengaluru', 'बैंगलोर', 'बेंगलुरु'],
  Mumbai: ['mumbai', 'मुंबई'],
  'Delhi NCR': ['delhi ncr', 'delhi', 'दिल्ली', 'दिल्ली ncr'],
  Hyderabad: ['hyderabad', 'हैदराबाद'],
  Pune: ['pune', 'पुणे'],
};

type MarketplaceIntent = 'service-count' | 'service-list' | 'experience' | 'availability' | 'rates';

const getMarketplaceIntent = (question: string): MarketplaceIntent | null => {
  const normalized = normalizeQuestion(question);
  const tokens = new Set(getContentTokens(normalized));
  const asksServiceCount =
    /\b(how many|number of|count of|total)\b/.test(normalized) &&
    /\b(service|services|service category|service categories|category|categories|skill|skills)\b/.test(normalized) ||
    /कितनी.*सेव|कितने.*सर्विस|कितनी.*सर्विस|कितने.*सेवा/.test(normalized) ||
    /\b(kitni|kitne|total|number)\b/.test(normalized) && /\b(service|services|servic)\b/.test(normalized);

  if (asksServiceCount) return 'service-count';

  const asksServiceList =
    /\b(list|show|all|which|what|available|offer|provide)\b/.test(normalized) &&
    /\b(service|services|skill|skills|category|categories)\b/.test(normalized) ||
    /कौन सी सेव|कौन कौन सी|सभी सेव|कौन सी सर्विस/.test(normalized) ||
    /\b(kaunsi|kaun kaun si|sabhi)\b/.test(normalized) && /\b(service|services|servic)\b/.test(normalized);
  if (asksServiceList) return 'service-list';

  const asksExperience =
    /\b(most experienced|more experienced|experience|experienced|senior|years of experience)\b/.test(normalized) ||
    /सबसे अनुभवी|ज्यादा अनुभवी|अनुभव कित|कितना अनुभव|अधिक अनुभव/.test(normalized) ||
    /\b(experienced|experience|anubhavi|tajurba|tajurbekar)\b/.test(normalized);
  if (asksExperience) return 'experience';

  const asksRates =
    /\b(price|prices|cost|costs|rate|rates|charge|charges|wage|salary|individual|per worker|how much|kitna|kitne paise)\b/.test(normalized) ||
    /कितना खर्च|क्या कीमत|दर कित|कितनी मजदूरी|कितना पैसा|चार्ज|शुल्क|दाम|कीमत|रेट|मजदूरी/.test(normalized) ||
    /\b(kitna|kitne|rate|rates|charge|charges|paisa|paise|wage)\b/.test(normalized);
  if (asksRates) return 'rates';

  const hasServiceFilter = Object.values(SERVICE_ALIASES)
    .some((aliases) => aliases.some((alias) => normalized.includes(normalizeQuestion(alias))));
  const asksAvailability =
    /\b(who is available|who are available|available worker|workers available|availability|find me|need a|looking for|show me|near me)\b/.test(normalized) ||
    /कौन.*(उपलब्ध|मिलेगा|मिलेंगे|मिले)|वर्कर.*उपलब्ध|वर्कर चाहिए|मुझे .* चाहिए|उपलब्ध वर्कर/.test(normalized) ||
    /\b(available|milega|milegi|milenge|chahiye|available hai|kaun milega)\b/.test(normalized);
  if (asksAvailability || hasServiceFilter) return 'availability';

  if (tokens.has('service') || tokens.has('services')) return 'service-list';
  return null;
};

export const isLiveMarketplaceQuestion = (question: string): boolean =>
  getMarketplaceIntent(question) !== null;

const getWorkerSkills = (worker: WorkerProfile): string[] =>
  (Array.isArray(worker.skills) ? worker.skills : [])
    .map((skill) => skill.trim())
    .filter(Boolean);

const getWorkerName = (worker: WorkerProfile): string => {
  if (worker.userId && typeof worker.userId === 'object' && 'name' in worker.userId && worker.userId.name) {
    return worker.userId.name;
  }
  if (worker.name) return worker.name;
  return 'Worker';
};

const getWorkerCity = (worker: WorkerProfile): string =>
  [worker.city, worker.state].filter(Boolean).join(', ');

const formatWorkerRate = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const getServiceFilter = (question: string): string | null => {
  const normalized = normalizeQuestion(question);
  for (const [service, aliases] of Object.entries(SERVICE_ALIASES)) {
    if (aliases.some((alias) => normalized.includes(normalizeQuestion(alias)))) return service;
  }
  return null;
};

const getCityFilter = (question: string): string | null => {
  const normalized = normalizeQuestion(question);
  return Object.entries(CITY_ALIASES)
    .find(([, aliases]) => aliases.some((alias) => normalized.includes(normalizeQuestion(alias))))?.[0] || null;
};

const containsService = (worker: WorkerProfile, service: string | null): boolean => {
  if (!service) return true;
  const skills = getWorkerSkills(worker).map(normalizeQuestion);
  const aliases = SERVICE_ALIASES[service].map(normalizeQuestion);
  return skills.some((skill) =>
    aliases.some((alias) => skill.includes(alias) || alias.includes(skill)) ||
    skill.includes(service) || service.includes(skill));
};

const containsCity = (worker: WorkerProfile, city: string | null): boolean => {
  if (!city) return true;
  const workerLocation = normalizeQuestion(`${worker.city || ''} ${worker.state || ''}`);
  return CITY_ALIASES[city].some((alias) => workerLocation.includes(normalizeQuestion(alias)));
};

const formatWorker = (worker: WorkerProfile, language: ChatLanguage): string => {
  const skills = getWorkerSkills(worker).join(', ');
  const city = getWorkerCity(worker);
  const hasRate = Number.isFinite(Number(worker.dailyWage)) && Number(worker.dailyWage) > 0;
  const wage = hasRate ? formatWorkerRate(Number(worker.dailyWage)) : null;
  const experience = Number(worker.experience) || 0;
  if (language === 'hi') {
    return `${getWorkerName(worker)} — ${skills || 'सेवा निर्दिष्ट नहीं'}${city ? `, ${city}` : ''}; ${experience} वर्ष का अनुभव; ${wage ? `${wage}/दिन` : 'दर उपलब्ध नहीं'}`;
  }
  if (language === 'hinglish') {
    return `${getWorkerName(worker)} — ${skills || 'service specify nahi'}${city ? `, ${city}` : ''}; ${experience} saal experience; ${wage ? `${wage}/day` : 'rate listed nahi'}`;
  }
  return `${getWorkerName(worker)} — ${skills || 'service not specified'}${city ? `, ${city}` : ''}; ${experience} years’ experience; ${wage ? `${wage}/day` : 'rate not listed'}`;
};

export const getMarketplaceAnswer = (
  question: string,
  workers: WorkerProfile[],
): LocalizedText | null => {
  const intent = getMarketplaceIntent(question);
  if (!intent) return null;

  const language = detectLanguage(question);
  const listedWorkers = workers.filter((worker) => worker.verificationStatus === 'approved');
  const workersWithRates = listedWorkers.filter((worker) =>
    Number.isFinite(Number(worker.dailyWage)) && Number(worker.dailyWage) > 0);
  const service = getServiceFilter(question);
  const city = getCityFilter(question);
  const matchedWorkers = listedWorkers.filter((worker) =>
    containsService(worker, service) && containsCity(worker, city));
  const matchedWorkersWithRates = workersWithRates.filter((worker) =>
    containsService(worker, service) && containsCity(worker, city));
  const displayWorkers = (workerList: WorkerProfile[]) =>
    workerList.slice(0, 5).map((worker) => formatWorker(worker, language)).join('\n');
  const hasMore = (count: number) => count > 5 ? (language === 'hi' ? '\nऔर वर्कर देखने के लिए सूची खोलें।' : language === 'hinglish' ? '\nAur workers ke liye listing dekhein.' : '\nOpen the listing to see more workers.') : '';

  if (intent === 'service-count' || intent === 'service-list') {
    const skillMap = new Map<string, string>();
    listedWorkers.flatMap(getWorkerSkills)
      .map((skill) => skill.trim())
      .filter(Boolean)
      .forEach((skill) => {
        const key = normalizeQuestion(skill);
        if (!skillMap.has(key)) skillMap.set(key, skill);
      });
    const skills = [...skillMap.values()];
    const skillList = skills.length ? skills.join(', ') : '';
    const count = skills.length;
    return {
      en: `The portal has 7 main service categories: Plumbing, Electrical, Cleaning, Painting, Carpentry, Appliance Repair, and Gardening. Among currently approved workers, ${count} distinct skill${count === 1 ? ' is' : 's are'} listed${skillList ? `: ${skillList}.` : '.'} This reflects worker profiles currently returned by the marketplace.`,
      hi: `पोर्टल पर 7 मुख्य सेवा श्रेणियां हैं: प्लंबिंग, इलेक्ट्रिकल, सफाई, पेंटिंग, बढ़ईगीरी, उपकरण मरम्मत और बागवानी। अभी स्वीकृत वर्कर प्रोफ़ाइल में ${count} अलग-अलग कौशल सूचीबद्ध हैं${skillList ? `: ${skillList}.` : '।'} यह मार्केटप्लेस में उपलब्ध वर्तमान प्रोफ़ाइल पर आधारित है।`,
      hinglish: `Portal par 7 main service categories hain: Plumbing, Electrical, Cleaning, Painting, Carpentry, Appliance Repair aur Gardening. Abhi approved workers ki profiles mein ${count} alag skills listed hain${skillList ? `: ${skillList}.` : '.'} Yeh marketplace mein currently listed profiles par based hai.`,
    };
  }

  if (intent === 'experience') {
    if (matchedWorkers.length === 0) {
      return {
        en: service ? `No approved worker profiles matching ${service} are currently listed. Try browsing all workers or another service.` : 'No approved worker profiles are currently listed.',
        hi: service ? `${service} के लिए कोई स्वीकृत वर्कर प्रोफ़ाइल अभी सूचीबद्ध नहीं है। सभी वर्कर या दूसरी सेवा देखें।` : 'अभी कोई स्वीकृत वर्कर प्रोफ़ाइल सूचीबद्ध नहीं है।',
        hinglish: service ? `${service} ke liye abhi koi approved worker profile listed nahi hai. Sabhi workers ya doosri service dekhein.` : 'Abhi koi approved worker profile listed nahi hai.',
      };
    }
    const sorted = [...matchedWorkers].sort((first, second) =>
      Number(second.experience) - Number(first.experience));
    const topExperience = Number(sorted[0].experience) || 0;
    const topWorkers = sorted.filter((worker) => (Number(worker.experience) || 0) === topExperience);
    return {
      en: `Among currently approved${service ? ` ${service}` : ''} workers, the highest listed experience is ${topExperience} years. ${displayWorkers(topWorkers)}${hasMore(topWorkers.length)} These are experience figures on profiles, not an independent verification of work history.`,
      hi: `अभी स्वीकृत${service ? ` ${service}` : ''} वर्कर में सबसे अधिक दर्ज अनुभव ${topExperience} वर्ष है। ${displayWorkers(topWorkers)}${hasMore(topWorkers.length)} यह प्रोफ़ाइल में दर्ज अनुभव है; कार्य इतिहास की अलग पुष्टि नहीं।`,
      hinglish: `Abhi approved${service ? ` ${service}` : ''} workers mein sabse zyada listed experience ${topExperience} saal hai. ${displayWorkers(topWorkers)}${hasMore(topWorkers.length)} Yeh profile par diya experience hai; work history ki alag verification nahi.`,
    };
  }

  if (intent === 'rates') {
    if (matchedWorkersWithRates.length === 0) {
      return {
        en: service ? `No approved worker profiles for ${service} with a listed daily rate are currently available.` : 'No approved worker profiles with a listed daily rate are currently available.',
        hi: service ? `${service} के लिए दैनिक दर वाली कोई स्वीकृत वर्कर प्रोफ़ाइल अभी उपलब्ध नहीं है।` : 'दैनिक दर वाली कोई स्वीकृत वर्कर प्रोफ़ाइल अभी उपलब्ध नहीं है।',
        hinglish: service ? `${service} ke liye listed daily rate wali approved worker profile abhi available nahi hai.` : 'Listed daily rate wali approved worker profile abhi available nahi hai.',
      };
    }
    const sorted = [...matchedWorkersWithRates].sort((first, second) =>
      Number(first.dailyWage) - Number(second.dailyWage));
    return {
      en: `Current listed daily rates${service ? ` for ${service}` : ''} (set individually by workers):\n${displayWorkers(sorted)}${hasMore(sorted.length)} Urgent bookings add 20% to the selected worker’s daily wage. Materials, taxes, and extra-work charges are not specified by the portal.`,
      hi: `${service ? `${service} के ` : ''}अभी सूचीबद्ध दैनिक दरें (हर वर्कर अपनी दर तय करता है):\n${displayWorkers(sorted)}${hasMore(sorted.length)} अर्जेंट बुकिंग में चुने गए वर्कर की दैनिक दर पर 20% जुड़ता है। सामग्री, टैक्स और अतिरिक्त काम के शुल्क पोर्टल पर निर्दिष्ट नहीं हैं।`,
      hinglish: `${service ? `${service} ke ` : ''}abhi listed daily rates (har worker apna rate set karta hai):\n${displayWorkers(sorted)}${hasMore(sorted.length)} Urgent booking mein selected worker ki daily wage par 20% add hota hai. Material, tax aur extra-work charges portal par specify nahi hain.`,
    };
  }

  if (matchedWorkers.length === 0) {
    return {
      en: service ? `No approved worker profiles matching ${service} are currently listed. Browse another service or check again later.` : 'No approved worker profiles are currently listed. Please check again later.',
      hi: service ? `${service} से मेल खाने वाले स्वीकृत वर्कर अभी सूचीबद्ध नहीं हैं। दूसरी सेवा देखें या बाद में फिर जांचें।` : 'अभी कोई स्वीकृत वर्कर सूचीबद्ध नहीं है। बाद में फिर जांचें।',
      hinglish: service ? `${service} se match karne wale approved workers abhi listed nahi hain. Doosri service dekhein ya baad mein check karein.` : 'Abhi koi approved worker listed nahi hai. Baad mein check karein.',
    };
  }

  const sorted = [...matchedWorkers].sort((first, second) =>
    Number(second.averageRating) - Number(first.averageRating) ||
    Number(second.reviewCount) - Number(first.reviewCount) ||
    Number(second.experience) - Number(first.experience));
  return {
    en: `These ${service ? `approved ${service} ` : ''}workers are currently listed and can receive booking requests:\n${displayWorkers(sorted)}${hasMore(sorted.length)} “Listed” does not confirm a free time slot; submit a booking request to check with the worker.`,
    hi: `ये ${service ? `स्वीकृत ${service} ` : 'स्वीकृत '}वर्कर अभी सूचीबद्ध हैं और बुकिंग अनुरोध प्राप्त कर सकते हैं:\n${displayWorkers(sorted)}${hasMore(sorted.length)} “सूचीबद्ध” होने का अर्थ किसी खास समय पर खाली होना नहीं है; समय की पुष्टि के लिए बुकिंग अनुरोध भेजें।`,
    hinglish: `Yeh ${service ? `approved ${service} ` : 'approved '}workers abhi listed hain aur booking requests le sakte hain:\n${displayWorkers(sorted)}${hasMore(sorted.length)} “Listed” hone ka matlab kisi specific time par free hona confirm nahi hai; time confirm karne ke liye booking request bhejein.`,
  };
};

const MATCHING_STOP_WORDS = new Set([
  'a', 'an', 'the', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'do', 'does', 'did',
  'can', 'could', 'would', 'will', 'should', 'is', 'are', 'was', 'were', 'be', 'been',
  'to', 'for', 'of', 'in', 'on', 'at', 'with', 'from', 'and', 'or', 'please', 'pls',
  'how', 'what', 'when', 'where', 'who', 'why', 'which', 'tell', 'show', 'me', 'about',
  'mujhe', 'mera', 'meri', 'mere', 'aap', 'apka', 'apki', 'ka', 'ki', 'ke', 'hai', 'hain',
  'kya', 'kaise', 'kese', 'karu', 'kare', 'karo', 'karna', 'karni', 'karne', 'karun',
  'chahiye', 'sakta', 'sakti', 'sakte', 'please', 'plz', 'batao', 'bataiye',
]);

const TOKEN_ALIASES: Record<string, string> = {
  booked: 'book',
  booking: 'book',
  bookings: 'book',
  book: 'book',
  hire: 'book',
  hiring: 'book',
  pay: 'pay',
  paid: 'pay',
  paying: 'pay',
  payment: 'pay',
  payments: 'pay',
  cost: 'price',
  costs: 'price',
  pricing: 'price',
  charges: 'price',
  charge: 'price',
  fee: 'price',
  fees: 'price',
  worker: 'worker',
  workers: 'worker',
  professional: 'worker',
  professionals: 'worker',
  pro: 'worker',
  pros: 'worker',
  labour: 'worker',
  labor: 'worker',
  labourer: 'worker',
  laborer: 'worker',
  cancel: 'cancel',
  canceled: 'cancel',
  cancelled: 'cancel',
  cancellation: 'cancel',
  reschedule: 'reschedule',
  rescheduling: 'reschedule',
  refund: 'refund',
  refunded: 'refund',
  refunds: 'refund',
  reset: 'reset',
  resetting: 'reset',
  login: 'login',
  signin: 'login',
  sign: 'sign',
  signup: 'register',
  registration: 'register',
  register: 'register',
  registeration: 'register',
  services: 'service',
  service: 'service',
  slots: 'slot',
  timings: 'time',
  timing: 'time',
  time: 'time',
  dates: 'date',
  photos: 'photo',
  pictures: 'photo',
  picture: 'photo',
  image: 'photo',
  images: 'photo',
  documents: 'document',
  document: 'document',
  docs: 'document',
  verified: 'verify',
  verification: 'verify',
  verify: 'verify',
  rejected: 'reject',
  rejectedly: 'reject',
  accepted: 'accept',
  accepting: 'accept',
};

const canonicalToken = (token: string) => {
  if (TOKEN_ALIASES[token]) return TOKEN_ALIASES[token];
  if (token.length > 5 && token.endsWith('s')) return token.slice(0, -1);
  return token;
};

const editDistanceAtMostOne = (first: string, second: string): boolean => {
  if (first === second) return true;
  if (Math.abs(first.length - second.length) > 1 || Math.min(first.length, second.length) < 5) {
    return false;
  }

  if (first.length === second.length) {
    const mismatchIndex = [...first].findIndex((character, index) => character !== second[index]);
    if (
      mismatchIndex >= 0 &&
      first[mismatchIndex] === second[mismatchIndex + 1] &&
      first[mismatchIndex + 1] === second[mismatchIndex] &&
      first.slice(mismatchIndex + 2) === second.slice(mismatchIndex + 2)
    ) {
      return true;
    }
  }

  let firstIndex = 0;
  let secondIndex = 0;
  let edits = 0;

  while (firstIndex < first.length && secondIndex < second.length) {
    if (first[firstIndex] === second[secondIndex]) {
      firstIndex += 1;
      secondIndex += 1;
      continue;
    }

    edits += 1;
    if (edits > 1) return false;
    if (first.length > second.length) firstIndex += 1;
    else if (second.length > first.length) secondIndex += 1;
    else {
      firstIndex += 1;
      secondIndex += 1;
    }
  }

  return edits + (firstIndex < first.length || secondIndex < second.length ? 1 : 0) <= 1;
};

const tokenMatches = (queryToken: string, targetToken: string): boolean => {
  const query = canonicalToken(queryToken);
  const target = canonicalToken(targetToken);
  return query === target ||
    editDistanceAtMostOne(queryToken, targetToken) ||
    editDistanceAtMostOne(query, target);
};

const getContentTokens = (value: string): string[] =>
  normalizeQuestion(value)
    .split(' ')
    .filter((token) => token.length > 1 && !MATCHING_STOP_WORDS.has(token));

const phraseMatchScore = (queryTokens: string[], phrase: string): number => {
  const phraseTokens = getContentTokens(phrase);
  if (phraseTokens.length === 0) return 0;
  const queryContentTokens = getContentTokens(queryTokens.join(' '));
  if (phraseTokens.length === 1 && queryContentTokens.length !== 1) return 0;

  const matchingCount = phraseTokens.filter((phraseToken) =>
    queryTokens.some((queryToken) => tokenMatches(queryToken, phraseToken))).length;

  if (matchingCount !== phraseTokens.length) return 0;
  return 4 + Math.min(phraseTokens.length, 5) * 2;
};

export const findAnswers = (question: string): HelpAnswer[] => {
  const normalizedQuestion = normalizeQuestion(question);
  if (!normalizedQuestion) return [];

  const language = detectLanguage(question);
  const queryTokens = normalizedQuestion.split(' ');
  const ranked = HELP_ANSWERS.map((entry) => {
    const questionPhrases = Object.values(entry.questions)
      .flat()
      .map((phrase) => normalizeQuestion(phrase));
    const exactPhraseScore = questionPhrases.reduce((score, phrase) => {
      const isExact = normalizedQuestion === phrase ||
        ` ${normalizedQuestion} `.includes(` ${phrase} `);
      return isExact ? Math.max(score, 30 + Math.min(phrase.length / 30, 2)) : score;
    }, 0);
    const semanticPhraseScore = questionPhrases.reduce(
      (score, phrase) => Math.max(score, phraseMatchScore(queryTokens, phrase)),
      0,
    );
    const keywordScore = (entry.keywords || []).reduce((score, group) => {
      const groupTokens = group.flatMap((keyword) =>
        normalizeQuestion(keyword).split(' ').map(canonicalToken));
      return groupTokens.every((keyword) =>
        queryTokens.some((queryToken) => tokenMatches(queryToken, keyword)))
        ? Math.max(score, 10 + groupTokens.length * 2)
        : score;
    }, 0);
    const languageBoost = entry.questions[language]
      .map(normalizeQuestion)
      .some((phrase) => normalizedQuestion === phrase ||
        ` ${normalizedQuestion} `.includes(` ${phrase} `)) ? 2 : 0;
    return {
      entry,
      score: Math.max(exactPhraseScore, semanticPhraseScore, keywordScore) + languageBoost,
    };
  })
    .filter(({ score }) => score > 0)
    .sort((first, second) => second.score - first.score);

  if (!ranked.length) return [];
  const answers = [ranked[0]];
  if (ranked[1] && ranked[1].score >= 10 && ranked[1].score >= ranked[0].score * 0.8) {
    answers.push(ranked[1]);
  }
  return answers.map(({ entry }) => entry);
};
