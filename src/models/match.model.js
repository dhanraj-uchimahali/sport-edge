import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Match extends Model {
    static associate({ Commentary }) {
      this.hasMany(Commentary, { foreignKey: "match_id", as: "commentary" });
    }
  }

  Match.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sport: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      home_team: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      away_team: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("scheduled", "live", "finished"),
        allowNull: false,
        defaultValue: "scheduled",
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      home_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      away_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Match",
      tableName: "matches",
      timestamps: false,
      underscored: true,
    }
  );

  return Match;
};
