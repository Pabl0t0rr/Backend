import { OrganicerRole } from "./enums";

export type Organicers = {
  id: string,
  name: string,
  email: string,
  password: string,
  role: OrganicerRole,
  createdAt: Date,
};
