const adjectives = [
  "Catalyst", "Campus", "OldWestbury", "Owen", "Panther", "Student", 
  "Reporter", "Scholarly", "Active", "Digital", "Local", "Creative"
];

const nouns = [
  "Voice", "Writer", "Reader", "Researcher", "Owl", "Panther", 
  "Citizen", "Member", "Contributor", "Journalist", "Observer", "Spark"
];

export function generateGuestName(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 900) + 100; // 100-999
  
  return `${adj}${noun}${num}`;
}
