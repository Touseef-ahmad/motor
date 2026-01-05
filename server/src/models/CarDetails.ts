import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CarDetailsAttributes {
  id: string;
  userId?: string;
  name: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;
  purchaseDate?: string;
  currentMileage: number;
  images: string[];
  emoji: string;
  backgroundStyle: 'solid' | 'gradient' | 'animated';
  backgroundColor: string;
  secondaryColor?: string;
}

interface CarDetailsCreationAttributes extends Optional<CarDetailsAttributes, 'id'> {}

class CarDetails extends Model<CarDetailsAttributes, CarDetailsCreationAttributes>
  implements CarDetailsAttributes {
  public id!: string;
  public userId?: string;
  public name!: string;
  public make!: string;
  public model!: string;
  public year!: number;
  public color!: string;
  public licensePlate!: string;
  public vin?: string;
  public purchaseDate?: string;
  public currentMileage!: number;
  public images!: string[];
  public emoji!: string;
  public backgroundStyle!: 'solid' | 'gradient' | 'animated';
  public backgroundColor!: string;
  public secondaryColor?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CarDetails.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    purchaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    currentMileage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    emoji: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '🚗',
    },
    backgroundStyle: {
      type: DataTypes.ENUM('solid', 'gradient', 'animated'),
      allowNull: false,
      defaultValue: 'gradient',
    },
    backgroundColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#007AFF',
    },
    secondaryColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'car_details',
    timestamps: true,
  }
);

export default CarDetails;
