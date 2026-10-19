/**
 * SETU — Curated offline safety database.
 *
 * Replace this sample data with real, verified entries for your target city
 * before the hackathon. Keep the same structure. Coordinates are [lat, lng].
 *
 * category: "hospital" | "police" | "legal" | "embassy"
 */
const POI_DATA = [
  // ---- Sample: Kolkata / New Town area (REPLACE with verified data) ----
  { id: "h1", category: "hospital", name: "Sample Hospital 1", phone: "+913312345001", lat: 22.5793, lng: 88.4790, address: "New Town, Kolkata" },
  { id: "h2", category: "hospital", name: "Sample Hospital 2", phone: "+913312345002", lat: 22.5670, lng: 88.4310, address: "Salt Lake, Kolkata" },
  { id: "h3", category: "hospital", name: "Sample Hospital 3", phone: "+913312345003", lat: 22.5354, lng: 88.3550, address: "Park Street, Kolkata" },

  { id: "p1", category: "police", name: "Sample Police Station 1", phone: "+913322345001", lat: 22.5810, lng: 88.4740, address: "New Town, Kolkata" },
  { id: "p2", category: "police", name: "Sample Police Station 2", phone: "+913322345002", lat: 22.5690, lng: 88.4200, address: "Sector V, Kolkata" },
  { id: "p3", category: "police", name: "Sample Police Station 3", phone: "+913322345003", lat: 22.5448, lng: 88.3426, address: "Esplanade, Kolkata" },

  { id: "l1", category: "legal", name: "Sample Legal Aid Society", phone: "+913366345001", lat: 22.5726, lng: 88.4639, address: "Bidhannagar, Kolkata" },
  { id: "l2", category: "legal", name: "Sample District Legal Services Authority", phone: "+913366345002", lat: 22.5626, lng: 88.3639, address: "Kolkata" },

  { id: "e1", category: "embassy", name: "Sample Consulate", phone: "+913344345001", lat: 22.5470, lng: 88.3520, address: "Park Street, Kolkata" },
];

/**
 * Static offline info panels.
 * Keep this concise, accurate, and fact-checked — this ships as read-only
 * offline content, not AI-generated at runtime.
 */
const INFO_PANELS = {
  firstaid: {
    icon: "🩹",
    label: "First Aid",
    title: "Basic First Aid",
    sections: [
      {
        heading: "Bleeding",
        body: "Apply firm, direct pressure with a clean cloth. Keep pressure steady until bleeding slows. Elevate the injured area above heart level if possible. Seek medical help for deep or heavily bleeding wounds."
      },
      {
        heading: "Tear gas exposure",
        body: "Move upwind to fresh air immediately. Do not rub eyes. Flush eyes with clean water or saline for at least 15 minutes. Remove contaminated clothing. Avoid oil-based skin products, which trap irritants."
      },
      {
        heading: "Fractures / sprains",
        body: "Avoid moving the injured limb. Immobilize with a splint or firm support if available. Apply a cold pack if accessible. Get to a hospital as soon as it is safe to move."
      },
      {
        heading: "Fainting / breathing difficulty",
        body: "Lay the person flat, elevate legs slightly if they fainted. Loosen tight clothing. If breathing is labored, keep them upright instead and seek help immediately."
      }
    ]
  },
  rights: {
    icon: "⚖️",
    label: "Know Your Rights",
    title: "Know Your Rights",
    sections: [
      {
        heading: "If stopped or detained",
        body: "You have the right to know the reason for your detention. Ask for the name and badge/ID number of the officer. Remain calm and avoid physical resistance, even if you believe the action is unjust."
      },
      {
        heading: "Right to inform someone",
        body: "You generally have the right to inform a family member or friend of your detention and location. State this request clearly and repeat it if needed."
      },
      {
        heading: "Legal representation",
        body: "You have the right to consult a lawyer. If you cannot afford one, you can request legal aid support (see the Legal Aid category on the map)."
      },
      {
        heading: "Documenting the situation",
        body: "If safe to do so, note the time, location, and any officer identification. Avoid confrontation while doing this. This is general information, not legal advice — consult a lawyer for your specific situation."
      }
    ]
  },
  survival: {
    icon: "🛡️",
    label: "Survive Crowd Control",
    title: "Crowd-Control Equipment: What To Do",
    sections: [
      {
        heading: "Tear gas / pepper spray",
        body: "Move away calmly, do not run in panic. Cover nose and mouth with a damp cloth if available. Keep eyes closed as much as possible while moving to fresh air. Do not touch your face. Once safe, flush eyes and exposed skin with water."
      },
      {
        heading: "Pellet guns / rubber bullets",
        body: "These can cause serious injury, especially to eyes and head. Keep as much distance as possible from the direction of firing. Do not turn your back and run in a straight line — move at an angle to reduce exposure. If hit, seek medical attention even if the injury looks minor."
      },
      {
        heading: "Crowd crush situations",
        body: "Move diagonally toward the edge of a crowd, not against the flow. Keep your arms up near your chest to protect your ribs if compressed. Avoid falling — if you drop something, let it go rather than bending down."
      },
      {
        heading: "General safety",
        body: "Identify exit routes before a situation escalates. Stay near people you trust. Keep your phone charged and this app's info accessible even without signal."
      }
    ]
  },
  numbers: {
    icon: "📞",
    label: "Emergency Numbers",
    title: "Emergency Numbers (India)",
    numbers: [
      { label: "National Emergency Number", number: "112" },
      { label: "Police", number: "100" },
      { label: "Ambulance", number: "108" },
      { label: "Fire", number: "101" },
      { label: "Women's Helpline", number: "1091" },
      { label: "Child Helpline", number: "1098" },
      { label: "Disaster Management", number: "108" },
    ]
  }
};

const CATEGORY_LABELS = {
  hospital: { label: "Hospital", icon: "🏥" },
  police: { label: "Police Station", icon: "🚓" },
  legal: { label: "Legal Aid", icon: "⚖️" },
  embassy: { label: "Embassy / Consulate", icon: "🏛️" },
};
