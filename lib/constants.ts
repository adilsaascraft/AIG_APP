export const organizers = [
  { value: "alice-johnson", label: "Alice Johnson" },
  { value: "michael-lee", label: "Michael Lee" },
  { value: "sara-kim", label: "Sara Kim" },
  { value: "david-nguyen", label: "David Nguyen" },
  { value: "linda-garcia", label: "Linda Garcia" },
] as const;

export const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "human-resources", label: "Human Resources" },
  { value: "finance", label: "Finance" },
] as const;

export const prefix = [
  { value: "Mr", label: "Mr" },
  { value: "Ms", label: "Ms" },
  { value: "Mrs", label: "Mrs" },
  { value: "Dr", label: "Dr" },
  { value: "Prof", label: "Prof" },
] as const;


export const gender = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
] as const;



export const relation = [
  { value: "Husband", label: "Husband" },
  { value: "Wife", label: "Wife" },

  { value: "Father", label: "Father" },
  { value: "Mother", label: "Mother" },

  { value: "Son", label: "Son" },
  { value: "Daughter", label: "Daughter" },
  { value: "Child", label: "Child" },

  { value: "Brother", label: "Brother" },
  { value: "Sister", label: "Sister" },
  { value: "Sibling", label: "Sibling" },

  { value: "Grandfather", label: "Grandfather" },
  { value: "Grandmother", label: "Grandmother" },

  { value: "Uncle", label: "Uncle" },
  { value: "Aunt", label: "Aunt" },
  { value: "Cousin", label: "Cousin" },

  { value: "Guardian", label: "Guardian" },

  { value: "Friend", label: "Friend" },
  { value: "Partner", label: "Partner" },
  { value: "Relative", label: "Relative" },

  { value: "Other", label: "Other" },
] as const;


export const eventCategories = [
  { value: "Workshop", label: "Workshop" },
  { value: "Conference", label: "Conference" },
  { value: "CME", label: "CME" },
  { value: "Webinar", label: "Webinar" },
  { value: "Seminar", label: "Seminar" },
] as const;

export const eventType = [
  { value: "In-Person", label: "In-Person" },
  { value: "Virtual", label: "Virtual" },
  { value: "Hybrid", label: "Hybrid" },
] as const;

export const registrationType = [
  { value: "paid", label: "Paid" },
  { value: "free", label: "Free" },
] as const;

export const currencyType = [
  { value: "Indian-Rupee", label: "Indian Rupee" },
  { value: "USD", label: "USD" },
] as const;

export const status = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
] as const;

export const hall = [
  { value: "Hall A", label: "Hall A" },
  { value: "Hall B", label: "Hall B" },
] as const;

export const track = [
  { value: "Track A", label: "Track A" },
  { value: "Track B", label: "Track B" },
] as const;


export const faculty = [
  { value: "Dr. ABC", label: "Dr. ABC" },
  { value: "Prof. XYZ", label: "Prof. XYZ" },
] as const;

export const category = [
  { value: "category A", label: "Category A" },
  { value: "category B", label: "Category B" },
] as const;

export const stallType = [
  { value: "Shell Scheme", label: "Shell Scheme" },
  { value: "Space Only", label: "Space Only" },
  { value: "Table Space Only", label: "Table Space Only" },
] as const;

export const sponsor = [
  { value: "Sun Pharma", label: "Sun Pharma" },
  { value: "Dr. Reddy Labs", label: "Dr. Reddy Labs" },
  { value: "Intas Pvt. Ltd", label: "Intas Pvt. Ltd" },
] as const;

export const hotelCategory = [
  { value: "⭐", label: "1 Star" },
  { value: "⭐⭐", label: "2 Star" },
  { value: "⭐⭐⭐", label: "3 Star" },
  { value: "⭐⭐⭐⭐", label: "4 Star" },
  { value: "⭐⭐⭐⭐⭐", label: "5 Star" },
  { value: "⭐⭐⭐⭐⭐⭐", label: "6 Star" },
  { value: "⭐⭐⭐⭐⭐⭐⭐", label: "7 Star" },
] as const;


