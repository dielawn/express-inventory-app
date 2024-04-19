#! /usr/bin/env node

console.log(
    'This script populates some test tires, manufacturers, sizes, class/season and tireinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Tire = require('./models/tire.js');
  const TireSize = require('./models/tire_size.js')
  const TireInstance = require('./models/tireIsnstance.js');
  const Manufacturer = require('./models/manufacturer.js');
  const Category = require('./models/category.js');
  
  
  const tires = [];
  const manufacturers = [];
  const sizes = [];
  const tireInstances = [];
  const categories = []
  
  const mongoose = require("mongoose");
 
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createManufacturers();
    await createSizes();
    await createTires();
    await createTireInstances();    
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // categpry[0] will always be the first category, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function categoryCreate(index, tireClass, season, description) {
    const categoryDetail = { tire_class: tireClass, season: season, description: description }
    const category = new Category(categoryDetail);
    await category.save();
    category[index] = category;
    console.log(`Added category: ${categoryDetail.tire_class}, ${categoryDetail.season}`);
  }
  
  async function manufacturerCreate(index, name, location) {
    const manufacturer = new Manufacturer({ name: name, location: location});  
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
    console.slog(`Added size: ${this.tread_width}/${this.aspect_ratio}/${this.wheel_dia}`)
  };
  
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
    console.log("Adding tire classes");
    await Promise.all([
        //all season
        categoryCreate(0, 'LT', "All Season", ltDesc),
        categoryCreate(1, 'P', "All Season", pDesc),
        categoryCreate(2, 'C', "All Season", cDesc ),
        categoryCreate(3, 'D', "All Season", dDesc ),
        categoryCreate(4, 'ST', "All Season", stDesc ),
        categoryCreate(5, 'T', "All Season", tDesc ),
        categoryCreate(6, 'AT', "All Season", atDesc ),
        categoryCreate(7, 'MT', "All Season", mtDesc ),
        categoryCreate(8, 'HT', "All Season", htDesc ),
        categoryCreate(9, 'UHP', "All Season", uhpDesc ),
        categoryCreate(10, 'RFT', "All Season", rftDesc ),
        categoryCreate(11, 'EV', "All Season", evDesc ),
        //winter
        categoryCreate(13, 'LT', "Winter", ltDesc),
        categoryCreate(14, 'P', "Winter", pDesc),
        categoryCreate(15, 'C', "Winter", cDesc ),
        categoryCreate(16, 'D', "Winter", dDesc ),
        categoryCreate(17, 'ST', "Winter", stDesc ),
        categoryCreate(18, 'T', "Winter", tDesc ),
        categoryCreate(19, 'AT', "Winter", atDesc ),
        categoryCreate(20, 'MT', "Winter", mtDesc ),
        categoryCreate(21, 'HT', "Winter", htDesc ),
        categoryCreate(22, 'UHP', "Winter", uhpDesc ),
        categoryCreate(23, 'RFT', "Winter", rftDesc ),
        categoryCreate(24, 'EV', "Winter", evDesc ),
    ]);
  }
  
  async function createManufacturers() {
    console.log("Adding manufacturers");
    await Promise.all([
      manufacturerCreate(0, 'Bridgestone', 'Japan'),
      manufacturerCreate(1, "Firestone", 'Japan'),
      manufacturerCreate(2, "Michelin", 'France'),
      manufacturerCreate(3, "Hankook", 'South Korea'),
      manufacturerCreate(4, "Goodyear", 'USA'),
      manufacturerCreate(5, "Cooper", 'USA'),
    ]);
  }
  
  async function createTires() {
    console.log("Adding Tires");
    await Promise.all([
      tireCreate(0,
        "Turanza",
        manufacturers[0],
        "Take on the road with a quiet, comfortable ride with the Turanza QuietTrack touring tire. These impressive all-season tires deliver control in wet and snowy conditions and are built to last for up to 80,000 miles*. Designed to fit many of today’s most popular cars and sedans, the Turanza QuietTrack is engineered to impress.",
        "9781473211896",
        categories[1],
        tireInstances.tire.length,
        180.79,
        217.99,        
      ),
      tireCreate(1,
        "Potenza S007A",
        manufacturers[0],
        'Take your sports car for a spin with more power from the Potenza S007A RFT. These tires will elevate your experience with higher contact pressure of the tire to the road for better braking in wet conditions. Engineered for a thrilling ride, the tread pattern allows greater stability and control during cornering and also offers excellent responsiveness.',
        "9788401352836",
        categories[10],
        tireInstances.tire.length,        
        262.45,
        364.99,
      ),
      tireCreate(2,
        "Blizzak LN005",
        manufacturers[0],
        "Get the most of out your sports car this winter with the BlizzakTM LM005 winter performance tire. Its high sipe density tread assists with traction on snow and ice, while the advanced tread compound provides confident grip and braking. Whatever winter throws your way – from rain and slush to snow and ice – the BlizzakTM LM005 tire will keep you moving in various conditions.",
        "9780756411336",
        categories[14],
        tireInstances.tire.length, 
        311.25,
        375.99,
      ),
      tireCreate(3,
        "Dueler H/T",
        manufacturers[0],
        "Give your truck heavy-duty performance year after year with technologies engineered around confident traction on wet and dry surfaces with the Dueler H/T 685 tires",
        "9780765379528",
        categories[21],
        tireInstances.tire.length,
        225.62,
        306.99,       
      ),
      tireCreate(4,
        "Dueler A/T Revo 3",
        manufacturers[0],
        "Take on the most intense weather conditions both on and off road with Dueler A/T Revo 3 tires. Engineered with our advanced Traction Claw™ technology, these tires improve driving performance on wet and snowy surfaces.",
        "9780765379504",
        categories[6],        
        tireInstances.tire.length,
        311.11,
        353.99,
      ),
      tireCreate(5,
        "Wrangler DuraTrac",
        manufacturers[4],
        "TractiveGroove Technology™ offers enhanced traction in deep mud and snow. Self-cleaning shoulder blocks clear the tread of debris for enhanced dirt, gravel and mud traction. Highly angled center tread blocks enhance traction and lateral stability while reducing road noise.",
        "ISBN111111",
        categories[0],
        tireInstances.tire.length,
        225.65,
        345.99,       
      ),
      tireCreate(6,
        "Assurance WeatherReady",
        manufacturers[4],
        'Our best all-season tire has an asymmetric tread pattern and sweeping traction grooves to evacuate water and deliver excellent wet traction. As the tire wears, Evolving Traction Grooves™ transition from deep grooves to wide grooves to help displace water on the road.',
        "ISBN222222",
        categories[1],
        tireInstances.tire.length,
        185.45,
        225.99,
      ),
    ]);
  }

  async function createSizes() {
    console.log('Adding sizses')
    await Promise.all([
        sizeCreate(0, 245, 75, 16),
        sizeCreate(1, 195, 70, 15),
        sizeCreate(2, 205, 70, 15),
        sizeCreate(3, 225, 65, 16),
        sizeCreate(4, 225, 45, 17),
        sizeCreate(5, 235, 75, 15),
        sizeCreate(6, 265, 55, 18),
        sizeCreate(7, 255, 45, 18),
        sizeCreate(8, 245, 55, 17),
        sizeCreate(9, 285, 75, 18),
        sizeCreate(10, 285, 60, 20),
        sizeCreate(11, 275, 55, 20),
        sizeCreate(12, 305, 40, 22),
    ])
  }
  
  async function createTireInstances() {
    console.log("Adding manufacturers");
    await Promise.all([
      tireInstanceCreate(0, tires[5], sizes[0], 'DOTU2LLLMLR5107', "3223"),
      tireInstanceCreate(1, tires[5], sizes[0], 'DOTU2LLLMLR5108', "3223"),
      tireInstanceCreate(2, tires[5], sizes[0], 'DOTU2LLLMLR5106', "3223"),
      tireInstanceCreate(3, tires[5], sizes[0], 'DOTU2LLLMLR5109', "3223"),
      tireInstanceCreate(4, tires[6], sizes[1], 'DOTU2LLLMLR5110', "3223"),
      tireInstanceCreate(5, tires[6], sizes[1], 'DOTU2LLLMLR5111', "3223"),
      tireInstanceCreate(6, tires[6], sizes[1], 'DOTU2LLLMLR5112', "3223"),
      tireInstanceCreate(7, tires[6], sizes[1], 'DOTU2LLLMLR5113', "3223"),
      tireInstanceCreate(8, tires[2], sizes[2], 'DOTU2LLLMLR5114', "3223"),
      tireInstanceCreate(9, tires[2], sizes[2], 'DOTU2LLLMLR5115', "3223"),
      tireInstanceCreate(10, tires[2], sizes[2], 'DOTU2LLLMLR5116', "3223"),
      tireInstanceCreate(11, tires[2], sizes[2], 'DOTU2LLLMLR5117', "3223"),
      tireInstanceCreate(12, tires[0], sizes[3], 'DOTU2LLLMLR5118', "3223"),
      tireInstanceCreate(13, tires[0], sizes[3], 'DOTU2LLLMLR5119', "3223"),
      tireInstanceCreate(14, tires[0], sizes[3], 'DOTU2LLLMLR5120', "3223"),
      tireInstanceCreate(15, tires[0], sizes[3], 'DOTU2LLLMLR5121', "3223"),
      tireInstanceCreate(16, tires[0], sizes[4], 'DOTU2LLLMLR5122', "3223"),
      tireInstanceCreate(17, tires[0], sizes[4], 'DOTU2LLLMLR5123', "3223"),
      tireInstanceCreate(18, tires[0], sizes[4], 'DOTU2LLLMLR5124', "3223"),
      tireInstanceCreate(19, tires[0], sizes[4], 'DOTU2LLLMLR5125', "3223"),
      tireInstanceCreate(20, tires[3], sizes[5], 'DOTU2LLLMLR5126', "3223"),
      tireInstanceCreate(21, tires[3], sizes[5], 'DOTU2LLLMLR5127', "3223"),
      tireInstanceCreate(22, tires[3], sizes[5], 'DOTU2LLLMLR5128', "3223"),
      tireInstanceCreate(23, tires[3], sizes[5], 'DOTU2LLLMLR5129', "3223"),
      tireInstanceCreate(24, tires[4], sizes[6], 'DOTU2LLLMLR5130', "3223"),
      tireInstanceCreate(25, tires[4], sizes[6], 'DOTU2LLLMLR5131', "3223"),
      tireInstanceCreate(26, tires[4], sizes[6], 'DOTU2LLLMLR5132', "3223"),
      tireInstanceCreate(27, tires[4], sizes[6], 'DOTU2LLLMLR5133', "3223"),
      tireInstanceCreate(28, tires[3], sizes[7], 'DOTU2LLLMLR5134', "3223"),
      tireInstanceCreate(29, tires[3], sizes[7], 'DOTU2LLLMLR5135', "3223"),
      tireInstanceCreate(30, tires[3], sizes[7], 'DOTU2LLLMLR5136', "3223"),
      tireInstanceCreate(31, tires[3], sizes[7], 'DOTU2LLLMLR5137', "3223"),
      tireInstanceCreate(32, tires[3], sizes[8], 'DOTU2LLLMLR5138', "3223"),
      tireInstanceCreate(33, tires[3], sizes[8], 'DOTU2LLLMLR5139', "3223"),
      tireInstanceCreate(33, tires[3], sizes[8], 'DOTU2LLLMLR5140', "3223"),
      tireInstanceCreate(33, tires[3], sizes[8], 'DOTU2LLLMLR5141', "3223"),
      tireInstanceCreate(33, tires[4], sizes[9], 'DOTU2LLLMLR5142', "3223"),
      tireInstanceCreate(33, tires[4], sizes[9], 'DOTU2LLLMLR5143', "3223"),
      tireInstanceCreate(33, tires[4], sizes[9], 'DOTU2LLLMLR5144', "3223"),
      tireInstanceCreate(33, tires[4], sizes[9], 'DOTU2LLLMLR5145', "3223"),
      tireInstanceCreate(33, tires[3], sizes[10], 'DOTU2LLLMLR5146', "3223"),
      tireInstanceCreate(33, tires[3], sizes[10], 'DOTU2LLLMLR5147', "3223"),
      tireInstanceCreate(33, tires[5], sizes[11], 'DOTU2LLLMLR5148', "3223"),
      tireInstanceCreate(33, tires[5], sizes[11], 'DOTU2LLLMLR5149', "3223"),
      tireInstanceCreate(33, tires[5], sizes[11], 'DOTU2LLLMLR5150', "3223"),
      tireInstanceCreate(33, tires[5], sizes[11], 'DOTU2LLLMLR5151', "3223"),
      tireInstanceCreate(33, tires[1], sizes[12], 'DOTU2LLLMLR5152', "3223"),
      tireInstanceCreate(33, tires[1], sizes[12], 'DOTU2LLLMLR5153', "3223"),
      tireInstanceCreate(33, tires[1], sizes[12], 'DOTU2LLLMLR5154', "3223"),
      tireInstanceCreate(33, tires[1], sizes[12], 'DOTU2LLLMLR5155', "3223"),
    ]);
  }