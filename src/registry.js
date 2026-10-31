import * as B from './assets/buildings.js';
import * as C from './assets/city.js';
import * as N from './assets/nature.js';
import * as T from './assets/terrain.js';
import * as I from './assets/infra.js';
import * as PR from './assets/props.js';
import * as V from './assets/vehicles.js';
import * as V2 from './assets/vehicles2.js';
import * as M from './assets/more.js';
import * as V3 from './assets/vehicles3.js';
import * as HD from './assets/holiday.js';
import { person, robot } from './assets/people.js';

// scale = preview zoom, oy = ground anchor (px from top), w/h = card size,
// dirs = draw all 4 headings, anim = has walk frames
const a = (cat, name, draw, o = {}) => ({ cat, name, draw: (ctx, r, opt) => draw(ctx, r, opt), ...o });
const home = { scale: 1.8, oy: 150 };
const wide = { scale: 1.15, oy: 175, w: 330, h: 230 };
const tall = { scale: 1.05, oy: 290, w: 230, h: 330 };
const tile = { scale: 2.4, oy: 110 };
const veh = { scale: 3.6, oy: 105, dirs: true };
const train = { scale: 2.3, oy: 108, dirs: true, cw: 210 };
const prop = { scale: 3.4, oy: 125 };

export const ASSETS = [
  // ---- homes ----
  a('Homes', 'Cottage', B.cottage, { scale: 2, oy: 150 }),
  a('Homes', 'House', B.house, home),
  a('Homes', 'Farmhouse', B.farmhouse, home),
  a('Homes', 'Bungalow', C.bungalow, home),
  a('Homes', 'Victorian', C.victorian, { scale: 1.6, oy: 160 }),
  a('Homes', 'Townhouses', C.townhouses, { ...wide, scale: 1.3 }),
  a('Homes', 'Mansion', C.mansion, { ...wide, scale: 1.05, oy: 160 }),
  a('Homes', 'Apartments', B.apartments, { scale: 1.4, oy: 165 }),
  a('Homes', 'Apartment tower', C.apartmentTower, { ...tall, scale: 1.2, oy: 250, h: 300 }),

  // ---- downtown ----
  a('Downtown', 'Glass tower', C.glassTower, tall),
  a('Downtown', 'Office tower', C.officeTower, { scale: 1.3, oy: 230, h: 280, w: 230 }),
  a('Downtown', 'Art deco tower', C.artDecoTower, tall),
  a('Downtown', 'Office block', C.officeMid, { scale: 1.4, oy: 190, h: 240 }),
  a('Downtown', 'Hotel', C.hotel, { scale: 1.2, oy: 260, h: 310, w: 230 }),
  a('Downtown', 'Shop', B.shop, home),
  a('Downtown', 'Café', C.cafe, { scale: 2, oy: 150 }),
  a('Downtown', 'Brewery', C.brewery, { scale: 1.5, oy: 170, h: 230 }),
  a('Downtown', 'Supermarket / mall', C.bigBox, { ...wide, scale: 1.3, oy: 175 }),
  a('Downtown', 'Gas station', C.gasStation, { scale: 1.6, oy: 160 }),
  a('Downtown', 'Parking garage', C.parkingGarage, { scale: 1.6, oy: 160, h: 230 }),

  // ---- civic ----
  a('Civic', 'Capitol', C.capitol, { ...wide, scale: 1.05, oy: 200, h: 270 }),
  a('Civic', 'Church', C.church, { scale: 1.3, oy: 190, h: 250 }),
  a('Civic', 'School', C.school, { ...wide, scale: 1.15 }),
  a('Civic', 'Hospital', C.hospital, { scale: 1.3, oy: 190, h: 250, w: 230 }),
  a('Civic', 'Fire station', C.fireStation, { scale: 1.5, oy: 175, h: 230 }),
  a('Civic', 'Police station', C.policeStation, { scale: 1.5, oy: 170 }),
  a('Civic', 'Stadium', C.stadium, { ...wide, scale: 1.2, oy: 170 }),

  // ---- industry & farm ----
  a('Industry', 'Warehouse', C.warehouse, { ...wide, scale: 1.1 }),
  a('Industry', 'Factory', C.factory, { ...wide, scale: 1.1, oy: 190, h: 260 }),
  a('Industry', 'Barn', B.barn, { scale: 1.6, oy: 150 }),
  a('Industry', 'Silo', B.silo, { scale: 1.8, oy: 160 }),
  a('Industry', 'Windmill', B.windmill, { scale: 1.5, oy: 170 }),
  a('Industry', 'Water tower', B.waterTower, { scale: 1.7, oy: 165 }),
  a('Industry', 'Crane', PR.crane, { scale: 1.4, oy: 270, h: 310 }),
  a('Industry', 'Shipping containers', PR.shippingContainers, { scale: 2.3, oy: 135 }),
  a('Industry', 'Pallet', PR.pallet, prop),

  // ---- airport & rail buildings ----
  a('Airport', 'Terminal', C.airportTerminal, { ...wide, scale: 1.05 }),
  a('Airport', 'Control tower', C.controlTower, { scale: 1.5, oy: 200, h: 250 }),
  a('Airport', 'Hangar', C.hangar, { ...wide, scale: 1.15 }),
  a('Airport', 'Windsock', I.windsock, { scale: 3, oy: 125 }),
  a('Airport', 'Runway', I.runway, { ...tile, dirs: true, cw: 190 }),
  a('Airport', 'Runway end', I.runwayEnd, { ...tile, dirs: true, cw: 190 }),
  a('Airport', 'Taxiway', I.taxiway, { ...tile, dirs: true, cw: 190 }),
  a('Airport', 'Apron', I.apron, tile),
  a('Rail', 'Union Station', C.unionStation, { ...wide, scale: 1.05, oy: 190, h: 250 }),
  a('Rail', 'Track X', I.trackX, tile),
  a('Rail', 'Track Y', I.trackY, tile),
  a('Rail', 'Track curve', I.trackCurve, { ...tile, dirs: true, cw: 190 }),
  a('Rail', 'Level crossing', I.railCrossing, tile),
  a('Rail', 'Platform', I.trainPlatform, tile),

  // ---- nature ----
  a('Nature', 'Pine', N.pine, { scale: 2, oy: 165 }),
  a('Nature', 'Spruce', N.spruce, { scale: 1.9, oy: 175, h: 220 }),
  a('Nature', 'Snowy pine', N.snowPine, { scale: 2, oy: 165 }),
  a('Nature', 'Leaf tree', N.leafTree, { scale: 2, oy: 160 }),
  a('Nature', 'Cottonwood', N.cottonwood, { scale: 1.7, oy: 170, h: 220 }),
  a('Nature', 'Aspen', N.aspen, { scale: 2.2, oy: 170, h: 220 }),
  a('Nature', 'Autumn tree', N.autumnTree, { scale: 2, oy: 160 }),
  a('Nature', 'Blossom tree', N.blossomTree, { scale: 2, oy: 160 }),
  a('Nature', 'Bush', N.bush, { scale: 3.2, oy: 125 }),
  a('Nature', 'Rock', N.rock, { scale: 3.2, oy: 125 }),
  a('Nature', 'Flowers', N.flowers, { scale: 3, oy: 125 }),
  a('Nature', 'Hay bale', N.hayBale, { scale: 3.2, oy: 125 }),
  a('Nature', 'Logs', N.log, { scale: 3.2, oy: 125 }),
  a('Nature', 'Wind turbine', PR.windTurbine, { scale: 1.5, oy: 250, h: 300, w: 260 }),
  a('Nature', 'Mountain', I.mountain, { scale: 1.9, oy: 140 }),
  a('Nature', 'Hill', I.hill, tile),

  // ---- terrain & land use ----
  a('Terrain', 'Grass', T.grass, tile),
  a('Terrain', 'Dirt', T.dirt, tile),
  a('Terrain', 'Sand', T.sand, tile),
  a('Terrain', 'Water', T.water, tile),
  a('Terrain', 'Pond', I.pond, tile),
  a('Terrain', 'Wheat field', T.fieldWheat, tile),
  a('Terrain', 'Cabbage field', T.fieldCabbage, tile),
  a('Terrain', 'Corn field', I.fieldCorn, tile),
  a('Terrain', 'Plowed field', T.fieldPlowed, tile),
  a('Terrain', 'Orchard', I.orchard, { scale: 2.4, oy: 120 }),
  a('Terrain', 'Solar farm', I.fieldSolar, tile),

  // ---- roads ----
  a('Roads', 'Country road X', T.roadX, tile),
  a('Roads', 'Country road Y', T.roadY, tile),
  a('Roads', 'Crossing', T.roadCross, tile),
  a('Roads', 'City street', I.cityStreet, { ...tile, dirs: true, cw: 190 }),
  a('Roads', 'City corner', I.roadCorner, { ...tile, dirs: true, cw: 190 }),
  a('Roads', 'City T-junction', I.roadT, { ...tile, dirs: true, cw: 190 }),
  a('Roads', 'Dead end', I.roadEnd, { ...tile, dirs: true, cw: 190 }),
  a('Roads', 'Bridge', I.bridge, { ...tile, dirs: true, cw: 190 }),
  a('Roads', 'Sidewalk', I.sidewalk, tile),
  a('Roads', 'Parking lot', I.parkingLot, tile),

  // ---- parks ----
  a('Parks', 'Park lawn', I.parkLawn, tile),
  a('Parks', 'Soccer field', I.soccerField, tile),
  a('Parks', 'Tennis court', I.tennisCourt, tile),
  a('Parks', 'Baseball diamond', I.baseballDiamond, tile),
  a('Parks', 'Playground', I.playground, { scale: 2.4, oy: 125 }),
  a('Parks', 'Fountain', I.fountain, { scale: 2.4, oy: 125 }),
  a('Parks', 'Statue', PR.statue, prop),
  a('Parks', 'Picnic table', PR.picnicTable, prop),
  a('Parks', 'Tent', PR.tent, prop),

  // ---- street props ----
  a('Props', 'Street lamp', PR.streetLamp, { scale: 2.6, oy: 215, h: 260 }),
  a('Props', 'Traffic light', PR.trafficLight, { scale: 2.6, oy: 215, h: 260 }),
  a('Props', 'Stop sign', PR.stopSign, { scale: 3.2, oy: 140 }),
  a('Props', 'Bench', PR.bench, prop),
  a('Props', 'Hydrant', PR.hydrant, { scale: 5, oy: 125 }),
  a('Props', 'Mailbox', PR.mailbox, { scale: 5, oy: 125 }),
  a('Props', 'Trash bin', PR.trashBin, { scale: 5, oy: 125 }),
  a('Props', 'Bus stop', PR.busStop, { scale: 2.8, oy: 140 }),
  a('Props', 'Billboard', PR.billboard, { scale: 2.4, oy: 160 }),
  a('Props', 'Fence X', PR.fenceX, prop),
  a('Props', 'Fence Y', PR.fenceY, prop),
  a('Props', 'Hedge', PR.hedge, prop),
  a('Props', 'Power pole', PR.powerPole, { scale: 2, oy: 235, h: 280 }),
  a('Props', 'Cell tower', PR.cellTower, { scale: 1.6, oy: 250, h: 290 }),
  a('Props', 'Solar panel', PR.solarPanel, prop),

  // ---- road vehicles ----
  a('Vehicles', 'Car', V.car, veh),
  a('Vehicles', 'Sports car', V2.sportsCar, veh),
  a('Vehicles', 'Taxi', V2.taxi, veh),
  a('Vehicles', 'Police car', V2.policeCar, veh),
  a('Vehicles', 'Ambulance', V2.ambulance, { ...veh, scale: 3.3 }),
  a('Vehicles', 'Pickup', V.pickup, { ...veh, scale: 3.4 }),
  a('Vehicles', 'Van', V.van, { ...veh, scale: 3.4 }),
  a('Vehicles', 'Motorbike', V2.motorbike, { ...veh, scale: 4.4 }),
  a('Vehicles', 'Bus', V.bus, { ...veh, scale: 2.6 }),
  a('Vehicles', 'Fire truck', V2.fireTruck, { ...veh, scale: 2.5 }),
  a('Vehicles', 'Garbage truck', V2.garbageTruck, { ...veh, scale: 2.5 }),
  a('Vehicles', 'Delivery truck', V.truck, { ...veh, scale: 2.5 }),
  a('Vehicles', 'Semi truck', V2.semiTruck, { ...veh, scale: 1.9, cw: 220 }),
  a('Vehicles', 'Tractor', V.tractor, { ...veh, scale: 3.4 }),
  a('Vehicles', 'Forklift', V2.forklift, { ...veh, scale: 4.2 }),

  // ---- trains ----
  a('Trains', 'Locomotive', V2.locomotive, train),
  a('Trains', 'Boxcar', V2.boxcar, train),
  a('Trains', 'Tank car', V2.tankCar, train),
  a('Trains', 'Container car', V2.containerCar, train),
  a('Trains', 'Passenger car', V2.passengerCar, train),
  a('Trains', 'Light rail', V2.lightRail, { ...train, scale: 1.6, cw: 230 }),

  // ---- aircraft ----
  a('Aircraft', 'Prop plane', V2.propPlane, { scale: 2.6, oy: 118, dirs: true }),
  a('Aircraft', 'Airliner', V2.airliner, { scale: 1.5, oy: 120, dirs: true, cw: 260 }),
  a('Aircraft', 'Helicopter', V2.helicopter, { scale: 3, oy: 118, dirs: true }),

  // ---- entertainment, food, services ----
  a('Entertainment', 'Cinema', M.cinema, { ...wide, scale: 1.3, oy: 170, h: 240 }),
  a('Entertainment', 'Museum', M.museum, { ...wide, scale: 1.1, oy: 180, h: 240 }),
  a('Entertainment', 'Ferris wheel', M.ferrisWheel, { scale: 1.5, oy: 215, h: 270, w: 240 }),
  a('Entertainment', 'Carousel', M.carousel, { scale: 2, oy: 150 }),
  a('Entertainment', 'Circus tent', M.circusTent, { scale: 1.8, oy: 165, h: 230 }),
  a('Food', 'Restaurant', M.restaurant, { scale: 1.8, oy: 150 }),
  a('Food', 'Bakery', M.bakery, { scale: 2, oy: 150 }),
  a('Food', 'Food truck', V3.foodTruck, { ...veh, scale: 3.4 }),
  a('Services', 'Bank', M.bank, { scale: 1.8, oy: 150 }),
  a('Services', 'Post office', M.postOffice, { scale: 1.8, oy: 150 }),
  a('Services', 'Library', M.library, { scale: 1.6, oy: 155 }),
  a('Services', 'Gym', M.gym, { scale: 1.7, oy: 155 }),
  a('Services', 'University', M.university, { ...wide, scale: 1.05, oy: 190, h: 260 }),
  a('Services', 'Subway entrance', M.subwayEntrance, { scale: 3, oy: 135 }),

  // ---- sports ----
  a('Sports', 'Arena', M.arena, { scale: 1.5, oy: 165, h: 220 }),
  a('Sports', 'Ski lodge', M.skiLodge, { scale: 1.6, oy: 170, h: 230 }),
  a('Sports', 'Chairlift tower', M.chairlift, { scale: 2.4, oy: 185, h: 240 }),
  a('Sports', 'Ski run', M.skiRun, tile),
  a('Sports', 'Golf green', M.golfGreen, tile),
  a('Sports', 'Swimming pool', M.swimmingPool, tile),
  a('Sports', 'Skate park', M.skatePark, tile),
  a('Sports', 'Football field', M.footballField, tile),
  a('Sports', 'Basketball court', M.basketballCourt, tile),

  // ---- utilities ----
  a('Utilities', 'Power plant', M.powerPlant, { ...wide, scale: 1.05, oy: 190, h: 260 }),
  a('Utilities', 'Substation', M.substation, { scale: 2.4, oy: 125 }),
  a('Utilities', 'Pumpjack', M.pumpjack, { scale: 3, oy: 140 }),
  a('Utilities', 'Grain elevator', M.grainElevator, { scale: 1.5, oy: 190, h: 250 }),
  a('Utilities', 'Dam', M.dam, { scale: 2.2, oy: 150 }),
  a('Utilities', 'Wastewater plant', M.wastewater, { scale: 2, oy: 130 }),

  // ---- outdoors & water ----
  a('Outdoors', 'Log cabin', M.logCabin, { scale: 2, oy: 150 }),
  a('Outdoors', 'Campground', M.campground, tile),
  a('Outdoors', 'Cemetery', M.cemetery, tile),
  a('Outdoors', 'Lighthouse', M.lighthouse, { scale: 1.8, oy: 200, h: 250 }),
  a('Outdoors', 'Boathouse', M.boathouse, { scale: 2, oy: 150 }),
  a('Outdoors', 'Dock', M.dock, tile),
  a('Boats', 'Sailboat', V3.sailboat, { scale: 2.6, oy: 140, h: 230, dirs: true, base: 'water' }),
  a('Boats', 'Motor boat', V3.motorBoat, { scale: 3.2, oy: 120, dirs: true, base: 'water' }),
  a('Boats', 'Ferry', V3.ferry, { scale: 2.2, oy: 120, dirs: true, base: 'water' }),
  a('Boats', 'Fishing boat', V3.fishingBoat, { scale: 2.8, oy: 120, dirs: true, base: 'water' }),
  a('Boats', 'Kayak', V3.kayak, { scale: 4, oy: 115, dirs: true, base: 'water' }),
  a('Vehicles', 'RV', V3.rv, { ...veh, scale: 2.6 }),
  a('Vehicles', 'School bus', V3.schoolBus, { ...veh, scale: 2.6 }),
  a('Vehicles', 'Snowplow', V3.snowplow, { ...veh, scale: 2.8 }),
  a('Aircraft', 'Hot air balloon', V3.hotAirBalloon, { scale: 2.2, oy: 200, h: 250 }),

  // ---- holidays ----
  a('Holiday', 'Haunted house', HD.hauntedHouse, { scale: 1.6, oy: 190, h: 270 }),
  a('Holiday', 'Pumpkin patch', HD.pumpkinPatch, { scale: 3, oy: 130 }),
  a('Holiday', 'Jack-o-lantern', HD.jackOLantern, { scale: 2.6, oy: 130 }),
  a('Holiday', 'Ghost', HD.ghostProp, { scale: 2.6, oy: 130 }),
  a('Holiday', 'Graveyard', HD.graveyard, { scale: 2.8, oy: 130 }),
  a('Holiday', 'Scarecrow', HD.scarecrow, { scale: 2.4, oy: 150 }),
  a('Holiday', 'Corn stalks', HD.cornStalks, { scale: 2.4, oy: 135 }),
  a('Holiday', 'Christmas tree', HD.treeLights, { scale: 1.9, oy: 140 }),
  a('Holiday', 'Snowman', HD.snowmanProp, { scale: 2.2, oy: 140 }),
  a('Holiday', 'Gifts', HD.giftPile, { scale: 2.4, oy: 125 }),
  a('Holiday', 'Easter basket', HD.easterBasket, { scale: 2.6, oy: 125 }),
  a('Holiday', 'Valentine hearts', HD.valentineHeart, { scale: 1.8, oy: 140 }),
  a('Holiday', 'Shamrock', HD.shamrockProp, { scale: 2.2, oy: 125 }),
  a('Holiday', 'Fireworks', HD.fireworks, { scale: 1.6, oy: 190, h: 240 }),

  // ---- animals & people ----
  a('Animals', 'Cow', V.cow, { scale: 4, oy: 105, dirs: true, anim: true }),
  a('Animals', 'Sheep', V.sheep, { scale: 4.5, oy: 105, dirs: true, anim: true }),
  a('People', 'Villager', person, { scale: 4.2, oy: 120, dirs: true, anim: true }),
  a('People', 'Villager 2', person, { scale: 4.2, oy: 120, dirs: true, anim: true, seedOffset: 7 }),
  a('People', 'Villager 3', person, { scale: 4.2, oy: 120, dirs: true, anim: true, seedOffset: 19 }),
  a('People', 'Villager 4', person, { scale: 4.2, oy: 120, dirs: true, anim: true, seedOffset: 31 }),
  a('People', 'Robot', robot, { scale: 4.2, oy: 120, dirs: true, anim: true }),
  a('People', 'Robot 2', robot, { scale: 4.2, oy: 120, dirs: true, anim: true, seedOffset: 7 }),
  a('People', 'Robot 3', robot, { scale: 4.2, oy: 120, dirs: true, anim: true, seedOffset: 19 }),
];

export const CATEGORIES = [...new Set(ASSETS.map((x) => x.cat))];