export const items = [
  { value: "Dashboard", label: "Dashboard" },
  { value: "Registration", label: "Registration" },
  { value: "Abstract", label: "Abstract" },
  { value: "Faculty", label: "Faculty" },
  { value: "Agenda", label: "Agenda" },
  { value: "Exhibitor", label: "Exhibitor" },
  { value: "Sponsor", label: "Sponsor" },
  { value: "Travel", label: "Travel" },
  { value: "Accomodation", label: "Accomodation" },
  { value: "Marketing", label: "Marketing" },
  { value: "Communication", label: "Communication" },
  { value: "Accounting", label: "Accounting" },
  { value: "Badging & Scanning", label: "Badging & Scanning" },
  { value: "Event App", label: "Event App" },
  { value: "Presentation", label: "Presentation" },
] as const;


export const WorkshopType = [
  { value: "Pre Conference", label: "Pre Conference" },
  { value: "Post Conference", label: "Post Conference" },
] as const;


export const settingsList = [
  {
    key: "attendeeRegistration",
    title: "Attendee Registration",
    desc: "Enable users to signup and confirm their event registration",
  },
  {
    key: "accompanyRegistration",
    title: "Accompany Registration",
    desc: "Enable users to register guests or family members for the event",
  },
  {
    key: "workshopRegistration",
    title: "Workshop Registration",
    desc: "Give users access to register for specific workshops for the event",
  },
  {
    key: "banquetRegistration",
    title: "Banquet Registration",
    desc: "Give users access to book banquet seats for the event",
  },
] as const;



export const abstractSettings = [
  {
    key: "regRequiredForAbstractSubmission",
    title: "Registration required for abstract submission",
    desc: "Enable abstract submission only for event registered users",
  },
  {
    key: "uploadFileRequired",
    title: "Abstract submission required for file upload",
    desc: "Enable this to require an abstract submission to upload files.",
  },
  {
    key: "uploadVideoUrlRequired",
    title: "Abstract submission required for video URL",
    desc: "Enable this to require an abstract submission to add a video URL.",
  },
] as const;


// Travel Pickup Point 
export const pickupPointType = [
  { value: "Railway Station", label: "Railway Station" },
  { value: "Metro Station", label: "Metro Station" },
  { value: "Bus Station", label: "Bus Station" },
  { value: "Airport", label: "Airport" },
  { value: "Taxi Stand", label: "Taxi Stand" },
  { value: "Hotel", label: "Hotel" },
  { value: "Shopping Mall", label: "Shopping Mall" },
  { value: "Landmark", label: "Landmark" },
  { value: "Religious Place", label: "Religious Place" },
  { value: "Restricted Area", label: "Restricted Area" },
  { value: "Hospital", label: "Hospital" },
  { value: "School", label: "School" },
  { value: "College", label: "College" },
  { value: "Office", label: "Office" },
  { value: "Industrial Area", label: "Industrial Area" },
  { value: "Residential Area", label: "Residential Area" },
  { value: "Tourist Spot", label: "Tourist Spot" },
  { value: "Resort", label: "Resort" },
  { value: "Stadium", label: "Stadium" },
  { value: "Border Checkpoint", label: "Border Checkpoint" },
  { value: "Parking Lot", label: "Parking Lot" },

  { value: "Other", label: "Other" },
] as const;



// Input Type 

export const inputTypes = [
  // Basic Inputs
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "password", label: "Password" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "datetime-local", label: "Date & Time" },

  // Uploads
  { value: "file", label: "File Upload" },

] as const;


// File Upload Type

export const fileUploadTypes = [
  { value: "pdf", label: "PDF (.pdf)" },
  { value: "jpg", label: "JPG (.jpg)" },
  { value: "jpeg", label: "JPEG (.jpeg)" },
  { value: "png", label: "PNG (.png)" },
  { value: "webp", label: "WebP (.webp)" },

  // Documents
  { value: "doc", label: "Word (.doc)" },
  { value: "docx", label: "Word (.docx)" },
  { value: "xls", label: "Excel (.xls)" },
  { value: "xlsx", label: "Excel (.xlsx)" },
  { value: "ppt", label: "PowerPoint (.ppt)" },
  { value: "pptx", label: "PowerPoint (.pptx)" },

  // Text & Code
  { value: "txt", label: "Text (.txt)" },
  { value: "csv", label: "CSV (.csv)" },
  { value: "json", label: "JSON (.json)" },

  // Compressed
  { value: "zip", label: "ZIP (.zip)" },
  { value: "rar", label: "RAR (.rar)" },

  // Media
  { value: "mp3", label: "Audio (.mp3)" },
  { value: "mp4", label: "Video (.mp4)" },
] as const;


