export function generateSlots(start, end, appointmentDuration) {
  const slots = [];
  let [h, m] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  while (h < endH || (h === endH && m < endM)) {
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += appointmentDuration;
    if (m >= 60) {
      h++;
      m -= 60;
    }
  }
  return slots;
}