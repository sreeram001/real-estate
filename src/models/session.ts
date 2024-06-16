import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Session extends Model {
  public id!: number;
  public user_id!: number;
  public session_token!: string;
  public readonly createdAt!: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    session_token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    tableName: "sessions",
    timestamps: true
  }
);

export default Session;
