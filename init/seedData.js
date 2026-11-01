/**
 * Sample data for `npm run seed`.
 *
 * All properties, prices and people below are fictional and exist only to
 * populate a development database. Coordinates are real localities so the
 * Mapbox map on the details page works without calling the geocoder.
 *
 * Idempotency key: a listing is identified by (title, location). Running the
 * seed again skips anything that already exists and never overwrites edits.
 */

const photo = (id, width = 1400) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

// Exterior / building shots
const EXT = {
    whiteModern: "photo-1564013799919-ab600027ffc6",
    suburban: "photo-1568605114967-8130f3a36994",
    pillars: "photo-1570129477492-45c003edd2be",
    poolVilla: "photo-1512917774080-9991f1c4c750",
    bigModern: "photo-1580587771525-78b9dba3b914",
    poolHouse: "photo-1600596542815-ffad4c1539a9",
    modern2: "photo-1600585154340-be6161a56a0c",
    modern3: "photo-1600566753190-17f0baa2a6c3",
    luxury: "photo-1613490493576-7fde63acd811",
    house4: "photo-1600047509807-ba8f99d2cdde",
    house5: "photo-1600573472592-401b489a3cdc",
    house6: "photo-1600210492486-724fe5c67fb0",
    house7: "photo-1605276374104-dee2a0ed3ce6",
    house8: "photo-1583608205776-bfd35f0d9f83",
    cottage: "photo-1518780664697-55e3ad937233",
    block1: "photo-1545324418-cc1a3fa10c00",
    block2: "photo-1558036117-15d82a90b9b1",
    tower: "photo-1486406146926-c627a92ad1ab",
    field: "photo-1500382017468-9049fed747ef",
};

// Interior shots
const INT = {
    living1: "photo-1502672260266-1c1ef2d93688",
    living2: "photo-1560448204-e02f11c3d0e2",
    living3: "photo-1560185007-cde436f6a4d0",
    living4: "photo-1560185893-a55cbc8c57e8",
    living5: "photo-1522708323590-d24dbb6b0267",
    living6: "photo-1493809842364-78817add7ffb",
    living7: "photo-1505691938895-1758d7feb511",
    living8: "photo-1554995207-c18c203602cb",
    kitchen1: "photo-1556909114-f6e7ad7d3136",
    kitchen2: "photo-1556911220-bff31c812dba",
    kitchen3: "photo-1484154218962-a197022b5858",
    bedroom1: "photo-1618221195710-dd6b41faaea6",
    bedroom2: "photo-1616594039964-ae9021a400a0",
    bedroom3: "photo-1540518614846-7eded433c457",
    room1: "photo-1600607687939-ce8a6c25118c",
    room2: "photo-1600607687644-c7171b42498f",
    office1: "photo-1497366216548-37526070297c",
    office2: "photo-1497366811353-6870744d04b2",
};

const imgs = (...ids) => ids.map((id) => photo(id));

// `agent` is an index into SEED_USERS; `by` in reviews is an index too (never the owner).
const SEED_USERS = [
    { username: "priya.realty", email: "priya.realty@velora.example" },
    { username: "arjun.estates", email: "arjun.estates@velora.example" },
    { username: "meera.homes", email: "meera.homes@velora.example" },
];

