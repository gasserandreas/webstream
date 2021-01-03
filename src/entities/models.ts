export type Id = string;

export interface IdObject {
  id: Id;
}

export interface Stream extends IdObject {
  href: string;
}
