// Multi-language support for AnnaDaan

export type Language = "en" | "hi" | "mr";

export const languages: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  mr: "मराठी",
};

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    "app.name": "AnnaDaan",
    "app.tagline": "Reducing food waste, one meal at a time",
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.submit": "Submit",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.download": "Download",
    "common.share": "Share",
    "common.close": "Close",
    "common.success": "Success",
    "common.error": "Error",
    "common.confirm": "Confirm",
    
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.listings": "Listings",
    "nav.donations": "Donations",
    "nav.impact": "Impact Report",
    "nav.carbon": "Carbon Credits",
    "nav.notifications": "Notifications",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    
    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.activeListings": "Active Listings",
    "dashboard.pendingBids": "Pending Bids",
    "dashboard.carbonCredits": "Carbon Credits",
    "dashboard.foodDonated": "Food Donated",
    "dashboard.mealsProvided": "Meals Provided",
    "dashboard.co2Saved": "CO2 Saved",
    "dashboard.treesEquivalent": "Trees Equivalent",
    
    // Donor
    "donor.postListing": "Post New Listing",
    "donor.reviewBids": "Review Bids",
    "donor.yourImpact": "Your Impact",
    "donor.recentListings": "Recent Listings",
    "donor.quickActions": "Quick Actions",
    
    // NGO
    "ngo.findFood": "Find Food",
    "ngo.postRequirement": "Post Requirement",
    "ngo.activeRequirements": "Active Requirements",
    "ngo.matchedListings": "Matched Listings",
    "ngo.mealsDistributed": "Meals Distributed",
    "ngo.beneficiariesServed": "Beneficiaries Served",
    
    // Collector
    "collector.startRoute": "Start Route",
    "collector.availablePickups": "Available Pickups",
    "collector.pickupsToday": "Pickups Today",
    "collector.kgCollected": "Kg Collected",
    "collector.portionsDistributed": "Portions Distributed",
    "collector.biogasDelivered": "Biogas Delivered",
    
    // Map
    "map.viewMap": "View Map",
    "map.getDirections": "Get Directions",
    "map.nearbyLocations": "Nearby Locations",
    "map.routeOptimization": "Route Optimization",
    
    // QR Code
    "qr.scanCode": "Scan QR Code",
    "qr.generateCode": "Generate QR Code",
    "qr.shareViaWhatsApp": "Share via WhatsApp",
    "qr.downloadQR": "Download QR Code",
    
    // Notifications
    "notifications.title": "Notifications",
    "notifications.markAllRead": "Mark all as read",
    "notifications.noNotifications": "No notifications",
  },
  
  hi: {
    // Common
    "app.name": "अन्नदान",
    "app.tagline": "भोजन की बर्बादी कम करना, एक समय में एक भोजन",
    "common.loading": "लोड हो रहा है...",
    "common.save": "सहेजें",
    "common.cancel": "रद्द करें",
    "common.submit": "जमा करें",
    "common.delete": "हटाएं",
    "common.edit": "संपादित करें",
    "common.view": "देखें",
    "common.search": "खोजें",
    "common.filter": "फ़िल्टर",
    "common.download": "डाउनलोड",
    "common.share": "साझा करें",
    "common.close": "बंद करें",
    "common.success": "सफल",
    "common.error": "त्रुटि",
    "common.confirm": "पुष्टि करें",
    
    // Navigation
    "nav.dashboard": "डैशबोर्ड",
    "nav.listings": "सूचियाँ",
    "nav.donations": "दान",
    "nav.impact": "प्रभाव रिपोर्ट",
    "nav.carbon": "कार्बन क्रेडिट",
    "nav.notifications": "सूचनाएं",
    "nav.settings": "सेटिंग्स",
    "nav.logout": "लॉग आउट",
    
    // Dashboard
    "dashboard.welcome": "वापसी पर स्वागत है",
    "dashboard.activeListings": "सक्रिय सूचियाँ",
    "dashboard.pendingBids": "लंबित बोलियाँ",
    "dashboard.carbonCredits": "कार्बन क्रेडिट",
    "dashboard.foodDonated": "दान किया गया भोजन",
    "dashboard.mealsProvided": "प्रदान किए गए भोजन",
    "dashboard.co2Saved": "CO2 बचाया गया",
    "dashboard.treesEquivalent": "पेड़ों के बराबर",
    
    // Donor
    "donor.postListing": "नई सूची पोस्ट करें",
    "donor.reviewBids": "बोलियों की समीक्षा करें",
    "donor.yourImpact": "आपका प्रभाव",
    "donor.recentListings": "हाल की सूचियाँ",
    "donor.quickActions": "त्वरित कार्य",
    
    // NGO
    "ngo.findFood": "भोजन खोजें",
    "ngo.postRequirement": "आवश्यकता पोस्ट करें",
    "ngo.activeRequirements": "सक्रिय आवश्यकताएं",
    "ngo.matchedListings": "मिलान सूचियाँ",
    "ngo.mealsDistributed": "वितरित भोजन",
    "ngo.beneficiariesServed": "लाभार्थियों की सेवा",
    
    // Collector
    "collector.startRoute": "मार्ग शुरू करें",
    "collector.availablePickups": "उपलब्ध पिकअप",
    "collector.pickupsToday": "आज के पिकअप",
    "collector.kgCollected": "किलो एकत्र",
    "collector.portionsDistributed": "वितरित भाग",
    "collector.biogasDelivered": "बायोगैस वितरित",
    
    // Map
    "map.viewMap": "नक्शा देखें",
    "map.getDirections": "दिशा-निर्देश प्राप्त करें",
    "map.nearbyLocations": "आस-पास के स्थान",
    "map.routeOptimization": "मार्ग अनुकूलन",
    
    // QR Code
    "qr.scanCode": "QR कोड स्कैन करें",
    "qr.generateCode": "QR कोड बनाएं",
    "qr.shareViaWhatsApp": "WhatsApp से साझा करें",
    "qr.downloadQR": "QR कोड डाउनलोड करें",
    
    // Notifications
    "notifications.title": "सूचनाएं",
    "notifications.markAllRead": "सभी को पढ़ा हुआ चिह्नित करें",
    "notifications.noNotifications": "कोई सूचना नहीं",
  },
  
  mr: {
    // Common
    "app.name": "अन्नदान",
    "app.tagline": "अन्नाची नासाडी कमी करणे, एका वेळी एक जेवण",
    "common.loading": "लोड होत आहे...",
    "common.save": "जतन करा",
    "common.cancel": "रद्द करा",
    "common.submit": "सबमिट करा",
    "common.delete": "हटवा",
    "common.edit": "संपादित करा",
    "common.view": "पहा",
    "common.search": "शोधा",
    "common.filter": "फिल्टर",
    "common.download": "डाउनलोड करा",
    "common.share": "शेअर करा",
    "common.close": "बंद करा",
    "common.success": "यशस्वी",
    "common.error": "त्रुटी",
    "common.confirm": "पुष्टी करा",
    
    // Navigation
    "nav.dashboard": "डॅशबोर्ड",
    "nav.listings": "याद्या",
    "nav.donations": "देणग्या",
    "nav.impact": "प्रभाव अहवाल",
    "nav.carbon": "कार्बन क्रेडिट",
    "nav.notifications": "सूचना",
    "nav.settings": "सेटिंग्ज",
    "nav.logout": "लॉग आउट",
    
    // Dashboard
    "dashboard.welcome": "परत स्वागत आहे",
    "dashboard.activeListings": "सक्रिय याद्या",
    "dashboard.pendingBids": "प्रलंबित बोली",
    "dashboard.carbonCredits": "कार्बन क्रेडिट",
    "dashboard.foodDonated": "दान केलेले अन्न",
    "dashboard.mealsProvided": "दिलेले जेवण",
    "dashboard.co2Saved": "CO2 वाचवले",
    "dashboard.treesEquivalent": "झाडांच्या समतुल्य",
    
    // Donor
    "donor.postListing": "नवीन यादी पोस्ट करा",
    "donor.reviewBids": "बोलींचे पुनरावलोकन करा",
    "donor.yourImpact": "तुमचा प्रभाव",
    "donor.recentListings": "अलीकडील याद्या",
    "donor.quickActions": "जलद क्रिया",
    
    // NGO
    "ngo.findFood": "अन्न शोधा",
    "ngo.postRequirement": "आवश्यकता पोस्ट करा",
    "ngo.activeRequirements": "सक्रिय आवश्यकता",
    "ngo.matchedListings": "जुळलेल्या याद्या",
    "ngo.mealsDistributed": "वाटलेले जेवण",
    "ngo.beneficiariesServed": "लाभार्थ्यांची सेवा",
    
    // Collector
    "collector.startRoute": "मार्ग सुरू करा",
    "collector.availablePickups": "उपलब्ध पिकअप",
    "collector.pickupsToday": "आजचे पिकअप",
    "collector.kgCollected": "किलो गोळा केले",
    "collector.portionsDistributed": "वाटलेले भाग",
    "collector.biogasDelivered": "बायोगॅस वितरित",
    
    // Map
    "map.viewMap": "नकाशा पहा",
    "map.getDirections": "दिशानिर्देश मिळवा",
    "map.nearbyLocations": "जवळची ठिकाणे",
    "map.routeOptimization": "मार्ग ऑप्टिमायझेशन",
    
    // QR Code
    "qr.scanCode": "QR कोड स्कॅन करा",
    "qr.generateCode": "QR कोड तयार करा",
    "qr.shareViaWhatsApp": "WhatsApp वर शेअर करा",
    "qr.downloadQR": "QR कोड डाउनलोड करा",
    
    // Notifications
    "notifications.title": "सूचना",
    "notifications.markAllRead": "सर्व वाचलेले म्हणून चिन्हांकित करा",
    "notifications.noNotifications": "कोणतीही सूचना नाही",
  },
};

export function t(key: string, lang: Language = "en"): string {
  return translations[lang][key] || translations.en[key] || key;
}
