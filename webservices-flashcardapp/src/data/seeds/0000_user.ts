import userService from "../../service/user";
import userRepository from "../../repository/user";

const jwts: string[] = [];

const emailBase = "@example.com";
const emails = [
  "user" + emailBase,
  "rosalindmyers" + emailBase,
  "somi" + emailBase,
  "johnsmith" + emailBase,
  "mariagarcia" + emailBase,
  "davidchen" + emailBase,
  "sarahjohnson" + emailBase,
  "mikebrown" + emailBase,
  "emilydavis" + emailBase,
  "alexwilson" + emailBase,
  "linaanderson" + emailBase,
  "carlosmartinez" + emailBase,
];

const seed = async () => {
  // first delete all entries
  for (const email of emails) {
    await userRepository.deleteItems("email", email);
  }

  // add the entries
  const userData = [
    { name: "John Doe", email: emails[0], password: "user1234" },
    { name: "Rosalind Myers", email: emails[1], password: "12345678910" },
    { name: "So Mi", email: emails[2], password: "12345678911" },
    { name: "John Smith", email: emails[3], password: "password123" },
    { name: "Maria Garcia", email: emails[4], password: "spanish456" },
    { name: "David Chen", email: emails[5], password: "coding789" },
    { name: "Sarah Johnson", email: emails[6], password: "biology101" },
    { name: "Mike Brown", email: emails[7], password: "physics202" },
    { name: "Emily Davis", email: emails[8], password: "chemistry303" },
    { name: "Alex Wilson", email: emails[9], password: "history404" },
    { name: "Lina Anderson", email: emails[10], password: "literature505" },
    { name: "Carlos Martinez", email: emails[11], password: "geography606" },
  ];

  for (const user of userData) {
    const jwt = await userService.create(user);

    jwts.push(jwt);
  }
};

export { seed, jwts }; // We cannot use export default here because of the way knex handles migrations.
