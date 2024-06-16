import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public mobile_no!: number;
  public status!: boolean;
  public role!: string;
  public salt!: string;
  public approved!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    mobile_no: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    account_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true
  }
);

export default User;
