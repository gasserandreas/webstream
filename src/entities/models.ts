export type Id = string;

export interface IdObject {
  id: Id;
}

export interface Stream extends IdObject {
  href: string;
}

export interface Link extends IdObject {
  value: string;
}

export type LinkList = Array<Link>;
