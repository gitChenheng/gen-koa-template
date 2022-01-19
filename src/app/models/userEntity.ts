import {
  DataType,
  AutoIncrement,
  BeforeBulkCreate,
  BeforeCreate,
  Column,
  Model,
  PrimaryKey,
  Table,
  Unique, AllowNull,
} from "sequelize-typescript";
import {newUuid} from "@/src/utils/uuid";
import {DECIMAL} from "sequelize";

@Table({tableName: 'user', timestamps: true})
export default class UserEntity extends Model<UserEntity>{
  @BeforeCreate
  static beforeUserCreate(user: UserEntity){
    if(!user.uid){
      user.uid = newUuid();
    }
  }
  @BeforeBulkCreate
  static beforeBulkUsersCreate(users: UserEntity[]) {
    users.forEach(this.beforeUserCreate);
  }
  
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  public id: number;
  
  @Unique
  @Column(DataType.UUID)
  public uid: string;
  
  @Column(DataType.STRING(20))
  public username: string;
  
  @Column(DataType.STRING(130))
  public pwd: string;
  
  @Unique
  @Column(DataType.STRING(20))
  public phone: string;
  
  @AllowNull
  @Column(DataType.BOOLEAN)
  public gender: boolean;
  
  @AllowNull
  @Column(DataType.INTEGER)
  public age: number;
  
  @AllowNull
  @Column(DataType.STRING(50))
  public memo: string;
  
  @AllowNull
  @Column(DataType.STRING(50))
  public city: string;
  
  @AllowNull
  @Column(DataType.STRING(50))
  public province: string;
  
  @AllowNull
  @Column(DataType.STRING(50))
  public country: string;
  
  @AllowNull
  @Column(DataType.STRING(20))
  public language: string;
  
  @AllowNull
  @Column(DataType.TEXT) // 收货地址
  public address: string;
  
  @AllowNull
  @Column(DataType.BIGINT)
  public credit: number;
  
  @AllowNull
  @Column(DECIMAL(20, 2))//充值余额 总长，小数点右边长度
  public balance: number;
  
}
