import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface FuelLogAttributes {
  id: string;
  carId: string;
  date: string;
  mileage: number;
  liters: number;
  cost: number;
  pricePerLiter: number;
  fuelType: 'Regular' | 'Premium' | 'Diesel' | 'Electric';
  fullTank: boolean;
  notes?: string;
}

interface FuelLogCreationAttributes extends Optional<FuelLogAttributes, 'id'> {}

class FuelLog extends Model<FuelLogAttributes, FuelLogCreationAttributes>
  implements FuelLogAttributes {
  public id!: string;
  public carId!: string;
  public date!: string;
  public mileage!: number;
  public liters!: number;
  public cost!: number;
  public pricePerLiter!: number;
  public fuelType!: 'Regular' | 'Premium' | 'Diesel' | 'Electric';
  public fullTank!: boolean;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FuelLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    carId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'car_details',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    mileage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    liters: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pricePerLiter: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    fuelType: {
      type: DataTypes.ENUM('Regular', 'Premium', 'Diesel', 'Electric'),
      allowNull: false,
      defaultValue: 'Regular',
    },
    fullTank: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'fuel_logs',
    timestamps: true,
  }
);

export default FuelLog;
