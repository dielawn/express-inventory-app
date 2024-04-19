#! /usr/bin/env node

console.log(
    'This script populates some test tires, manufacturers, sizes, class/season and tireinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Tire = require('./models/tire.js');
  const TireSize = require('./models/tire_size.js')
  const TireInstance = require('./models/tireInstance.js');
  const Manufacturer = require('./models/manufacturer.js');
  const Category = require('./models/category.js');
  
  
  const tires = [];
  const manufacturers = [];
  const sizes = [];
  const tireInstances = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createMfr();
    await createTires();
    await createTireInstances();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // categpry[0] will always be the , regardless of the order
  // in which the elements of promise.all's argument complete.
  async function categoryCreate(index, tireClass, season, description) {
    const categoryDetail = { tire_class: tireClass, season: season, description: description }
    const category = new Category(categoryDetail);
    await category.save();
    category[index] = category;
    console.log(`Added category: ${categoryDetail.tire_class}, ${categoryDetail.season}`);
  }
  
  async function manufacturerCreate(index, name, location) {
    const manufacturer = new manufacturer({ name: name, location: location});  
    await manufacturer.save();
    manufacturers[index] = manufacturer;
    console.log(`Added manufacturer: ${manufacturer.name} ${manufacturer.location}`);
  }
  
  async function tireCreate(index, modelName, manufacturer, info, sku, category, stock, costPrice, listPrice) {
    const tireDetail = {
      model_name: modelName,
      manufacturer: manufacturer,
      info: info,
      sku: sku,
      category: category,
      stock: stock,
      cost_price: costPrice,
      list_price: listPrice
    };
    
  
    const tire = new Tire(tireDetail);
    await tire.save();
    tire[index] = tire;
    console.log(`Added tire: ${tire.model_name}`);
  }
  
  async function tireInstanceCreate(index, tire, size, dot, dateCode) {
    const tireInstanceDetail = {
      tire: tire,
      size: size,
      dot: dot,
      date_code: dateCode
    };
     
    const tireInstance = new TireInstance(tireInstanceDetail);
    await tireInstance.save();
    tireInstance[index] = tireInstance;
    console.log(`Added tire instance: ${dot}`);
  };

  async function sizeCreate(index, tireWidth, aspectRatio, wheelDia) {
    const sizeDetail = {
        tire_width: tireWidth,
        aspect_ratio: aspectRatio,
        wheel_dia: wheelDia,
    };

    const tireSize = new TireSize(sizeDetail);
    await tireSize.save();
    tireSize[index] = tireSize;
    console.log(`Added size: ${this.tread_width}/${this.aspect_ratio}/${this.wheel_dia}`)
  }
  
  async function createCategories() {

    const [pDesc, ltDesc, cDesc, dDesc, stDesc, tDesc, atDesc, mtDesc, htDesc, uhpDesc, rftDesc, evDesc] = [
        `P (Passenger): Standard passenger vehicle tires.`,
        `LT (Light Truck): Designed for vehicles that carry heavy loads or perform light towing tasks.`,
        `C (Commercial): Tires for commercial vehicles that carry heavier loads than typical passenger vehicles.`,
        `D (Heavy Duty): Often associated with tires designed for heavier than standard loads, not as common in categorization as LT.`,
        `ST (Special Trailer): Tires specifically designed for trailers, including boat trailers, utility trailers, and other types of towable equipment.`,
        `T (Temporary Spare): Also known as "donut" spares, these are temporary tires intended to get you to a garage or a safe spot to change your tire.`,
        `AT (All Terrain): Designed to provide balanced performance in on-road and off-road conditions.`,
        `MT (Mud Terrain): Specifically designed for off-road environments with large tread blocks for mud traction.`,
        `HT (Highway Terrain): Optimized for sealed road driving with features that enhance ride comfort and fuel efficiency.`,
        `UHP (Ultra High Performance): Tires designed for sports performance in terms of speed and handling.`,
        `RFT (Run Flat Tire): These tires can continue to be driven on temporarily even after they lose air pressure.`,
        `EV (Electric Vehicle): Some manufacturers are now developing tires specifically designed for electric vehicles, which are generally heavier than traditional vehicles due to the weight of the battery packs. These tires often emphasize low rolling resistance to maximize battery range.`
    ]
    console.log("Adding genres");
    await Promise.all([
        //all season
        categoryCreate('LT', "All Season", ltDesc),
        categoryCreate('P', "All Season", pDesc),
        categoryCreate('C', "All Season", cDesc ),
        categoryCreate('D', "All Season", dDesc ),
        categoryCreate('ST', "All Season", stDesc ),
        categoryCreate('T', "All Season", tDesc ),
        categoryCreate('AT', "All Season", atDesc ),
        categoryCreate('MT', "All Season", mtDesc ),
        categoryCreate('HT', "All Season", htDesc ),
        categoryCreate('UHP', "All Season", uhpDesc ),
        categoryCreate('RFT', "All Season", rftDesc ),
        categoryCreate('EV', "All Season", evDesc ),
        //winter
        categoryCreate('LT', "Winter", ltDesc),
        categoryCreate('P', "Winter", pDesc),
        categoryCreate('C', "Winter", cDesc ),
        categoryCreate('D', "Winter", dDesc ),
        categoryCreate('ST', "Winter", stDesc ),
        categoryCreate('T', "Winter", tDesc ),
        categoryCreate('AT', "Winter", atDesc ),
        categoryCreate('MT', "Winter", mtDesc ),
        categoryCreate('HT', "Winter", htDesc ),
        categoryCreate('UHP', "Winter", uhpDesc ),
        categoryCreate('RFT', "Winter", rftDesc ),
        categoryCreate('EV', "Winter", evDesc ),
    ]);
  }
  
  async function createmanufacturers() {
    console.log("Adding manufacturers");
    await Promise.all([
      manufacturerCreate(0, "Patrick", "Rothfuss", "1973-06-06", false),
      manufacturerCreate(1, "Ben", "Bova", "1932-11-8", false),
      manufacturerCreate(2, "Isaac", "Asimov", "1920-01-02", "1992-04-06"),
      manufacturerCreate(3, "Bob", "Billings", false, false),
      manufacturerCreate(4, "Jim", "Jones", "1971-12-16", false),
    ]);
  }
  
  async function createBooks() {
    console.log("Adding Books");
    await Promise.all([
      bookCreate(0,
        "The Name of the Wind (The Kingkiller Chronicle, #1)",
        "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.",
        "9781473211896",
        manufacturers[0],
        [genres[0]]
      ),
      bookCreate(1,
        "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
        "Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.",
        "9788401352836",
        manufacturers[0],
        [genres[0]]
      ),
      bookCreate(2,
        "The Slow Regard of Silent Things (Kingkiller Chronicle)",
        "Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.",
        "9780756411336",
        manufacturers[0],
        [genres[0]]
      ),
      bookCreate(3,
        "Apes and Angels",
        "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...",
        "9780765379528",
        manufacturers[1],
        [genres[1]]
      ),
      bookCreate(4,
        "Death Wave",
        "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...",
        "9780765379504",
        manufacturers[1],
        [genres[1]]
      ),
      bookCreate(5,
        "Test Book 1",
        "Summary of test book 1",
        "ISBN111111",
        manufacturers[4],
        [genres[0], genres[1]]
      ),
      bookCreate(6,
        "Test Book 2",
        "Summary of test book 2",
        "ISBN222222",
        manufacturers[4],
        false
      ),
    ]);
  }
  
  async function createBookInstances() {
    console.log("Adding manufacturers");
    await Promise.all([
      bookInstanceCreate(0, books[0], "London Gollancz, 2014.", false, "Available"),
      bookInstanceCreate(1, books[1], " Gollancz, 2011.", false, "Loaned"),
      bookInstanceCreate(2, books[2], " Gollancz, 2015.", false, false),
      bookInstanceCreate(3,
        books[3],
        "New York Tom Doherty Associates, 2016.",
        false,
        "Available"
      ),
      bookInstanceCreate(4,
        books[3],
        "New York Tom Doherty Associates, 2016.",
        false,
        "Available"
      ),
      bookInstanceCreate(5,
        books[3],
        "New York Tom Doherty Associates, 2016.",
        false,
        "Available"
      ),
      bookInstanceCreate(6,
        books[4],
        "New York, NY Tom Doherty Associates, LLC, 2015.",
        false,
        "Available"
      ),
      bookInstanceCreate(7,
        books[4],
        "New York, NY Tom Doherty Associates, LLC, 2015.",
        false,
        "Maintenance"
      ),
      bookInstanceCreate(8,
        books[4],
        "New York, NY Tom Doherty Associates, LLC, 2015.",
        false,
        "Loaned"
      ),
      bookInstanceCreate(9, books[0], "Imprint XXX2", false, false),
      bookInstanceCreate(10, books[1], "Imprint XXX3", false, false),
    ]);
  }