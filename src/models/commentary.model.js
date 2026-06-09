import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Commentary extends Model {
    static associate({ Match }) {
      this.belongsTo(Match, { foreignKey: "match_id", as: "match" });
    }
  }

  Commentary.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      match_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "matches",
          key: "id",
        },
      },
      minute: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sequence: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      period: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      event_type: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      actor: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      team: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Commentary",
      tableName: "commentary",
      timestamps: false,
      underscored: true,
    }
  );

  return Commentary;
};
