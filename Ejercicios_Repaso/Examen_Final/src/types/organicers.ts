import { OrganicerRole } from "./enums";

export type Organicers = {
  id: string;
  name: string;
  role: OrganicerRole;
  createdAt: Date;
};
