import CarDetails from "./CarDetails";
import OilChange from "./OilChange";
import FuelLog from "./FuelLog";
import Expense from "./Expense";
import User from "./User";

// Define associations
User.hasMany(CarDetails, {
  foreignKey: "userId",
  as: "cars",
});

CarDetails.belongsTo(User, {
  foreignKey: "userId",
  as: "owner",
});

CarDetails.hasMany(OilChange, {
  foreignKey: "carId",
  as: "oilChanges",
});

CarDetails.hasMany(FuelLog, {
  foreignKey: "carId",
  as: "fuelLogs",
});

CarDetails.hasMany(Expense, {
  foreignKey: "carId",
  as: "expenses",
});

OilChange.belongsTo(CarDetails, {
  foreignKey: "carId",
  as: "car",
});

FuelLog.belongsTo(CarDetails, {
  foreignKey: "carId",
  as: "car",
});

Expense.belongsTo(CarDetails, {
  foreignKey: "carId",
  as: "car",
});

export { CarDetails, OilChange, FuelLog, Expense, User };
