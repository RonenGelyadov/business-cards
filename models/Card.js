import { model, Schema } from 'mongoose';

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

const CardSchema = new Schema({
  title: String,
  subtitle: String,
  description: String,
  phone: String,
  email: String,
  web: String,
  image: ImageSchema,
  address: AddressSchema,
  bizNumber: { type: Number, unique: true },
  likes: { type: [Schema.Types.ObjectId], default: [] },
  user_id: {
    type: Schema.Types.ObjectId,
    index: true,
  },
});

const Card = model('cards', CardSchema);

export default Card;
