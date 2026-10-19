/**
 * SETU — Personal emergency contacts module.
 * Stored locally on-device (localStorage) — never sent anywhere except in
 * the SOS SMS itself, which is user-triggered.
 */

const ContactsModule = (() => {
  const STORAGE_KEY = "setu_contacts_v1";
  const MAX_CONTACTS = 5;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyContacts();
      const parsed = JSON.parse(raw);
      // pad/truncate to MAX_CONTACTS
      const list = [...parsed];
      while (list.length < MAX_CONTACTS) list.push({ name: "", phone: "" });
      return list.slice(0, MAX_CONTACTS);
    } catch (e) {
      return emptyContacts();
    }
  }

  function emptyContacts() {
    return Array.from({ length: MAX_CONTACTS }, () => ({ name: "", phone: "" }));
  }

  function save(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function getValidContacts() {
    return load().filter((c) => c.phone && c.phone.trim().length > 3);
  }

  function init() {
    const container = document.getElementById("contacts-list");
    const contacts = load();
    container.innerHTML = "";

    contacts.forEach((c, idx) => {
      const row = document.createElement("div");
      row.className = "contact-row";
      row.innerHTML = `
        <div class="slot-num">${idx + 1}</div>
        <input type="text" placeholder="Name" value="${escapeHtml(c.name)}" data-field="name" data-idx="${idx}" />
        <input type="tel" placeholder="+91XXXXXXXXXX" value="${escapeHtml(c.phone)}" data-field="phone" data-idx="${idx}" />
      `;
      container.appendChild(row);
    });

    container.addEventListener("input", (e) => {
      const idx = e.target.getAttribute("data-idx");
      const field = e.target.getAttribute("data-field");
      if (idx == null || !field) return;
      const list = load();
      list[idx][field] = e.target.value;
      save(list);
    });
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  return { init, getValidContacts };
})();
