import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ExpenseAttributes {
  id: string;
  carId: string;
  date: string;
  category: 'Maintenance' | 'Fuel' | 'Insurance' | 'Repair' | 'Registration' | 'Other';
  description: string;
  amount: number;
  mileage?: number;
  notes?: string;
}

interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, 'id'> {}

class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes>
  implements ExpenseAttributes {
  public id!: string;
  public carId!: string;
  public date!: string;
  public category!: 'Maintenance' | 'Fuel' | 'Insurance' | 'Repair' | 'Registration' | 'Other';
  public description!: string;
  public amount!: number;
  public mileage?: number;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Expense.init(
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
    category: {
      type: DataTypes.ENUM('Maintenance', 'Fuel', 'Insurance', 'Repair', 'Registration', 'Other'),
      allowNull: false,
      defaultValue: 'Other',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    mileage: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'expenses',
    timestamps: true,
  }
);

export default Expense;
