const Labor = require("./models/Labor");

async function seedLabors() {
  await Labor.deleteMany({});
  await Labor.insertMany([
    { name: "Laborer 1", availability: true },
    { name: "Laborer 2", availability: true },
    { name: "Laborer 3", availability: false }
  ]);
  console.log("Labors seeded");
}
seedLabors();