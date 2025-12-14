import { OrganicerRole } from "./enums";

export type Organicers = {
  _id: string,
  name: string,
  email: string,
  password: string,
  role: OrganicerRole,
  createdAt: Date,
};
