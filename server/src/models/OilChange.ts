import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface OilChangeAttributes {
  id: string;
  carId: string;
  date: string;
  mileage: number;
  cost: number;
  notes?: string;
  nextChangeMileage?: number;
  nextChangeDate?: string;
}

interface OilChangeCreationAttributes extends Optional<OilChangeAttributes, 'id'> {}

class OilChange extends Model<OilChangeAttributes, OilChangeCreationAttributes>
  implements OilChangeAttributes {
  public id!: string;
  public carId!: string;
  public date!: string;
  public mileage!: number;
  public cost!: number;
  public notes?: string;
  public nextChangeMileage?: number;
  public nextChangeDate?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OilChange.init(
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
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nextChangeMileage: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    nextChangeDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'oil_changes',
    timestamps: true,
  }
);

export default OilChange;