const listings = [
    {
        title: "3BHK with Hussain Sagar views in Banjara Hills",
        description:
            "A bright corner apartment on the 14th floor with floor-to-ceiling windows facing the lake. The layout separates the living and dining areas from three well-sized bedrooms, and the kitchen has a utility room attached. Two covered parking spots and 24-hour security are included.",
        location: "Banjara Hills, Hyderabad, Telangana",
        country: "India",
        coordinates: [78.4347, 17.4156],
        price: 24000000,
        category: "Apartment",
        listingType: "sale",
        bedrooms: 3, bathrooms: 3, area: 1850,
        amenities: ["Lift", "Covered parking", "24x7 security", "Gym", "Power backup"],
        featured: true,
        agent: 0,
        images: imgs(INT.living1, INT.living5, INT.kitchen1, INT.bedroom1),
        reviews: [
            { by: 1, rating: 5, comment: "The lake view at sunset is unreal. Spacious rooms and the society is very well maintained." },
            { by: 2, rating: 4, comment: "Great layout and natural light. Parking is a little tight on weekends." },
        ],
    },
    {
        title: "Gated 4BHK villa with private garden in Gachibowli",
        description:
            "A four-bedroom villa in a gated community ten minutes from the financial district. The ground floor opens onto a landscaped garden, and the first floor has a family lounge and a balcony off the master suite. Clubhouse, swimming pool and a children's play area are shared with the community.",
        location: "Gachibowli, Hyderabad, Telangana",
        country: "India",
        coordinates: [78.3489, 17.4401],
        price: 48500000,
        category: "Villa",
        listingType: "sale",
        bedrooms: 4, bathrooms: 5, area: 3600,
        amenities: ["Private garden", "Clubhouse", "Swimming pool", "Gated community", "Servant room"],
        featured: true,
        agent: 0,
        images: imgs(EXT.poolVilla, INT.room1, INT.living7, INT.bedroom2),
        reviews: [
            { by: 2, rating: 5, comment: "Quiet, green and close to everything. The garden is a big plus for kids." },
        ],
    },
    {
        title: "Furnished 2BHK near HITEC City",
        description:
            "A fully furnished two-bedroom flat a short walk from the tech corridor. It comes with a modular kitchen, wardrobes in both bedrooms, an air conditioner in each room and high-speed fibre already installed. Suitable for a couple or two working professionals.",
        location: "Madhapur, Hyderabad, Telangana",
        country: "India",
        coordinates: [78.3908, 17.4486],
        price: 48000,
        category: "Apartment",
        listingType: "rent",
        bedrooms: 2, bathrooms: 2, area: 1250,
        amenities: ["Fully furnished", "Air conditioning", "Fibre internet", "Lift", "Covered parking"],
        agent: 0,
        images: imgs(INT.living2, INT.bedroom3, INT.kitchen2, INT.living8),
        reviews: [
            { by: 1, rating: 4, comment: "Exactly as described. The owner was quick to fix a leaking tap." },
        ],
    },
    {
        title: "Sea-facing 2BHK in Bandra West",
        description:
            "A well-kept two-bedroom apartment on a high floor with a sea view from the living room and master bedroom. The building is a short walk from the promenade and the local train. Recently repainted, with new flooring in the bedrooms and a covered parking slot.",
        location: "Bandra West, Mumbai, Maharashtra",
        country: "India",
        coordinates: [72.8295, 19.0596],
        price: 69000000,
        category: "Apartment",
        listingType: "sale",
        bedrooms: 2, bathrooms: 2, area: 1100,
        amenities: ["Sea view", "Lift", "Covered parking", "24x7 security"],
        featured: true,
        agent: 1,
        images: imgs(EXT.block1, INT.living3, INT.bedroom1, INT.kitchen3),
        reviews: [
            { by: 0, rating: 5, comment: "The view alone is worth it. Compact but every room gets sea breeze." },
            { by: 2, rating: 4, comment: "Prime location. Maintenance charges are on the higher side." },
        ],
    },
    {
        title: "Compact studio in Koramangala",
        description:
            "A smartly planned studio on the second floor of a quiet lane, five minutes from cafes and the metro feeder. Includes a sleeping loft, a built-in work desk, a small kitchenette and a separate bathroom with a geyser. Good for a single professional.",
        location: "Koramangala, Bengaluru, Karnataka",
        country: "India",
        coordinates: [77.6245, 12.9352],
        price: 24000,
        category: "Studio",
        listingType: "rent",
        bedrooms: 0, bathrooms: 1, area: 480,
        amenities: ["Furnished", "Fibre internet", "Water heater", "Two-wheeler parking"],
        agent: 1,
        images: imgs(INT.living6, INT.living4, INT.kitchen1, INT.bedroom3),
        reviews: [
            { by: 0, rating: 4, comment: "Well designed for the space. The loft bed is comfortable." },
        ],
    },
    {
        title: "Lakeside 4BHK villa in Whitefield",
        description:
            "A four-bedroom villa on a corner plot facing a community lake. Double-height living room, a home office on the ground floor, and a terrace with room for a small garden. The community has a jogging track, a clubhouse and a daily-needs store.",
        location: "Whitefield, Bengaluru, Karnataka",
        country: "India",
        coordinates: [77.75, 12.9698],
        price: 36000000,
        category: "Villa",
        listingType: "sale",
        bedrooms: 4, bathrooms: 4, area: 3200,
        amenities: ["Lake view", "Clubhouse", "Terrace garden", "Jogging track", "Home office"],
        agent: 1,
        images: imgs(EXT.modern3, INT.living7, INT.kitchen2, INT.bedroom2),
    },
    {
        title: "Skyline penthouse with private terrace on Golf Course Road",
        description:
            "A four-bedroom penthouse across the top two floors with a 1,200 sq ft private terrace. Italian-marble flooring in the living areas, a chef's kitchen with island seating and a dedicated media room. Three car parks and a private lift lobby.",
        location: "Golf Course Road, Gurugram, Haryana",
        country: "India",
        coordinates: [77.101, 28.435],
        price: 95000000,
        category: "Penthouse",
        listingType: "sale",
        bedrooms: 4, bathrooms: 5, area: 4800,
        amenities: ["Private terrace", "Private lift", "Media room", "Concierge", "Swimming pool", "Gym"],
        featured: true,
        agent: 2,
        images: imgs(EXT.luxury, INT.room1, INT.living8, INT.bedroom2),
        reviews: [
            { by: 0, rating: 5, comment: "Easily the best terrace in the sector. Finishes are top quality." },
        ],
    },
    {
        title: "Garden-level 3BHK in Koregaon Park",
        description:
            "A ground-floor three-bedroom apartment with its own sit-out garden, in a low-rise building on a tree-lined lane. Large windows in every room, a separate dining area and a store room. Pets are welcome, and the building has a generator for backup.",
        location: "Koregaon Park, Pune, Maharashtra",
        country: "India",
        coordinates: [73.894, 18.5362],
        price: 85000,
        category: "Apartment",
        listingType: "rent",
        bedrooms: 3, bathrooms: 3, area: 1700,
        amenities: ["Private garden", "Pet friendly", "Power backup", "Covered parking"],
        agent: 1,
        images: imgs(EXT.block2, INT.living5, INT.kitchen3, INT.bedroom1),
        reviews: [
            { by: 2, rating: 5, comment: "Lovely quiet street, and the garden makes it feel like a house." },
        ],
    },
    {
        title: "Restored heritage haveli in C-Scheme",
        description:
            "A century-old family home restored with modern plumbing, wiring and air conditioning while keeping the carved jharokhas, arched doorways and central courtyard. Five bedrooms, a library, and a rooftop sit-out with a view of the Nahargarh hills.",
        location: "C-Scheme, Jaipur, Rajasthan",
        country: "India",
        coordinates: [75.8006, 26.9065],
        price: 52000000,
        category: "Independent House",
        listingType: "sale",
        bedrooms: 5, bathrooms: 5, area: 5200,
        amenities: ["Courtyard", "Rooftop sit-out", "Library", "Air conditioning", "Parking for 4 cars"],
        agent: 2,
        images: imgs(EXT.pillars, INT.room2, INT.living7, INT.bedroom3),
        reviews: [
            { by: 1, rating: 5, comment: "A rare find. The restoration work is careful and the courtyard is stunning." },
        ],
    },
    {
        title: "Pool villa with palm garden in Assagao",
        description:
            "A three-bedroom Goan villa surrounded by coconut palms, with a private pool and a shaded verandah. Open-plan living and dining, an outdoor shower and a separate caretaker's room. Ten minutes by scooter to the beaches at Vagator and Anjuna.",
        location: "Assagao, North Goa, Goa",
        country: "India",
        coordinates: [73.766, 15.597],
        price: 39500000,
        category: "Villa",
        listingType: "sale",
        bedrooms: 3, bathrooms: 3, area: 2400,
        amenities: ["Private pool", "Garden", "Verandah", "Caretaker's room", "Air conditioning"],
        agent: 2,
        images: imgs(EXT.poolHouse, INT.living1, INT.bedroom2, INT.kitchen1),
        reviews: [
            { by: 0, rating: 4, comment: "Peaceful and beautifully landscaped. Mosquitoes in the evening, as expected in Goa." },
            { by: 1, rating: 5, comment: "The pool and verandah are perfect. We could easily live here year-round." },
        ],
    },
    {
        title: "3BHK on Marine Drive promenade",
        description:
            "A third-floor apartment across from the backwaters, with a balcony running the length of the living room. Wooden flooring in the bedrooms, a modular kitchen with chimney and a servant's quarter on the terrace level. Walking distance to the ferry terminal.",
        location: "Marine Drive, Kochi, Kerala",
        country: "India",
        coordinates: [76.275, 9.9816],
        price: 14500000,
        category: "Apartment",
        listingType: "sale",
        bedrooms: 3, bathrooms: 3, area: 1650,
        amenities: ["Waterfront", "Balcony", "Lift", "Covered parking", "24x7 security"],
        agent: 2,
        images: imgs(EXT.block1, INT.living2, INT.kitchen2, INT.bedroom3),
    },
    {
        title: "Two-bedroom flat in Anna Nagar",
        description:
            "A second-floor flat in a well-run building near the tower park. Cross-ventilated rooms, a balcony off the master bedroom and a covered car park. The neighbourhood has schools, hospitals and a metro station within walking distance.",
        location: "Anna Nagar, Chennai, Tamil Nadu",
        country: "India",
        coordinates: [80.2101, 13.085],
        price: 32000,
        category: "Apartment",
        listingType: "rent",
        bedrooms: 2, bathrooms: 2, area: 1050,
        amenities: ["Balcony", "Covered parking", "Lift", "Water storage"],
        agent: 2,
        images: imgs(INT.living3, INT.bedroom1, INT.kitchen3, INT.living6),
        reviews: [
            { by: 0, rating: 4, comment: "Very convenient location and a responsive owner." },
        ],
    },
    {
        title: "Two-acre farmhouse near Shamirpet",
        description:
            "A three-bedroom farmhouse on two acres of mango and guava trees, forty minutes from the outer ring road. A borewell, a solar-powered pump and a fenced boundary are in place. Ideal as a weekend home or a small organic farm.",
        location: "Shamirpet, Hyderabad, Telangana",
        country: "India",
        coordinates: [78.574, 17.59],
        price: 21000000,
        category: "Farmhouse",
        listingType: "sale",
        bedrooms: 3, bathrooms: 3, area: 2800,
        amenities: ["Orchard", "Borewell", "Solar pump", "Fenced boundary", "Caretaker's room"],
        agent: 0,
        images: imgs(EXT.cottage, EXT.field, INT.living7, INT.bedroom3),
    },
    {
        title: "Corner residential plot in Kokapet",
        description:
            "A 300-square-yard east-facing corner plot in an approved layout with 40-foot roads on two sides. Underground drainage, water lines and street lighting are already in place. Clear title documents are available for inspection.",
        location: "Kokapet, Hyderabad, Telangana",
        country: "India",
        coordinates: [78.335, 17.3947],
        price: 18000000,
        category: "Plot",
        listingType: "sale",
        area: 2700,
        amenities: ["Corner plot", "East facing", "Approved layout", "Underground drainage"],
        agent: 0,
        images: imgs(EXT.field, EXT.suburban),
    },
    {
        title: "Corner office floor in Bandra Kurla Complex",
        description:
            "A fitted-out 2,400 sq ft office floor with a reception, three cabins, an open workspace for 24 and a pantry. Glass-fronted on two sides. The building offers 24-hour access, backup power and parking for six cars.",
        location: "Bandra Kurla Complex, Mumbai, Maharashtra",
        country: "India",
        coordinates: [72.869, 19.066],
        price: 340000,
        category: "Commercial",
        listingType: "rent",
        bathrooms: 2, area: 2400,
        amenities: ["Fitted-out", "24-hour access", "Power backup", "Cafeteria", "Visitor parking"],
        agent: 1,
        images: imgs(EXT.tower, INT.office1, INT.office2),
    },
    {
        title: "Ground-floor retail shop on MG Road",
        description:
            "A 900 sq ft high-street shop with a double-height glass front and a mezzanine for storage. Located among established brands with heavy foot traffic from the nearby metro station. Currently vacant and ready for fit-out.",
        location: "MG Road, Bengaluru, Karnataka",
        country: "India",
        coordinates: [77.6068, 12.9756],
        price: 27500000,
        category: "Commercial",
        listingType: "sale",
        bathrooms: 1, area: 900,
        amenities: ["Street frontage", "Mezzanine", "Near metro", "Three-phase power"],
        agent: 1,
        images: imgs(EXT.block2, INT.office2),
    },
    {
        title: "Hill-view stone cottage in Landour",
        description:
            "A three-bedroom stone cottage with a tin roof, a fireplace in the living room and a deck that faces the snow peaks on clear days. The property comes with a small kitchen garden and a caretaker who has looked after it for years.",
        location: "Landour, Mussoorie, Uttarakhand",
        country: "India",
        coordinates: [78.096, 30.46],
        price: 11500000,
        category: "Independent House",
        listingType: "sale",
        bedrooms: 3, bathrooms: 2, area: 1600,
        amenities: ["Fireplace", "Mountain view", "Kitchen garden", "Caretaker"],
        agent: 2,
        images: imgs(EXT.cottage, INT.living7, INT.bedroom3, INT.kitchen2),
        reviews: [
            { by: 1, rating: 5, comment: "Waking up to the view from the deck is worth every rupee." },
        ],
    },
    {
        title: "Lake-view family home on Fateh Sagar Road",
        description:
            "A three-bedroom independent house with an upper-floor balcony overlooking Fateh Sagar lake. Marble flooring, a large kitchen with a pantry and a courtyard for evening chai. Fully available for long-term lease with a minimum of eleven months.",
        location: "Fateh Sagar Road, Udaipur, Rajasthan",
        country: "India",
        coordinates: [73.6781, 24.595],
        price: 65000,
        category: "Independent House",
        listingType: "rent",
        bedrooms: 3, bathrooms: 3, area: 2100,
        amenities: ["Lake view", "Courtyard", "Parking", "Air conditioning"],
        agent: 2,
        images: imgs(EXT.house4, INT.living8, INT.kitchen1, INT.bedroom2),
    },
    {
        title: "Colonial-era bungalow in Alipore",
        description:
            "A five-bedroom bungalow on a quarter-acre plot in one of the city's quietest neighbourhoods. High ceilings, teak staircase, original floor tiles and a wide verandah. The grounds include mature trees, a garage for three cars and staff quarters.",
        location: "Alipore, Kolkata, West Bengal",
        country: "India",
        coordinates: [88.33, 22.533],
        price: 62500000,
        category: "Independent House",
        listingType: "sale",
        bedrooms: 5, bathrooms: 4, area: 4200,
        amenities: ["Verandah", "Large garden", "Staff quarters", "Garage for 3 cars"],
        agent: 2,
        images: imgs(EXT.house7, INT.room2, INT.living7, INT.bedroom1),
    },
    {
        title: "Riverfront 2BHK near Vastrapur Lake",
        description:
            "A modern two-bedroom apartment in a new tower with a podium garden and indoor games room. Both bedrooms have attached bathrooms and the living area opens to a balcony. Ten minutes from the riverfront and the metro.",
        location: "Vastrapur, Ahmedabad, Gujarat",
        country: "India",
        coordinates: [72.53, 23.04],
        price: 9500000,
        category: "Apartment",
        listingType: "sale",
        bedrooms: 2, bathrooms: 2, area: 1150,
        amenities: ["Podium garden", "Indoor games room", "Lift", "Covered parking", "CCTV"],
        agent: 1,
        images: imgs(EXT.block1, INT.living4, INT.kitchen2, INT.bedroom3),
        reviews: [
            { by: 0, rating: 4, comment: "Good value for the area, and the amenities are actually used." },
        ],
    },
];

module.exports = { SEED_USERS, listings };
