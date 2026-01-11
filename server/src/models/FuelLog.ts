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
  fuelLevel?: number;
  isBeforeRefuel?: boolean;
  isAfterRefuel?: boolean;
  linkedLogId?: string;
  trackingState?: string;
  isPartialRefuel?: boolean;
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
  public fuelLevel?: number;
  public isBeforeRefuel?: boolean;
  public isAfterRefuel?: boolean;
  public linkedLogId?: string;
  public trackingState?: string;
  public isPartialRefuel?: boolean;

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
    fuelLevel: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    isBeforeRefuel: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isAfterRefuel: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    linkedLogId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    trackingState: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPartialRefuel: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'fuel_logs',
    timestamps: true,
  }
);

export default FuelLog;
