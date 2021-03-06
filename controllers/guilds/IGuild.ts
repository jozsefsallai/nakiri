export interface IGuild {
  id: string;
  name: string;
  icon?: string | null;
  owner: boolean;
  permissions: number;
  features: string[];
  permissions_new: string;
}
