import {AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table} from "sequelize-typescript";

@Table({tableName: "msg", timestamps: true})
export default class MsgEntity extends Model<MsgEntity>{
  
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  public id: number;
  
  @Column(DataType.UUID)
  public from: string;
  
  @Column(DataType.UUID)
  public to: string;
  
  @Default(1)
  @Column(DataType.INTEGER)//1.text 2.img 3.emo 4.
  public type: number;
  
  @Column(DataType.TEXT)
  public msg: string;
  
  
  
}
