import { model, Schema } from 'mongoose';

const NameSchema = new Schema({
  first: String,
  middle: String,
  last: String,
});

const ImageSchema = new Schema({
  url: String,
  alt: String,
});

const AddressSchema = new Schema({
  state: { type: String, default: 'not defined' },
  country: String,
  city: String,
  street: String,
  houseNumber: Number,
  zip: { type: Number, default: 0 },
});

const UserSchema = new Schema({
  name: NameSchema,
  phone: String,
  email: { type: String, unique: true },
  password: String,
  image: ImageSchema,
  address: AddressSchema,
  isAdmin: { type: Boolean, default: false },
  isBusiness: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = model('users', UserSchema);

export default User;
