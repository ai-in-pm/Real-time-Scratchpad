export const sampleData = {
  name: "John Doe",
  age: 30,
  contact: {
    email: "john@example.com",
    phone: "123-456-7890"
  },
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345"
  },
  preferences: {
    theme: "dark",
    notifications: true
  },
  misc: "Some other info",
  active: true,
  tags: ["premium", "customer", "verified"]
};

// Default fields to extract
export const defaultTargetFields = ["name", "email", "phone", "city", "theme", "tags"];
